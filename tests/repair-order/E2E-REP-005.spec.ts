// E2E-REP-005 · Assign one or more technicians to a line
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-005 assign technicians to a line', async ({ page, freshOwner, signIn }) => {
  const owner = await freshOwner('rep005')
  const garage = await owner.api.createGarage({ name: 'QA Gara REP005' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer REP005' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-555.55' })

  // Two verified technicians, invited to the garage (the backend requires a
  // verified e-mail for garage calls, and only staff can be assigned).
  const tech1 = await freshOwner('rep005-tech1', { fullName: 'QA Tech REP005-1' })
  const tech2 = await freshOwner('rep005-tech2', { fullName: 'QA Tech REP005-2' })
  const groups = await owner.api.listStaffGroups(garage.id ?? '')
  const techGroup = (groups.data ?? []).find((g) => g.name === 'Technician')
  if (!techGroup?.id) throw new Error('garage has no default Technician group')
  for (const tech of [tech1, tech2]) {
    const candidate = await owner.api.lookupStaffCandidate(garage.id ?? '', tech.email)
    await owner.api.inviteStaff(garage.id ?? '', candidate.userId ?? '', [techGroup.id ?? ''])
    const pending = await tech.api.listMyInvitations()
    const invitation = (pending.data ?? []).find((i) => i.id !== undefined)
    if (!invitation?.id) throw new Error('technician has no pending invitation')
    await tech.api.acceptInvitation(invitation.id ?? '')
  }

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
