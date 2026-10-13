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
  await garageRow.getByRole('button', { name: 'Garage settings: QA Gara TEN006' }).click()

  // Deactivate (the confirm dialog confirms with Deactivate, not Confirm)
  await page.getByRole('button', { name: 'Deactivate' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Deactivate', exact: true }).click()
  await expect(page.getByText('Inactive', { exact: true }).first()).toBeVisible()

  // Owner can still access the inactive garage
  await page.goto('/garages')
  await expect(garages.garageRow('QA Gara TEN006').getByText('Inactive')).toBeVisible()

  // Reactivate
  await garages.garageRow('QA Gara TEN006').getByRole('button', { name: 'Garage settings: QA Gara TEN006' }).click()
  await page.getByRole('button', { name: 'Reactivate' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Reactivate', exact: true }).click()
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible()

  // Verify active again
  await page.goto('/garages')
  await expect(garages.garageRow('QA Gara TEN006').getByText('Active')).toBeVisible()
})
