// E2E-CUS-020 · A locked field is corrected with a reason, by staff who may; documents keep their snapshot
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// Also E2E-CUS-019 as the page shows it: a vehicle used by a live quote says
// its identity is locked. The rules (all six fields refused, a plate already
// in use, the audit entry) are in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'
import { joinWith } from '../../src/fixtures/members.js'
import { VehicleDetailPage } from '../../src/pages/customers/VehiclesPage.js'

test('E2E-CUS-020 a locked field is corrected with a reason, by staff who may', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cus020')
  const garage = await owner.api.createGarage({ name: 'QA Gara CUS020' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer Hoa Pham CUS020', phone: '0911000203' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-190.19' })
  await owner.api.createQuote(gid, {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change', quantity: '1', unitPrice: '250000' }],
  })

  // Step 1: a member who may write customers but not correct them is told to ask a manager.
  const advisor = await joinWith(owner, gid, await freshOwner('cus020adv'), 'Advisor', [
    'PERMISSION_CUSTOMER_READ',
    'PERMISSION_CUSTOMER_WRITE',
  ])
  await signIn(advisor.session, gid)
  const asAdvisor = new VehicleDetailPage(page)
  await asAdvisor.goto(vehicle.id ?? '')
  await expect(asAdvisor.lockedBanner).toBeVisible()
  await expect(page.getByText('Ask a manager to correct a locked field.')).toBeVisible()
  await expect(asAdvisor.correctButton).toBeHidden()

  // Steps 2 and 3: the owner (who holds customer.correct) must give a reason, then corrects the plate.
  await signIn(owner.session, gid)
  const vehicleDetail = new VehicleDetailPage(page)
  await vehicleDetail.goto(vehicle.id ?? '')
  await expect(vehicleDetail.lockedBanner).toBeVisible()
  await expect(page.getByText('Use “Correct data” to change a locked field with a reason')).toBeVisible()

  await vehicleDetail.correct({ field: 'License plate', value: '51A-190.92' })
  await expect(vehicleDetail.dialog).toBeVisible() // refused: the reason is required

  await vehicleDetail.dialog.getByLabel('Why is the correction needed?').fill('Typed wrong at the counter')
  await vehicleDetail.dialog.getByRole('button', { name: 'Correct', exact: true }).click()
  await expect(page.getByText('The vehicle was corrected.')).toBeVisible()
  await expect(vehicleDetail.dialog).toBeHidden()
  await expect(page.getByText('51A-190.92').first()).toBeVisible()

  // Step 4: a plate another vehicle has is refused and the dialog stays open.
  await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-190.91' })
  await vehicleDetail.correct({ field: 'License plate', value: '51A-190.91', reason: 'Typo' })
  await expect(vehicleDetail.dialog).toBeVisible()
  await expect(vehicleDetail.dialog.getByRole('alert')).toBeVisible()
})
