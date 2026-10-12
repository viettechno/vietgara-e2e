// E2E-TEN-006 · Deactivate and reactivate a garage (owner actions)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
// Note: The full scenario requires two browsers (owner + advisor). The advisor
// checks are deferred until the two-context actor fixture is available.
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-TEN-006 deactivate and reactivate a garage', async ({ page, freshOwner, signIn }) => {
  const owner = await freshOwner('ten006')
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN006', address: '1 Test St, Quan 1, TP.HCM' })

  // Navigate to garage settings
  await page.goto('/garages')
  const garageRow = garages.garageRow('QA Gara TEN006')
  await garageRow.getByRole('button', { name: 'Settings' }).click()

  // Deactivate
  await page.getByRole('button', { name: 'Deactivate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('Inactive')).toBeVisible()

  // Owner can still access the inactive garage
  await page.goto('/garages')
  await expect(garages.garageRow('QA Gara TEN006').getByText('Inactive')).toBeVisible()

  // Reactivate
  await garages.garageRow('QA Gara TEN006').getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Reactivate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('Active')).toBeVisible()

  // Verify active again
  await page.goto('/garages')
  await expect(garages.garageRow('QA Gara TEN006').getByText('Active')).toBeVisible()
})