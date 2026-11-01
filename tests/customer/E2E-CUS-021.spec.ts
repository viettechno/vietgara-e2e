// E2E-CUS-021 · Change the owner of a vehicle; its history stays
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// The browser part: the "Change owner" dialog of the vehicle page picks the
// new owner, the reason is optional, the same owner is refused, and the repair
// history stays with the vehicle. The permission (customer.correct) and the
// audit entry are in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder } from '../../src/fixtures/order-chain.js'

test('E2E-CUS-021 change the owner of a vehicle; its history stays', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cus021')
  const gid = (await owner.api.createGarage({ name: 'QA Gara CUS021' })).id ?? ''
  const hoa = await owner.api.createCustomer(gid, { fullName: 'QA Customer Hoa Pham CUS021', phone: '0911000212' })
  await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen CUS021', phone: '0911000213' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: hoa.id ?? '', licensePlate: '51A-210.21' })
  await closedRepairOrder(owner.api, gid, hoa.id ?? '', vehicle.id ?? '')
  await signIn(owner.session, gid)

  await page.goto(`/vehicles/${vehicle.id}`)
  await expect(page.getByText('QA Customer Hoa Pham CUS021').first()).toBeVisible()
  await expect(page.getByRole('row', { name: /Repair order/ }).first()).toBeVisible()

  // Step 1: pick the new owner; the reason is optional.
  await page.getByRole('button', { name: 'Change owner' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByPlaceholder('Search by name, phone, e-mail or plate…').fill('An Nguyen')
  await dialog.locator('li', { hasText: 'QA Customer An Nguyen CUS021' }).first().getByRole('button', { name: 'Use this profile' }).click()
  await dialog.getByRole('button', { name: 'Change owner' }).click()

  // Step 2: the owner changed and the repair history is still on the vehicle.
  await expect(page.getByText('The owner was changed.')).toBeVisible()
  await expect(page.getByText('QA Customer An Nguyen CUS021').first()).toBeVisible()
  await expect(page.getByRole('row', { name: /Repair order/ }).first()).toBeVisible()

  // Step 3: the same owner again is refused.
  await page.getByRole('button', { name: 'Change owner' }).click()
  await dialog.getByPlaceholder('Search by name, phone, e-mail or plate…').fill('An Nguyen')
  await dialog.locator('li', { hasText: 'QA Customer An Nguyen CUS021' }).first().getByRole('button', { name: 'Use this profile' }).click()
  await expect(dialog.getByText('This customer already owns the vehicle.')).toBeVisible()
})
