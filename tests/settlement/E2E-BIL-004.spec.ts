// E2E-BIL-004 · Each payment gets a numbered payment voucher
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// The two payments of E2E-BIL-003 are recorded through the API (that spec
// is the payment form's subject): the settlement page lists two vouchers
// with consecutive numbers, each opens as a PDF named after its number,
// and a second garage of the same owner numbers its own vouchers.
import { newIdempotencyKey } from '../../src/api/client.js'
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { GarageSwitcher } from '../../src/pages/garages/GarageSwitcher.js'
import { SettlementDetailPage } from '../../src/pages/settlements/SettlementsPage.js'

test('E2E-BIL-004 each payment gets a numbered payment voucher', async ({ page, signIn, freshOwner, adminApi }) => {
  const owner = await freshOwner('bil004', { locale: 'LOCALE_EN' })
  const pro = ((await owner.api.listPlans()).data ?? []).find((p) => p.name === 'Pro')
  await owner.api.changeMyPlan(pro?.id ?? '', adminApi) // two garages

  const garage = await owner.api.createGarage({ name: 'QA Gara BIL004 A1' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An BIL004', phone: '0911000041' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-411.41' })
  const order = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, garage.id ?? '', order.id ?? '')
  await owner.api.recordSettlementPayment(
    garage.id ?? '',
    settlement.id ?? '',
    { amount: '500000', method: 'PAYMENT_METHOD_CASH' },
    newIdempotencyKey(),
  )
  await owner.api.recordSettlementPayment(
    garage.id ?? '',
    settlement.id ?? '',
    { amount: '470000', method: 'PAYMENT_METHOD_BANK_TRANSFER' },
    newIdempotencyKey(),
  )
  await signIn(owner.session, garage.id)

  const detail = new SettlementDetailPage(page)
  await detail.goto(settlement.id ?? '')

  // Two vouchers, consecutive numbers (last digits of the numbering template).
  const paid = await owner.api.getSettlement(garage.id ?? '', settlement.id ?? '')
  const vouchers = (paid.payments ?? []).map((p) => p.voucherNumber ?? '')
  expect(vouchers).toHaveLength(2)
  const [first, second] = vouchers as [string, string]
  expect(Number(second.match(/(\d+)$/)?.[1])).toBe(Number(first.match(/(\d+)$/)?.[1]) + 1)
  await expect(detail.paymentRow(first)).toBeVisible()
  await expect(detail.paymentRow(second)).toBeVisible()

  // Each voucher opens as a PDF named after its number.
  for (const number of vouchers) {
    const downloadPromise = page.waitForEvent('download')
    await detail.voucherButton(number).click()
    const file = await downloadPromise
    expect(file.suggestedFilename()).toBe(`${number}.pdf`)
    const path = await file.path()
    const { readFile } = await import('node:fs/promises')
    expect((await readFile(path)).subarray(0, 4).toString()).toBe('%PDF')
  }

  // Another garage of the same owner has its own, independent numbering.
  const garageTwo = await owner.api.createGarage({ name: 'QA Gara BIL004 A2' })
  const customerTwo = await owner.api.createCustomer(garageTwo.id ?? '', { fullName: 'QA Customer Chi BIL004', phone: '0911000042' })
  const vehicleTwo = await owner.api.createVehicle(garageTwo.id ?? '', { customerId: customerTwo.id ?? '', licensePlate: '29A-422.42' })
  const orderTwo = await closedRepairOrder(owner.api, garageTwo.id ?? '', customerTwo.id ?? '', vehicleTwo.id ?? '')
  const settlementTwo = await pendingSettlement(owner.api, garageTwo.id ?? '', orderTwo.id ?? '')
  const afterOne = await owner.api.recordSettlementPayment(
    garageTwo.id ?? '',
    settlementTwo.id ?? '',
    { amount: '100000', method: 'PAYMENT_METHOD_CASH' },
    newIdempotencyKey(),
  )
  const otherNumber = afterOne.payments?.[0]?.voucherNumber ?? ''
  expect(Number(otherNumber.match(/(\d+)$/)?.[1])).toBe(Number(first.match(/(\d+)$/)?.[1]))

  await new GarageSwitcher(page).switchTo('QA Gara BIL004 A2')
  await detail.goto(settlementTwo.id ?? '')
  await expect(detail.paymentRow(otherNumber)).toBeVisible()
})
