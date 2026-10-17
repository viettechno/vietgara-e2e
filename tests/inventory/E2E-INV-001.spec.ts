// E2E-INV-001 · Add a part code to the catalogue
// (also exercises E2E-INV-003 · A goods receipt raises stock on hand when it is completed)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, createSuppliers } from '../../src/fixtures/inventory.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-001 add a part code to the catalogue', { tag: '@smoke' }, async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv001')
  const garage = await owner.api.createGarage({ name: 'QA Gara INV001' })
  await createSuppliers(owner.api, garage.id ?? '')
  await signIn(owner.session, garage.id)

  // The part belongs to the Catalogue: its unit first, then the part.
  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  await catalogue.createUnit('Litre', 'L')
  await expect(catalogue.row('Litre')).toBeVisible()
  await catalogue.createPart({ sku: 'OIL-5W30', name: 'Engine oil 5W-30', baseUnit: 'Litre (L)', reorderThreshold: '5' })
  await expect(catalogue.row('OIL-5W30')).toBeVisible()

  // Inventory lists it with nothing on hand, then a receipt raises it.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  const row = inventory.partRow('OIL-5W30')
  await expect(row).toBeVisible()
  await expect(row).toContainText('0 L') // no receipt yet

  await inventory.receiveStock('OIL-5W30', { quantity: '10', unitCost: '150000', supplier: SUPPLIER_1 })
  await expect(row).toContainText('10 L')
})
