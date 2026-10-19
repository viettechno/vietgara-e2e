// E2E-REP-017 · A hidden consumable on the order is deducted, not billed, not printed, and does not hold the order back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
//
// API only (the scenario is marked Automated (API)).
import { expect, test } from '../../src/fixtures/index.js'
import { newIdempotencyKey } from '../../src/api/client.js'
import { customerWithVehicle, completeBillable, draftQuote, oilChange, waitForIssue, waitForReserved } from '../../src/fixtures/jobs.js'
import { onHand } from '../../src/fixtures/inventory.js'

test('E2E-REP-017 a hidden consumable is deducted, not billed, not printed, and does not hold the order back', async ({ freshOwner }) => {
  const owner = await freshOwner('rep017', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP017' })
  const gid = garage.id ?? ''
  const { oil, filter, job } = await oilChange(owner.api, gid)
  await owner.api.receiveStock(gid, oil.id ?? '', { quantity: '20', unitCost: 50000 })
  await owner.api.receiveStock(gid, filter.id ?? '', { quantity: '5', unitCost: 40000 })
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '017')

  // The order comes from the job Oil change (E2E-QUO-017): labor, oil and the hidden filter.
  const quote = await owner.api.addQuoteJob(
    gid,
    (await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')).id ?? '',
    job.id ?? '',
  )
  const sent = (await owner.api.sendQuote(gid, quote.id ?? '')).quote
  await owner.api.recordQuoteDecision(
    gid,
    sent.id ?? '',
    (sent.lines ?? [])
      .filter((line) => !line.nonBillable)
      .map((line) => ({ lineId: line.id ?? '', approved: line.description !== 'Inspection' })),
  )
  const order = await owner.api.getRepairOrder(gid, (await owner.api.convertQuote(gid, sent.id ?? '')).repairOrderId ?? '')
  const orderId = order.id ?? ''
  const hidden = (order.lines ?? []).find((line) => line.nonBillable)
  expect(hidden?.description).toBe('Oil filter')
  expect(hidden?.unitPrice).toBe('0')
  expect(order.totalAmount).toBe('560000') // 200,000 labor + 4 × 90,000 oil; the filter is not billed

  // Step 1: the filter is reserved and listed on the stock issue.
  await waitForReserved(owner.api, gid, filter, '1')
  const issue = await waitForIssue(owner.api, gid, orderId, (candidate) => (candidate.lines ?? []).length === 2)
  expect((issue.lines ?? []).map((line) => line.partSku).sort()).toEqual(['FLT-OIL-01', 'OIL-5W30'])

  // Step 2: only the billable lines are completed, and the order still closes; its total did not change.
  const done = await completeBillable(owner.api, gid, order)
  expect(done.status).toBe('REPAIR_ORDER_STATUS_COMPLETED')
  const closed = await owner.api.closeRepairOrder(gid, orderId)
  expect(closed.status).toBe('REPAIR_ORDER_STATUS_CLOSED')
  expect(closed.totalAmount).toBe('560000')

  // Step 3: one Out movement of 1 for the filter, at its cost; the settlement leaves it out.
  await expect.poll(() => onHand(owner.api, gid, filter), { timeout: 60_000 }).toBe('4')
  const movements = (await owner.api.stockCard(gid, filter.id ?? '')).filter((tx) => tx.type === 'STOCK_TRANSACTION_TYPE_OUT')
  expect(movements).toHaveLength(1)
  expect(movements[0]?.quantity).toBe('1')
  expect(movements[0]?.unitCost).toBe('40000')
  const settlement = await owner.api.createSettlement(gid, orderId, newIdempotencyKey())
  expect(settlement.totalAmount).toBe('560000')
})
