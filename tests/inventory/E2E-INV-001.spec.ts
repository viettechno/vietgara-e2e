// E2E-INV-001 · Add a part code to the catalogue
// (also exercises E2E-INV-003 · Record a goods receipt increases stock on hand)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-001 add a part code to the catalogue', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv001')
  const garage = await owner.api.createGarage({ name: 'QA Gara INV001' })
  await signIn(owner.session, garage.id)

  const inventory = new InventoryPage(page)
  await inventory.goto()

  await inventory.createItem({ sku: 'OIL-5W30', name: 'Engine oil 5W-30', unit: 'L', reorderThreshold: 5 })

  const row = inventory.itemRow('OIL-5W30')
  await expect(row).toBeVisible()
  await expect(row).toContainText('0 L') // no receipt yet

  await inventory.receiveStock('OIL-5W30', { quantity: '10', unitCost: '150000' })
  await expect(row).toContainText('10.00 L')
})
