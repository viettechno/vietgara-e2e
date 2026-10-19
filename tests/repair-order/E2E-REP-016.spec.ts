// E2E-REP-016 · A repair order lacking stock waits on parts, and comes back when stock arrives
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
//
// The orders are made over the API; order B's waiting banner and its issue's "Short by" are read on screen.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, stockedPart } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, lineOf, openOrder, waitForIssue, waitForStatus } from '../../src/fixtures/jobs.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-016 a repair order lacking stock waits on parts, and comes back when stock arrives', async ({ page, signIn, freshOwner }) => {
  // Events (stock issue, reservation, posting) are polled for up to 60 s; the full suite shares the runner with the stack.
  test.setTimeout(120_000)
  const owner = await freshOwner('rep016', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP016' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '5', unitCost: 100 })
  const { vehicle } = await customerWithVehicle(owner.api, gid, '016')
  const oilOrder = (quantity: string) =>
    openOrder(owner.api, gid, vehicle.id ?? '', [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity, unitPrice: '90000' },
    ])
  await signIn(owner.session, garage.id)

  // Steps 1-2: A is served first; B waits and its issue says how much is short (5 on hand, 4 held by A).
  const a = await oilOrder('4')
  await waitForIssue(owner.api, gid, a.id ?? '')
  const b = await oilOrder('4')
  await waitForStatus(owner.api, gid, b.id ?? '', 'REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  expect((await owner.api.getRepairOrder(gid, a.id ?? '')).status).toBe('REPAIR_ORDER_STATUS_OPEN')
  const shortIssue = await waitForIssue(owner.api, gid, b.id ?? '', (issue) => Boolean(issue.isShort))
  expect(shortIssue.lines?.[0]?.shortQuantity).toBe('3')
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(b.id ?? '')
  await expect(page.getByText(/Waiting on parts: the stock on hand/)).toBeVisible()
  await expect(page.getByText(/Short by 3 L/)).toBeVisible()
  await detail.goto(a.id ?? '')
  await expect(page.getByText(/Waiting on parts: the stock on hand/)).toBeHidden()
  await expect(page.getByText(/Short by/)).toBeHidden()

  // Step 3: stock arrives and B comes back by itself.
  await owner.api.receiveStock(gid, oil.id ?? '', { quantity: '10', unitCost: 100 })
  await waitForStatus(owner.api, gid, b.id ?? '', 'REPAIR_ORDER_STATUS_OPEN')
  const covered = await waitForIssue(owner.api, gid, b.id ?? '', (issue) => !issue.isShort)
  expect(covered.lines?.[0]?.shortQuantity).toBe('0')

  // Step 4: C needs more than is left (15 on hand, 8 held); cancelling A frees 4 L and C comes back.
  const c = await oilOrder('10')
  await waitForStatus(owner.api, gid, c.id ?? '', 'REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  await owner.api.cancelRepairOrder(gid, a.id ?? '')
  await waitForStatus(owner.api, gid, c.id ?? '', 'REPAIR_ORDER_STATUS_OPEN')

  // Step 5: D waits (15 on hand, 14 held); a smaller quantity brings it back.
  const d = await oilOrder('20')
  await waitForStatus(owner.api, gid, d.id ?? '', 'REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  await owner.api.editRepairOrderLine(gid, d.id ?? '', lineOf(d, 'Engine oil 5W-30').id ?? '', { quantity: '1' })
  await waitForStatus(owner.api, gid, d.id ?? '', 'REPAIR_ORDER_STATUS_OPEN')

  // Step 6: a started order that is short still shows waiting and can no longer be cancelled;
  // once every line is completed it is Completed. A waiting order that has not started can be cancelled.
  const big = await oilOrder('100')
  await waitForStatus(owner.api, gid, big.id ?? '', 'REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  const started = await owner.api.updateRepairOrderLine(gid, big.id ?? '', lineOf(big, 'Oil change').id ?? '', {
    status: 'REPAIR_ORDER_LINE_STATUS_IN_PROGRESS',
    assignedTechnicianIds: [],
  })
  expect(started.status).toBe('REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  await expectRefused(owner.api.cancelRepairOrder(gid, big.id ?? ''), 409, 'REPAIR_ORDER_NOT_CANCELLABLE')
  for (const line of big.lines ?? []) {
    await owner.api.updateRepairOrderLine(gid, big.id ?? '', line.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
      assignedTechnicianIds: [],
    })
  }
  await waitForStatus(owner.api, gid, big.id ?? '', 'REPAIR_ORDER_STATUS_COMPLETED')
  const idle = await oilOrder('100')
  await waitForStatus(owner.api, gid, idle.id ?? '', 'REPAIR_ORDER_STATUS_WAITING_ON_PARTS')
  expect((await owner.api.cancelRepairOrder(gid, idle.id ?? '')).status).toBe('REPAIR_ORDER_STATUS_CANCELLED')
})
