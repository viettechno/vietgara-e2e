// E2E-REP-001 · Create an ad-hoc repair order
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderCreateForm } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-001 create an ad-hoc repair order', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('rep001')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP001' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer Binh Tran' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-222.22' })

  await signIn(owner.session, garage.id)

  const form = new RepairOrderCreateForm(page)
  await form.goto()

  await form.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await form.fillLine(0, { itemType: 'Labor', description: 'Brake inspection', quantity: '1', unitPrice: '150000' })
  await form.addLine({ itemType: 'Part', description: 'Brake pad set', quantity: '1', unitPrice: '450000' })
  await form.createButton.click()

  await expect(page).toHaveURL(/\/repair-orders\/[^/]+$/)
  await expect(page.getByText('To Do')).toBeVisible()
  await expect(page.getByText(vehicle.licensePlate ?? '')).toBeVisible()
  // (150,000 x 1) + (450,000 x 1) = 600,000
  await expect(page.getByText('600,000', { exact: false }).first()).toBeVisible()
})
