// E2E-REP-004 · The Kanban board's columns reflect status derived from line progress
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-004 Kanban board columns reflect line progress', async ({ page, freshOwner, signIn }) => {
  const owner = await freshOwner('rep004')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP004' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer REP004' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-444.44' })

  await signIn(owner.session, garage.id)

  // Create repair order with 2 lines
  const form = new RepairOrderCreateForm(page)
  await form.goto()
  await form.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await form.fillLine(0, { itemType: 'Labor', description: 'Line 1', quantity: '1', unitPrice: '100000' })
  await form.addLine({ itemType: 'Labor', description: 'Line 2', quantity: '1', unitPrice: '100000' })
  await form.createButton.click()

  // Get repair order ID from URL
  const orderUrl = page.url()
  const orderId = orderUrl.split('/').pop()!

  // Step 1: Both lines Not started -> To Do column
  await page.goto('/repair-orders')
  await expect(page.locator('tr', { hasText: orderId }).getByText('To Do')).toBeVisible()

  // Step 2: Set line 1 to In progress -> In Progress column
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await detail.setLineStatus(0, 'In progress')
  await detail.saveLine(0)
  await page.goto('/repair-orders')
  await expect(page.locator('tr', { hasText: orderId }).getByText('In Progress')).toBeVisible()

  // Step 3: Set line 1 to Completed, line 2 to In progress -> In Progress column
  await detail.goto(orderId)
  await detail.setLineStatus(0, 'Completed')
  await detail.saveLine(0)
  await detail.setLineStatus(1, 'In progress')
  await detail.saveLine(1)
  await page.goto('/repair-orders')
  await expect(page.locator('tr', { hasText: orderId }).getByText('In Progress')).toBeVisible()

  // Step 4: Set both lines to Completed -> Completed column
  await detail.goto(orderId)
  await detail.setLineStatus(1, 'Completed')
  await detail.saveLine(1)
  await page.goto('/repair-orders')
  await expect(page.locator('tr', { hasText: orderId }).getByText('Completed')).toBeVisible()
})