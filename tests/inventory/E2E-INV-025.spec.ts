// E2E-INV-025 · A write-off reduces stock at average cost; refused beyond on hand; cancelling puts the parts back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: driven over the API; the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-025 a write-off reduces stock at average cost; cancelling puts the parts back', async ({ freshOwner }) => {
  const owner = await freshOwner('inv025', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV025' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const oilId = oil.id ?? ''

  // Without a reason nothing is written off.
  await expectRefused(owner.api.createWriteOff(gid, { reason: undefined as never, lines: [{ partId: oilId, enteredQuantity: '3' }] }), 422)

  // Steps 1-3: 3 L written off as damaged, at the average cost of the moment.
  const writeOff = await owner.api.createWriteOff(gid, {
    reason: 'WRITE_OFF_REASON_DAMAGED',
    notes: 'dropped in transit',
    lines: [{ partId: oilId, enteredQuantity: '3' }],
  })
  expect(writeOff.status).toBe('ADJUSTMENT_STATUS_COMPLETED')
  expect(writeOff.number).toMatch(/^XH-\d{6}-/)
  expect(writeOff.lines?.[0]?.unitCost).toBe('100')
  expect(writeOff.totalValue).toBe('300')
  expect(await onHand(owner.api, gid, oil)).toBe('7')

  // Step 4: more than is on hand is refused and changes nothing.
  await expectRefused(
    owner.api.createWriteOff(gid, { reason: 'WRITE_OFF_REASON_EXPIRED', lines: [{ partId: oilId, enteredQuantity: '70' }] }),
    409,
    'INSUFFICIENT_STOCK',
  )
  expect(await onHand(owner.api, gid, oil)).toBe('7')

  // Step 5: the stock card carries the document, the reason and the balance; the list filters by reason.
  const card = await owner.api.stockCard(gid, oilId, 'STOCK_TRANSACTION_REF_TYPE_WRITE_OFF')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({
    type: 'STOCK_TRANSACTION_TYPE_OUT',
    quantity: '3',
    quantityAfter: '7',
    refNumber: writeOff.number,
    reason: 'damaged',
  })
  expect((await owner.api.listWriteOffs(gid, { reason: 'WRITE_OFF_REASON_DAMAGED' })).data).toHaveLength(1)
  expect((await owner.api.listWriteOffs(gid, { reason: 'WRITE_OFF_REASON_LOST' })).data ?? []).toHaveLength(0)

  // Steps 6-7: cancelling puts the parts back at the same average cost, and only once.
  const cancelled = await owner.api.cancelWriteOff(gid, writeOff.id ?? '')
  expect(cancelled.status).toBe('ADJUSTMENT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect((await owner.api.getStockLevel(gid, oilId)).averageCost).toBe('100')
  await expectRefused(owner.api.cancelWriteOff(gid, writeOff.id ?? ''), 409, 'WRITE_OFF_ALREADY_CANCELLED')
})
