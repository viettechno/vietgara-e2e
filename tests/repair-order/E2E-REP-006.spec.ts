// E2E-REP-006 · Update a line's own progress; the order's overall status is derived
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-006 update line progress; order status derived', async ({ page, freshOwner, signIn }) => {
  const owner = await freshOwner('rep006')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP006' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer REP006' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-666.66' })

  await signIn(owner.session, garage.id)

  // Create repair order with 2 lines
  const form = new RepairOrderCreateForm(page)
  await form.goto()
  await form.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await form.fillLine(0, { itemType: 'Labor', description: 'Line A', quantity: '1', unitPrice: '100000' })
  await form.addLine({ itemType: 'Labor', description: 'Line B', quantity: '1', unitPrice: '100000' })
  await form.createButton.click()
  // Wait for the creation to land: without this the URL below is still
  // /repair-orders/new on slow runners (E2E-REP-001 waits the same way).
  await expect(page).toHaveURL(/\/repair-orders\/(?!new)[^/]+$/)

  const orderUrl = page.url()
  const orderId = orderUrl.split('/').pop()!

  const detail = new RepairOrderDetailPage(page)

  // Step 1: Both Not started -> To Do (Kanban regions, cards show the plate)
  // (wait for the lines to load first so slow runners don't race the board)
  await detail.goto(orderId)
  await expect(detail.lineRow(0).getByText('Line A')).toBeVisible()
  await page.goto('/repair-orders')
  await expect(page.getByRole('region', { name: 'To Do' }).getByText('51A-666.66')).toBeVisible()

  // Step 2: Line A -> In progress -> In Progress
  await detail.goto(orderId)
  await detail.setLineStatus(0, 'In progress')
  await detail.saveLine(0)
  await page.goto('/repair-orders')
  await expect(page.getByRole('region', { name: 'In Progress' }).getByText('51A-666.66')).toBeVisible()

  // Step 3: Line A -> Completed, Line B -> In progress -> In Progress
  await detail.goto(orderId)
  await detail.setLineStatus(0, 'Completed')
  await detail.saveLine(0)
  await detail.setLineStatus(1, 'In progress')
  await detail.saveLine(1)
  await page.goto('/repair-orders')
  await expect(page.getByRole('region', { name: 'In Progress' }).getByText('51A-666.66')).toBeVisible()

  // Step 4: Both Completed -> Completed
  await detail.goto(orderId)
  await detail.setLineStatus(1, 'Completed')
  await detail.saveLine(1)
  await page.goto('/repair-orders')
  await expect(page.getByRole('region', { name: 'Completed' }).getByText('51A-666.66')).toBeVisible()
})
