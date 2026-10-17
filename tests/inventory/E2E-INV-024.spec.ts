// E2E-INV-024 · A write-off reduces stock at average cost; cancelling it puts the parts back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-024 a write-off reduces stock at average cost; cancelling it puts the parts back', async ({ freshOwner }) => {
  const owner = await freshOwner('inv024', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV024' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '4', unitCost: 50 })
  const lines = [
    { partId: oil.id ?? '', enteredQuantity: '3' },
    { partId: filter.id ?? '', enteredQuantity: '1' },
  ]

  // Step 1: the reason is required.
  await expectRefused(owner.api.createWriteOff(gid, { reason: undefined as never, lines }), 422)

  // Step 2: a damaged write-off is completed at the average cost of the moment.
  const writeOff = await owner.api.createWriteOff(gid, { reason: 'WRITE_OFF_REASON_DAMAGED', notes: 'dropped in transit', lines })
  expect(writeOff.status).toBe('ADJUSTMENT_STATUS_COMPLETED')
  expect(writeOff.number).toBeTruthy()
  expect(writeOff.totalValue).toBe('350')
  expect(writeOff.lines?.[0]?.unitCost).toBe('100')
  expect(await onHand(owner.api, gid, oil)).toBe('7')
  expect(await onHand(owner.api, gid, filter)).toBe('3')
  const card = await owner.api.stockCard(gid, oil.id ?? '', 'STOCK_TRANSACTION_REF_TYPE_WRITE_OFF')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({
    type: 'STOCK_TRANSACTION_TYPE_OUT',
    quantity: '3',
    quantityAfter: '7',
    refNumber: writeOff.number,
    reason: 'damaged',
  })

  // Step 3: more than is on hand is refused.
  await expectRefused(
    owner.api.createWriteOff(gid, { reason: 'WRITE_OFF_REASON_EXPIRED', lines: [{ partId: oil.id ?? '', enteredQuantity: '70' }] }),
    409,
    'INSUFFICIENT_STOCK',
  )

  // Step 4: the list filters by reason.
  expect((await owner.api.listWriteOffs(gid, { reason: 'WRITE_OFF_REASON_DAMAGED' })).data).toHaveLength(1)
  expect((await owner.api.listWriteOffs(gid, { reason: 'WRITE_OFF_REASON_LOST' })).data ?? []).toHaveLength(0)

  // Step 5: cancelling puts the parts back, at the same average cost, and only once.
  const cancelled = await owner.api.cancelWriteOff(gid, writeOff.id ?? '')
  expect(cancelled.status).toBe('ADJUSTMENT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('4')
  expect((await owner.api.getStockLevel(gid, oil.id ?? '')).averageCost).toBe('100')
  await expectRefused(owner.api.cancelWriteOff(gid, writeOff.id ?? ''), 409, 'WRITE_OFF_ALREADY_CANCELLED')
})
