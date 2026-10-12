// E2E-BIL-003 · Record a partial payment, then the rest
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// Total 970,000 (see src/fixtures/order-chain.ts): 500,000 cash leaves
// 470,000 outstanding; a 470,000 bank transfer closes it. A third payment
// is refused: with nothing due the modal's submit stays disabled.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { SettlementDetailPage } from '../../src/pages/settlements/SettlementsPage.js'

// Quarantined: the record-payment amount field rejects whole-VND amounts
// (min=0.01 step=1 validates against base 0.01), so the scenario's own
// 500,000 + 470,000 payments cannot submit. See
// https://github.com/viettechno/vietgara-owner-web/issues/26 — unquarantine
// once fixed (one sprint per the flaky-test rule).
test('E2E-BIL-003 record a partial payment, then the rest', { tag: '@quarantine' }, async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('bil003')
  const garage = await owner.api.createGarage({ name: 'QA Gara BIL003' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An BIL003', phone: '0911000031' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-311.31' })
  const order = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, garage.id ?? '', order.id ?? '')
  await signIn(owner.session, garage.id)

  const detail = new SettlementDetailPage(page)
  await detail.goto(settlement.id ?? '')

  await detail.recordPayment({ amount: '500000', method: 'Cash' })
  await expect(page.getByText('Payment recorded.')).toBeVisible()
  await expect(page.getByText('Partially paid')).toBeVisible()
  await expect(detail.paymentRow('500,000')).toBeVisible()

  await detail.recordPayment({ amount: '470000', method: 'Bank transfer', note: 'Transfer 123' })
  await expect(page.getByText('Paid', { exact: true })).toBeVisible()
  await expect(detail.paymentRow('470,000')).toBeVisible()

  await detail.recordPaymentButton.click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Amount').fill('1000')
  await expect(dialog.getByRole('button', { name: 'Record payment' })).toBeDisabled()
})
