// E2E-INV-021 · Completing a count with uncounted lines is refused, unless they are skipped
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-021 completing a count with uncounted lines is refused, unless they are skipped', async ({ freshOwner }) => {
  const owner = await freshOwner('inv021', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV021' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '4', unitCost: 50 })

  // Step 1-2: two lines, only the oil counted; completing is refused and changes nothing.
  let count = await owner.api.createStockCount(gid, { name: 'Partial' })
  count = await owner.api.addStockCountLines(gid, count.id ?? '', [oil.id ?? '', filter.id ?? ''])
  count = await owner.api.countStockLine(gid, count.id ?? '', countLine(count, 'OIL-5W30').id ?? '', '8')
  expect(count.uncountedLines).toBe(1)
  await expectRefused(owner.api.completeStockCount(gid, count.id ?? ''), 409, 'STOCK_COUNT_HAS_UNCOUNTED_LINES')
  expect((await owner.api.getStockCount(gid, count.id ?? '')).status).toBe('STOCK_COUNT_STATUS_DRAFT')
  expect(await onHand(owner.api, gid, oil)).toBe('10')

  // Steps 3-4: skipping the uncounted line completes the rest and drops that line.
  count = await owner.api.completeStockCount(gid, count.id ?? '', true)
  expect(count.status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(count.lines).toHaveLength(1)
  expect(count.lines?.[0]?.partSku).toBe('OIL-5W30')
  expect(await onHand(owner.api, gid, oil)).toBe('8')
  expect(await onHand(owner.api, gid, filter)).toBe('4')
})
