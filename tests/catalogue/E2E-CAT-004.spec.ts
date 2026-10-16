// E2E-CAT-004 · Packaging units: derived and overridden prices, and invalid tables
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { beer330 } from '../../src/fixtures/catalogue.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'

test('E2E-CAT-004 packaging units: derived and overridden prices, and invalid tables', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat004', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT004' })
  const { caseUnit } = await beer330(owner.api, garage.id ?? '')
  await signIn(owner.session, garage.id)

  const catalogue = new CataloguePage(page)
  await catalogue.goto()

  // Step 1: the case price is the override.
  const row = catalogue.row('BEER-330')
  await expect(row).toContainText('1 case = 24 can')
  await expect(row).toContainText('200,000')

  // Step 2: without the override the price is 9,000 x 24.
  let dialog = await catalogue.openPackaging('BEER-330')
  await dialog.getByLabel('Price (VND) 1').fill('')
  await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(row).toContainText('216,000')

  // Step 3: a unit twice and a zero factor are refused; the saved table stays.
  dialog = await catalogue.openPackaging('BEER-330')
  await dialog.getByRole('button', { name: 'Add packaging unit' }).click()
  await dialog.getByLabel('Unit 2', { exact: true }).selectOption(caseUnit.id ?? '')
  await dialog.getByLabel('Factor 2').fill('12')
  await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(dialog.getByRole('alert')).toBeVisible()

  await dialog.getByLabel('Factor 2').fill('0')
  await dialog.getByLabel('Unit 2', { exact: true }).selectOption('')
  await dialog.getByRole('button', { name: 'Remove packaging unit 2' }).click()
  await dialog.getByLabel('Factor 1').fill('0')
  await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(dialog.getByRole('alert')).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await expect(row).toContainText('1 case = 24 can')
  await expect(row).toContainText('216,000')
})
