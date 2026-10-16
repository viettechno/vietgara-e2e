// E2E-INV-003 · Record a goods receipt increases stock on hand
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-003 record a goods receipt increases stock on hand', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv003')
  const garage = await owner.api.createGarage({ name: 'QA Gara INV003' })
  await owner.api.createSimplePart(garage.id ?? '', { sku: 'OIL-5W30', name: 'Engine oil 5W-30', reorderThreshold: '5' })
  await signIn(owner.session, garage.id)

  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.itemRow('OIL-5W30')).toContainText('0 L')

  await inventory.receiveStock('OIL-5W30', { quantity: '10', unitCost: '150000' })
  await expect(inventory.itemRow('OIL-5W30')).toContainText('10 L')

  await inventory.receiveStock('OIL-5W30', { quantity: '5' })
  await expect(inventory.itemRow('OIL-5W30')).toContainText('15 L')

  await inventory.stockMovementsTab.click()
  const receipts = page.locator('tbody tr', { hasText: 'OIL-5W30' }).filter({ hasText: 'In' })
  await expect(receipts).toHaveCount(2)
})
