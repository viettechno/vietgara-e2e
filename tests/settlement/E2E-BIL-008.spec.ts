// E2E-BIL-008 · The outstanding filter and the dashboard revenue follow the settlement
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// One fully paid and one pending settlement today: the outstanding filter
// keeps only the pending one, and the dashboard's monthly revenue includes
// today's settlement totals (creation-based, per the scenario).
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { newIdempotencyKey } from '../../src/api/client.js'
import { DashboardPage } from '../../src/pages/reporting/DashboardPage.js'
import { SettlementsPage } from '../../src/pages/settlements/SettlementsPage.js'

test('E2E-BIL-008 the outstanding filter and the dashboard revenue follow the settlement', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('bil008')
  const garage = await owner.api.createGarage({ name: 'QA Gara BIL008' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An BIL008', phone: '0911000088' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-881.88' })

  const paidOrder = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const paid = await pendingSettlement(owner.api, garage.id ?? '', paidOrder.id ?? '')
  await owner.api.recordSettlementPayment(
    garage.id ?? '',
    paid.id ?? '',
    { amount: '970000', method: 'PAYMENT_METHOD_CASH' },
    newIdempotencyKey(),
  )

  const openOrder = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const pending = await pendingSettlement(owner.api, garage.id ?? '', openOrder.id ?? '')
  await signIn(owner.session, garage.id)

  const settlements = new SettlementsPage(page)
  await settlements.goto()
  await settlements.outstandingOnly.check()
  await expect(settlements.row(pending.number ?? '')).toBeVisible()
  await expect(settlements.row(paid.number ?? '')).toBeHidden()

  const dashboard = new DashboardPage(page)
  await dashboard.goto()
  await expect(page.getByText('Monthly revenue')).toBeVisible()
  // Both settlements were created this month: 2 × 970,000. If the revenue
  // aggregation ever counts payments instead of settlement totals, CI will
  // tell us — the figure, not just the label, is the assertion.
  await expect(page.getByText('1,940,000', { exact: false }).first()).toBeVisible()
})
