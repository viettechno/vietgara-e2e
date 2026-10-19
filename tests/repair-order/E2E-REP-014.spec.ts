// E2E-REP-014 · The draft stock issue follows the part lines; a posted issue freezes the parts
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
//
// The lines change over the API (the line screen is E2E-REP-013's subject); the order's
// Stock issue card is read on screen, and Issue now is pressed there.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, expectRefused, stockedPart } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, lineOf, openOrder, reserved, waitForIssue, waitForReserved } from '../../src/fixtures/jobs.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-014 the draft stock issue follows the part lines; a posted issue freezes the parts', async ({ page, signIn, freshOwner }) => {
  // Events (stock issue, reservation, posting) are polled for up to 60 s; the full suite shares the runner with the stack.
  test.setTimeout(120_000)
  const owner = await freshOwner('rep014', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP014' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '20', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FLT-OIL-01', name: 'Oil filter', quantity: '5', unitCost: 50, unit: PIECE })
  const { vehicle } = await customerWithVehicle(owner.api, gid, '014')
  const order = await openOrder(owner.api, gid, vehicle.id ?? '', [
    { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity: '4', unitPrice: '90000' },
  ])
  const orderId = order.id ?? ''
  await signIn(owner.session, garage.id)

  // Step 1: the draft holds 4 L.
  await waitForReserved(owner.api, gid, oil, '4')

  // Steps 2-3: the oil goes to 6, a filter joins; the reservation follows and the issue lists both.
  await owner.api.editRepairOrderLine(gid, orderId, lineOf(order, 'Engine oil 5W-30').id ?? '', { quantity: '6' })
  const withFilter = await owner.api.addRepairOrderLine(gid, orderId, {
    itemType: 'REPAIR_ORDER_ITEM_TYPE_PART',
    itemRefId: filter.id,
    description: 'Oil filter',
    quantity: '1',
    unitPrice: '60000',
  })
  await waitForReserved(owner.api, gid, oil, '6')
  await waitForReserved(owner.api, gid, filter, '1')
  await waitForIssue(owner.api, gid, orderId, (issue) => (issue.lines ?? []).length === 2)
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await expect(detail.stockIssue.status).toHaveText('Draft')
  await expect(detail.stockIssue.lines).toHaveCount(2)

  // Step 4: removing the filter line frees its reservation, and the issue drops it.
  await owner.api.removeRepairOrderLine(gid, orderId, lineOf(withFilter, 'Oil filter').id ?? '')
  await waitForReserved(owner.api, gid, filter, '0')
  await waitForIssue(owner.api, gid, orderId, (issue) => (issue.lines ?? []).length === 1)
  await page.reload()
  await expect(detail.stockIssue.lines).toHaveCount(1)

  // Step 5: Issue now posts it; the three part changes are refused, a labor price change is not.
  await detail.stockIssue.issueNowButton.click()
  await expect(detail.stockIssue.status).toHaveText('Posted')
  const oilLine = lineOf(await owner.api.getRepairOrder(gid, orderId), 'Engine oil 5W-30')
  await expectRefused(owner.api.editRepairOrderLine(gid, orderId, oilLine.id ?? '', { quantity: '7' }), 409, 'STOCK_ISSUE_POSTED')
  await expectRefused(
    owner.api.addRepairOrderLine(gid, orderId, {
      itemType: 'REPAIR_ORDER_ITEM_TYPE_PART',
      itemRefId: filter.id,
      description: 'Oil filter',
      quantity: '1',
      unitPrice: '60000',
    }),
    409,
    'STOCK_ISSUE_POSTED',
  )
  await expectRefused(owner.api.removeRepairOrderLine(gid, orderId, oilLine.id ?? ''), 409, 'STOCK_ISSUE_POSTED')
  const labor = lineOf(order, 'Oil change')
  const repriced = await owner.api.editRepairOrderLine(gid, orderId, labor.id ?? '', { unitPrice: '260000' })
  expect(lineOf(repriced, 'Oil change').unitPrice).toBe('260000')
  expect(await reserved(owner.api, gid, oil)).toBe('0') // posted: the stock left the shelf instead
})
