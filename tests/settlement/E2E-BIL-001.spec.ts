// E2E-BIL-001 · Create a settlement from a closed repair order
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// The closed order is built over the API (E2E-QUO-010 + E2E-REP-008's path);
// creating the settlement from it, and downloading its receipt PDF, is the
// UI under test.
import { expect, test } from '../../src/fixtures/index.js'
import { CHAIN_TOTAL, closedRepairOrder } from '../../src/fixtures/order-chain.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'
import { SettlementDetailPage } from '../../src/pages/settlements/SettlementsPage.js'

test('E2E-BIL-001 create a settlement from a closed repair order', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('bil001')
  const garage = await owner.api.createGarage({ name: 'QA Gara BIL001' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An BIL001', phone: '0911000011' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-111.12' })
  const order = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  await signIn(owner.session, garage.id)

  const repairOrder = new RepairOrderDetailPage(page)
  await repairOrder.goto(order.id ?? '')
  await repairOrder.createSettlementButton.click()
  await expect(page.getByText('A settlement was created from this repair order.')).toBeVisible()
  await repairOrder.viewSettlementLink.click()

  await expect(page).toHaveURL(/\/settlements\/[^/]+$/)
  await expect(page.getByText('Pending')).toBeVisible()
  await expect(page.getByText(CHAIN_TOTAL, { exact: false }).first()).toBeVisible()
  await expect(page.getByText(customer.fullName ?? '')).toBeVisible()
  await expect(page.getByText(vehicle.licensePlate ?? '')).toBeVisible()
  await expect(page.getByText('No payments recorded yet.')).toBeVisible()

  const settlement = new SettlementDetailPage(page)
  const download = page.waitForEvent('download')
  await settlement.exportReceiptButton.click()
  const receipt = await download
  expect(receipt.suggestedFilename()).toMatch(/\.pdf$/)
})
