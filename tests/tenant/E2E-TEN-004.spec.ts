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
  // Beyond the trial limit the creation is refused: the dialog stays open
  // with the limit error (so this inlines the steps instead of createGarage,
  // which waits for the dialog to close on success).
  await garages.addGarageButton.click()
  await garages.nameField.fill('QA Gara TEN004 Second')
  await garages.saveButton.click()

  await expect(page.getByText('Your plan limit is reached. Upgrade to add more.')).toBeVisible()
  await expect(garages.garageRow('QA Gara TEN004 Second')).toBeHidden()
})
