// E2E-INV-022 · Two drafts merge into one; uncounted lines are skipped on completion
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: driven over the API; the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-022 two drafts merge into one; uncounted lines are skipped on completion', async ({ freshOwner }) => {
  const owner = await freshOwner('inv022', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV022' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '4', unitCost: 50, unit: PIECE })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-M12', name: 'Spark plug M12', quantity: '3', unitCost: 200, unit: PIECE })

  // Step 1: two people count different shelves; the oil is on both, the plug on D was not counted.
  const shelfC = await owner.api.createCountedStockCount(gid, 'Shelf C', { [oil.id ?? '']: '4', [filter.id ?? '']: '4' })
  let shelfD = await owner.api.createStockCount(gid, { name: 'Shelf D' })
  shelfD = await owner.api.addStockCountLines(gid, shelfD.id ?? '', [oil.id ?? '', plug.id ?? ''])
  shelfD = await owner.api.countStockLine(gid, shelfD.id ?? '', countLine(shelfD, 'OIL-5W30').id ?? '', '6')

  // Step 2: merging needs two drafts.
  await expectRefused(owner.api.mergeStockCounts(gid, [shelfC.id ?? '']), 422)

  // Step 3: C is kept: the oil adds up (4 + 6), the filter stays, the uncounted plug comes along.
  const merged = await owner.api.mergeStockCounts(gid, [shelfC.id ?? '', shelfD.id ?? ''])
  expect(merged.id).toBe(shelfC.id)
  expect(merged.lines).toHaveLength(3)
  expect(countLine(merged, 'OIL-5W30').countedQuantity).toBe('10')
  expect(countLine(merged, 'FILTER-01').countedQuantity).toBe('4')
  expect(countLine(merged, 'PLUG-M12').result).toBe('STOCK_COUNT_LINE_RESULT_UNCOUNTED')

  // Step 4: D is cancelled, emptied, and points to the count it went into.
  const absorbed = await owner.api.getStockCount(gid, shelfD.id ?? '')
  expect(absorbed.status).toBe('STOCK_COUNT_STATUS_CANCELLED')
  expect(absorbed.lines ?? []).toHaveLength(0)
  expect(absorbed.notes).toContain(`Merged into ${merged.number}`)

  // Step 5: a cancelled count cannot be merged again.
  await expectRefused(owner.api.mergeStockCounts(gid, [shelfC.id ?? '', shelfD.id ?? '']), 409, 'STOCK_COUNT_NOT_DRAFT')

  // Step 6: completion is refused while the plug is uncounted; skipping it posts the rest.
  await expectRefused(owner.api.completeStockCount(gid, merged.id ?? ''), 409, 'STOCK_COUNT_HAS_UNCOUNTED_LINES')
  const done = await owner.api.completeStockCount(gid, merged.id ?? '', true)
  expect(done.status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(done.lines).toHaveLength(2)
  expect(done.lines?.map((line) => line.result)).toEqual(['STOCK_COUNT_LINE_RESULT_MATCHED', 'STOCK_COUNT_LINE_RESULT_MATCHED'])
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('4')
  expect(await onHand(owner.api, gid, plug)).toBe('3')
})
