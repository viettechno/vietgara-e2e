// E2E-INV-022 · Two draft counts are merged into one
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-022 two draft counts are merged into one', async ({ freshOwner }) => {
  const owner = await freshOwner('inv022', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV022' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '4', unitCost: 50 })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-01', name: 'Spark plug', quantity: '3', unitCost: 200 })

  // Step 1: two people count different shelves; the oil is on both, the plug was not counted.
  const shelfA = await owner.api.createCountedStockCount(gid, 'Shelf A', { [oil.id ?? '']: '4', [filter.id ?? '']: '4' })
  let shelfB = await owner.api.createStockCount(gid, { name: 'Shelf B' })
  shelfB = await owner.api.addStockCountLines(gid, shelfB.id ?? '', [oil.id ?? '', plug.id ?? ''])
  shelfB = await owner.api.countStockLine(gid, shelfB.id ?? '', countLine(shelfB, 'OIL-5W30').id ?? '', '6')

  // Step 2: merged into the first draft: the shared oil adds up, the plug stays uncounted.
  const merged = await owner.api.mergeStockCounts(gid, [shelfA.id ?? '', shelfB.id ?? ''])
  expect(merged.id).toBe(shelfA.id)
  expect(merged.lines).toHaveLength(3)
  expect(countLine(merged, 'OIL-5W30').countedQuantity).toBe('10')
  expect(merged.uncountedLines).toBe(1)

  // Step 3: the absorbed draft is cancelled and empty, and cannot be merged again.
  const absorbed = await owner.api.getStockCount(gid, shelfB.id ?? '')
  expect(absorbed.status).toBe('STOCK_COUNT_STATUS_CANCELLED')
  expect(absorbed.lines ?? []).toHaveLength(0)
  await expectRefused(owner.api.mergeStockCounts(gid, [shelfA.id ?? '', shelfB.id ?? '']), 409, 'STOCK_COUNT_NOT_DRAFT')

  // Step 4: skipping the uncounted plug posts the rest.
  await owner.api.completeStockCount(gid, merged.id ?? '', true)
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('4')
  expect(await onHand(owner.api, gid, plug)).toBe('3')
})
