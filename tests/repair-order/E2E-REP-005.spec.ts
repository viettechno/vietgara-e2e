// E2E-REP-005 · Assign one or more technicians to a line
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-005 assign technicians to a line', async ({ page, api, freshOwner, signIn }) => {
  const owner = await freshOwner('rep005')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP005' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer REP005' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-555.55' })

  // Create two technicians and add to garage
  const tech1Email = `signup.rep005-tech1.${Date.now()}@vietgara.test`
  const tech2Email = `signup.rep005-tech2.${Date.now()}@vietgara.test`
  const tech1Initial = await api.register({ email: tech1Email, password: 'Qa@123456', fullName: 'QA Tech REP005-1' })
  const tech2Initial = await api.register({ email: tech2Email, password: 'Qa@123456', fullName: 'QA Tech REP005-2' })
  await api.withToken(tech1Initial.accessToken).listGarages()
  await api.withToken(tech2Initial.accessToken).listGarages()

  await signIn(owner.session, garage.id)

  // Create repair order
  const form = new RepairOrderCreateForm(page)
  await form.goto()
  await form.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await form.fillLine(0, { itemType: 'Labor', description: 'Brake repair', quantity: '1', unitPrice: '200000' })
  await form.createButton.click()

  const orderUrl = page.url()
  const orderId = orderUrl.split('/').pop()!

  // Assign both technicians to the line
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await detail.assignTechnician(0, 'QA Tech REP005-1')
  await detail.assignTechnician(0, 'QA Tech REP005-2')
  await detail.saveLine(0)

  // Verify both assigned
  await expect(page.locator('tr', { hasText: 'Brake repair' }).getByText('QA Tech REP005-1')).toBeVisible()
  await expect(page.locator('tr', { hasText: 'Brake repair' }).getByText('QA Tech REP005-2')).toBeVisible()

  // Unassign one
  await detail.assignTechnician(0, 'QA Tech REP005-2')
  await detail.saveLine(0)
  await expect(page.locator('tr', { hasText: 'Brake repair' }).getByText('QA Tech REP005-1')).toBeVisible()
  await expect(page.locator('tr', { hasText: 'Brake repair' }).getByText('QA Tech REP005-2')).toBeHidden()
})