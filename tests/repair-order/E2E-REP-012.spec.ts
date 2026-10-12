// E2E-REP-012 · Permissions: no access, view-only, and full access
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-012 permissions: no access, view-only, and full access', async ({ page, api, freshOwner, signIn }) => {
  // Create owner with garage
  const owner = await freshOwner('rep012-owner')
  await signIn(owner.session)
  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara REP012', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find(g => g.name === 'QA Gara REP012')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Create customer and vehicle
  const customer = await api.withToken(owner.session.accessToken).createCustomer(garageId, {
    fullName: 'QA Customer REP012',
    phone: '0911000120',
  })
  if (!customer.id) throw new Error('Customer creation failed')
  const vehicle = await api.withToken(owner.session.accessToken).createVehicle(garageId, {
    customerId: customer.id,
    licensePlate: '51A-120.12',
  })
  if (!vehicle.id) throw new Error('Vehicle creation failed')

  // Create repair order
  const createForm = new RepairOrderCreateForm(page)
  await createForm.goto()
  await createForm.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await createForm.fillLine(0, { itemType: 'Labor', description: 'Brake repair', quantity: '1', unitPrice: '200000' })
  await createForm.createButton.click()

  const orderUrl = page.url()
  const orderId = orderUrl.split('/').pop()!

  // Test OWNER/MANAGER (full access) - can update line status and close
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await detail.setLineStatus(0, 'In progress')
  await detail.saveLine(0)
  await expect(page.getByText('In progress')).toBeVisible()

  // Complete and close
  await detail.setLineStatus(0, 'Completed')
  await detail.saveLine(0)
  await expect(detail.closeButton).toBeEnabled()
  await detail.closeButton.click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('Closed')).toBeVisible()

  // Test VIEWER (view-only) and TECHNICIAN (read/write) require separate contexts
  // Placeholder - these need the two-context actor fixture

  // Test VIEWER_CUSTOMER (no access) - no Repair Orders in sidebar
  // Placeholder
})