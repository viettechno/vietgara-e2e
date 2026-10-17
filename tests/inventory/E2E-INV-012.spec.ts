// E2E-INV-012 · Completing a receipt updates stock and the weighted-average cost
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-012 completing a receipt updates stock and the weighted-average cost', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv012', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV012' })
  const gid = garage.id ?? ''
  const part = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const { first } = await createSuppliers(owner.api, gid)
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 100, supplierId: first.id })
  await signIn(owner.session, garage.id)

  // Steps 1-2: one receipt: average cost 100, value 1,000.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  const row = inventory.partRow('OIL-5W30')
  await expect(row).toContainText('10 L')
  await expect(row).toContainText('₫100')
  await expect(row).toContainText('₫1,000')

  // Steps 3-4: a dearer second receipt moves the average: (10 x 100 + 10 x 200) / 20 = 150.
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 200, supplierId: first.id })
  await page.reload()
  await expect(row).toContainText('20 L')
  await expect(row).toContainText('₫150')
  await expect(row).toContainText('₫3,000')

  // The movements keep each receipt's own unit cost.
  await inventory.stockMovementsTab.click()
  const receipts = page.locator('tbody tr', { hasText: 'OIL-5W30' }).filter({ hasText: 'Goods receipt' })
  await expect(receipts).toHaveCount(2)
  // Since Release 7.1 the reference cell also carries the document number, so match on the row.
  await expect(receipts.filter({ hasText: '₫100' })).toHaveCount(1)
  await expect(receipts.filter({ hasText: '₫200' })).toHaveCount(1)
})
