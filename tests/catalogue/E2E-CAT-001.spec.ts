// E2E-CAT-001 · Create a unit and a part with base unit, price, category and brand
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test(
  'E2E-CAT-001 create a unit and a part with base unit, price, category and brand',
  { tag: '@smoke' },
  async ({ page, signIn, freshOwner }) => {
    const owner = await freshOwner('cat001', { locale: 'LOCALE_EN' })
    const garage = await owner.api.createGarage({ name: 'QA Gara CAT001' })
    await owner.api.createCategory(garage.id ?? '', 'Filters')
    await signIn(owner.session, garage.id)

    const catalogue = new CataloguePage(page)
    await catalogue.goto()

    // Step 1: the unit, then a second one that differs only by letter case.
    await catalogue.createUnit('Bottle', 'btl')
    await expect(catalogue.row('Bottle')).toBeVisible()
    await catalogue.newUnitButton.first().click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('Name', { exact: true }).fill('bottle')
    await dialog.getByLabel('Abbreviation').fill('b')
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
    await expect(dialog.getByRole('alert')).toBeVisible() // refused as a duplicate name
    await dialog.getByRole('button', { name: 'Cancel' }).click()

    // Step 2: the part must have a base unit.
    await catalogue.partsTab.click()
    await catalogue.newPartButton.first().click()
    await dialog.getByLabel('SKU', { exact: true }).fill('QA-WATER-500')
    await dialog.getByLabel('Name', { exact: true }).fill('Mineral water 500 ml')
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
    await expect(dialog.getByLabel('Base unit', { exact: true })).toHaveJSProperty('validity.valueMissing', true) // the form refuses to save
    await dialog.getByRole('button', { name: 'Cancel' }).click()

    await catalogue.createPart({
      sku: 'QA-WATER-500',
      name: 'Mineral water 500 ml',
      baseUnit: 'Bottle (btl)',
      salePrice: '6000',
      category: 'Filters',
      brand: 'Aquafina',
    })

    // Step 3: the detail shows the unit, price, category and brand; stock is nil.
    const row = catalogue.row('QA-WATER-500')
    await expect(row).toContainText('Bottle (btl)')
    await expect(row).toContainText('6,000')
    await expect(row).toContainText('Filters')
    await expect(row).toContainText('Aquafina')

    const inventory = new InventoryPage(page)
    await inventory.goto()
    await expect(inventory.partRow('QA-WATER-500')).toContainText('0 btl')
  },
)
