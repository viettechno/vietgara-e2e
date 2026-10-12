// E2E-TEN-004 · A second garage beyond the trial limit is refused
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-TEN-004 a second garage beyond the trial limit is refused', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('ten004')
  await owner.api.createGarage({ name: 'QA Gara TEN004' })
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN004 Second' })

  await expect(page.getByText('Your plan limit is reached. Upgrade to add more.')).toBeVisible()
  await expect(garages.garageRow('QA Gara TEN004 Second')).toBeHidden()
})
