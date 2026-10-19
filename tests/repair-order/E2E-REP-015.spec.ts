// E2E-REP-015 · Cancel a repair order before work starts: the reservation is released
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { completeAndClose, expectRefused, stockedPart } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, lineOf, openOrder, waitForIssue, waitForReserved } from '../../src/fixtures/jobs.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-015 cancel a repair order before work starts: the reservation is released', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('rep015', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP015' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '015')

  // An approved quote converted into an order holding 4 L; a second open order; a third that has started.
  const quote = await owner.api.createQuote(gid, {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [
      { itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Work', quantity: '1', unitPrice: '100000' },
      { itemType: 'QUOTE_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity: '4', unitPrice: '90000' },
    ],
  })
  const sent = (await owner.api.sendQuote(gid, quote.id ?? '')).quote
  await owner.api.recordQuoteDecision(
    gid,
    sent.id ?? '',
    (sent.lines ?? []).map((line) => ({ lineId: line.id ?? '', approved: true })),
  )
  const orderId = (await owner.api.convertQuote(gid, sent.id ?? '')).repairOrderId ?? ''
  const second = await openOrder(owner.api, gid, vehicle.id ?? '')
  const third = await openOrder(owner.api, gid, vehicle.id ?? '', [
    { itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'Later', quantity: '1', unitPrice: '1000' },
  ])
  await owner.api.updateRepairOrderLine(gid, third.id ?? '', lineOf(third, 'Oil change').id ?? '', {
    status: 'REPAIR_ORDER_LINE_STATUS_IN_PROGRESS',
    assignedTechnicianIds: [],
  })
  await waitForReserved(owner.api, gid, oil, '4')
  await signIn(owner.session, garage.id)

  // Step 1: Cancel repair order → confirm.
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await detail.cancelOrder()
  await expect(page.getByText('This repair order was cancelled.')).toBeVisible()
  await expect(page.getByText('Cancelled', { exact: true }).first()).toBeVisible()

  // Step 2: the reservation is released, the stock issue is cancelled, the quote stays converted.
  await waitForReserved(owner.api, gid, oil, '0')
  await waitForIssue(owner.api, gid, orderId, (issue) => issue.status === 'STOCK_ISSUE_STATUS_CANCELLED')
  await detail.goto(orderId)
  await expect(detail.stockIssue.status).toHaveText('Cancelled')
  const level = await owner.api.getStockLevel(gid, oil.id ?? '')
  expect(level.quantityOnHand).toBe('10') // nothing left the shelf
  expect((await owner.api.getQuote(gid, quote.id ?? '')).status).toBe('QUOTE_STATUS_CONVERTED')

  // Step 3: the cancelled order is read-only: no controls on screen, and every change is refused.
  await expect(detail.addLineButton).toBeHidden()
  await expect(detail.cancelButton).toBeHidden()
  await expect(detail.closeButton).toBeHidden()
  const cancelled = await owner.api.getRepairOrder(gid, orderId)
  const workLine = lineOf(cancelled, 'Work')
  await expectRefused(owner.api.editRepairOrderLine(gid, orderId, workLine.id ?? '', { description: 'Late' }), 409)
  await expectRefused(
    owner.api.updateRepairOrderLine(gid, orderId, workLine.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_IN_PROGRESS',
      assignedTechnicianIds: [],
    }),
    409,
  )
  await expectRefused(owner.api.closeRepairOrder(gid, orderId), 409)
  await expectRefused(owner.api.cancelRepairOrder(gid, orderId), 409, 'REPAIR_ORDER_NOT_CANCELLABLE')
  expect(((await owner.api.listRepairOrders(gid, { status: 'REPAIR_ORDER_STATUS_CANCELLED' })).data ?? []).map((o) => o.id)).toContain(
    orderId,
  )

  // Step 4: the converted quote cannot convert again.
  await expectRefused(owner.api.convertQuote(gid, quote.id ?? ''), 409)

  // Step 5: an order whose work started has no Cancel button, and the API refuses; so does a closed one.
  await detail.goto(third.id ?? '')
  await expect(detail.addLineButton).toBeVisible()
  await expect(detail.cancelButton).toBeHidden()
  await expectRefused(owner.api.cancelRepairOrder(gid, third.id ?? ''), 409, 'REPAIR_ORDER_NOT_CANCELLABLE')
  await completeAndClose(owner.api, gid, second)
  await expectRefused(owner.api.cancelRepairOrder(gid, second.id ?? ''), 409, 'REPAIR_ORDER_NOT_CANCELLABLE')
})
