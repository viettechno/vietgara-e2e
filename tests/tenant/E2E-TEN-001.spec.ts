// E2E-TEN-001 · Create the first garage
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-TEN-001 create the first garage', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('ten001')
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await expect(page.getByText('No garage yet.')).toBeVisible()

  await garages.createGarage({ name: 'QA Gara TEN001', address: '1 Test St, Quan 1, TP.HCM' })

  await expect(garages.garageRow('QA Gara TEN001')).toBeVisible()
  await expect(garages.garageRow('QA Gara TEN001').getByText('Owner')).toBeVisible()
})
