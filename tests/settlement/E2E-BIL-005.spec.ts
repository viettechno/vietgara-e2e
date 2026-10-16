// E2E-BIL-005 · Void a payment and restore the outstanding amount
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// The paid settlement of E2E-BIL-003 (500,000 + 470,000) is set up through
// the API. Voiding needs a reason; the voucher stays on file marked
// voided, and the settlement is outstanding again.
import { newIdempotencyKey } from '../../src/api/client.js'
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { SettlementDetailPage, SettlementsPage } from '../../src/pages/settlements/SettlementsPage.js'

test('E2E-BIL-005 void a payment and restore the outstanding amount', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('bil005')
  const garage = await owner.api.createGarage({ name: 'QA Gara BIL005' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An BIL005', phone: '0911000051' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-511.51' })
  const order = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, garage.id ?? '', order.id ?? '')
  await owner.api.recordSettlementPayment(garage.id ?? '', settlement.id ?? '', { amount: '500000', method: 'PAYMENT_METHOD_CASH' }, newIdempotencyKey())
  const paid = await owner.api.recordSettlementPayment(
    garage.id ?? '',
    settlement.id ?? '',
    { amount: '470000', method: 'PAYMENT_METHOD_BANK_TRANSFER' },
    newIdempotencyKey(),
  )
  const secondVoucher = paid.payments?.[1]?.voucherNumber ?? ''
  await signIn(owner.session, garage.id)

  const detail = new SettlementDetailPage(page)
  await detail.goto(settlement.id ?? '')
  await expect(page.getByText('Paid', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: `Void voucher: ${secondVoucher}` }).click()
  const dialog = page.getByRole('dialog')
  const submit = dialog.getByRole('button', { name: 'Void voucher' })
  await expect(submit).toBeDisabled() // no reason, no void
  await dialog.getByLabel('Reason for voiding').fill('Entered twice')
  await submit.click()

  await expect(page.getByText('Voucher voided.')).toBeVisible()
  await expect(page.getByText('Partially paid')).toBeVisible()
  await expect(detail.paymentRow(secondVoucher)).toContainText('Voided: Entered twice')

  // The settlement is outstanding again.
  const list = new SettlementsPage(page)
  await list.goto()
  await list.outstandingOnly.check()
  await expect(list.row(settlement.number ?? '')).toBeVisible()
})
