// E2E-CAT-007 · Delete or deactivate a unit, a category and a part that are in use
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { beer330 } from '../../src/fixtures/catalogue.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'

test('E2E-CAT-007 delete or deactivate a unit, a category and a part that are in use', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat007', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT007' })
  const gid = garage.id ?? ''
  const { part, can } = await beer330(owner.api, gid)
  const drinks = await owner.api.createCategory(gid, 'Drinks')
  await owner.api.updatePart(gid, part.id ?? '', { categoryId: drinks.id })
  await owner.api.createCategory(gid, 'Unused')
  await owner.api.createPart(gid, { sku: 'TMP-1', name: 'Nothing uses me', baseUnitId: can.id ?? '' })
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '1', unitId: undefined })
  await signIn(owner.session, garage.id)

  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  const dialog = page.getByRole('dialog')

  // Step 1: what is used is deactivated; what is not is deleted.
  await catalogue.row('BEER-330').getByRole('button', { name: 'Delete: BEER-330' }).click()
  await expect(dialog.getByText(/will only be deactivated/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await catalogue.row('TMP-1').getByRole('button', { name: 'Delete: TMP-1' }).click()
  await expect(dialog.getByText(/will be deleted for good/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(catalogue.row('TMP-1')).toBeHidden()

  await catalogue.unitsTab.click()
  await catalogue.row('Case').getByRole('button', { name: 'Delete: Case' }).click()
  await expect(dialog.getByText(/will only be deactivated/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Deactivate' }).click()
  await expect(catalogue.row('Case')).toBeHidden() // deactivated units leave the list

  await catalogue.categoriesTab.click()
  await catalogue.row('Drinks').getByRole('button', { name: 'Delete: Drinks' }).click()
  await expect(dialog.getByText(/will only be deactivated/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Deactivate' }).click()
  await catalogue.row('Unused').getByRole('button', { name: 'Delete: Unused' }).click()
  await expect(dialog.getByText(/will be deleted for good/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(catalogue.row('Unused')).toBeHidden()

  // Step 2: deactivated ones are not offered, but can be shown...
  await catalogue.partsTab.click()
  await catalogue.row('BEER-330').getByRole('button', { name: 'Delete: BEER-330' }).click()
  await dialog.getByRole('button', { name: 'Deactivate' }).click()
  await expect(catalogue.row('BEER-330')).toBeHidden()

  // Step 3: ...and reactivated.
  await catalogue.showInactive.click()
  await catalogue.row('BEER-330').getByRole('button', { name: 'Reactivate: BEER-330' }).click()
  await catalogue.showInactive.click()
  await expect(catalogue.row('BEER-330')).toBeVisible()
  await expect(catalogue.row('BEER-330')).not.toContainText('Inactive')
})
