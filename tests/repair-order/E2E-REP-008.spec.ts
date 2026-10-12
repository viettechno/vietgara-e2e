// E2E-REP-008 · Closing requires every line to be completed
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
//
// Line setup goes over the API (line progress itself is E2E-REP-006's
// subject); the close gate — disabled button, hints, then the close — is
// the UI under test.
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-008 closing requires every line to be completed', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('rep008')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP008' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An REP008', phone: '0911000081' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-881.81' })
  const order = await owner.api.createRepairOrder(garage.id ?? '', {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'Brake inspection', quantity: '1', unitPrice: '150000' },
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'Brake cleaning', quantity: '1', unitPrice: '100000' },
    ],
  })
  await owner.api.updateRepairOrderLine(garage.id ?? '', order.id ?? '', order.lines?.[0]?.id ?? '', {
    status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
    assignedTechnicianIds: [],
  })
  await signIn(owner.session, garage.id)

  const detail = new RepairOrderDetailPage(page)
  await detail.goto(order.id ?? '')
  await expect(detail.closeButton).toBeDisabled()
  await expect(page.getByText('Complete every line before closing.')).toBeVisible()

  await owner.api.updateRepairOrderLine(garage.id ?? '', order.id ?? '', order.lines?.[1]?.id ?? '', {
    status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
    assignedTechnicianIds: [],
  })
  await page.reload()
  await expect(page.getByText('Every line is completed — ready to close.')).toBeVisible()
  await expect(detail.closeButton).toBeEnabled()
  await detail.closeButton.click()
  await expect(page.getByText('Closed')).toBeVisible()
})
