// E2E-CAT-005 · Category tree (three levels) and filtering by category and brand
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-CAT-005 category tree (three levels) and filtering by category and brand', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat005', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT005' })
  const gid = garage.id ?? ''
  const oil = await owner.api.createCategory(gid, 'Engine oil')
  const synthetic = await owner.api.createCategory(gid, 'Synthetic', oil.id)
  const filters = await owner.api.createCategory(gid, 'Filters')
  const litre = await owner.api.createUnit(gid, 'Litre', 'L')
  await owner.api.createPart(gid, {
    sku: 'OIL-5W30',
    name: 'Engine oil 5W-30',
    baseUnitId: litre.id ?? '',
    categoryId: synthetic.id,
    brand: 'Castrol',
  })
  await owner.api.createPart(gid, {
    sku: 'FLT-OIL-01',
    name: 'Oil filter',
    baseUnitId: litre.id ?? '',
    categoryId: filters.id,
    brand: 'Bosch',
  })
  await signIn(owner.session, garage.id)

  // Step 1: a third level is created; the fourth is not even offered.
  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  await catalogue.createCategory('5W-30', 'Synthetic')
  await catalogue.categoriesTab.click()
  const leaf = catalogue.row('5W-30')
  await expect(leaf).toBeVisible()
  await expect(leaf.getByRole('button', { name: /Add sub-category/ })).toBeHidden()

  // Step 2: the stock list filters by category, including sub-categories.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.itemRow('OIL-5W30')).toBeVisible()
  await expect(inventory.itemRow('FLT-OIL-01')).toBeVisible()
  await inventory.categoryFilter.selectOption({ label: 'Engine oil' })
  await expect(inventory.itemRow('OIL-5W30')).toBeVisible()
  await expect(inventory.itemRow('FLT-OIL-01')).toBeHidden()
  await inventory.categoryFilter.selectOption({ label: 'Filters' })
  await expect(inventory.itemRow('FLT-OIL-01')).toBeVisible()
  await expect(inventory.itemRow('OIL-5W30')).toBeHidden()
  await inventory.categoryFilter.selectOption({ label: 'All categories' })
  await expect(inventory.itemRow('OIL-5W30')).toBeVisible()

  // Step 3: by brand.
  await inventory.brandFilter.fill('Castrol')
  await expect(inventory.itemRow('OIL-5W30')).toBeVisible()
  await expect(inventory.itemRow('FLT-OIL-01')).toBeHidden()
  await inventory.brandFilter.fill('nobrand')
  await expect(page.getByText('No matching results')).toBeVisible()
})
