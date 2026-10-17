// E2E-INV-015 · Purchases by supplier and stock valuation, on screen (partial)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the Excel exports (step 4) are checked by hand.
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_2, createSuppliers } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-015 purchases by supplier and the stock valuation', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv015', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV015' })
  const gid = garage.id ?? ''
  const oil = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const filter = await owner.api.createSimplePart(gid, { sku: 'FILTER-01', name: 'Air filter' })
  const fluids = await owner.api.createCategory(gid, 'Fluids')
  await owner.api.updatePart(gid, oil.id ?? '', { categoryId: fluids.id })
  const { first, second } = await createSuppliers(owner.api, gid)
  await owner.api.receiveStock(gid, oil.id ?? '', { quantity: '10', unitCost: 100, supplierId: first.id }) // 1,000
  await owner.api.receiveStock(gid, filter.id ?? '', { quantity: '4', unitCost: 2500, supplierId: second.id }) // 10,000
  await signIn(owner.session, garage.id)

  // Step 1: purchases of the whole period, then of one supplier.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await inventory.purchasesTab.click()
  const purchases = page.getByRole('table', { name: 'Purchases' })
  const total = page.getByText('Total', { exact: true }).locator('..')
  await expect(purchases.locator('tbody tr')).toHaveCount(2)
  await expect(total).toContainText('₫11,000')
  await page.getByLabel('Supplier', { exact: true }).fill(SUPPLIER_2)
  await page.getByRole('listbox').getByRole('option', { name: SUPPLIER_2 }).click()
  await expect(purchases.locator('tbody tr')).toHaveCount(1)
  await expect(purchases.locator('tbody tr')).toContainText('FILTER-01')
  await expect(total).toContainText('₫10,000')

  // Step 2: a period after today has no receipts.
  const tomorrow = new Date(Date.now() + 36 * 3600 * 1000).toISOString().slice(0, 10)
  await page.getByLabel('From', { exact: true }).fill(tomorrow)
  await expect(page.getByText('No completed goods receipts in this period.')).toBeVisible()

  // Step 3: the valuation lists each part with its value, grouped by category, with a total.
  await inventory.valuationTab.click()
  const parts = page.getByRole('table', { name: 'Stock valuation' })
  await expect(parts.locator('tbody tr', { hasText: 'OIL-5W30' })).toContainText('₫1,000')
  await expect(parts.locator('tbody tr', { hasText: 'FILTER-01' })).toContainText('₫10,000')
  const categories = page.getByRole('table', { name: 'By category' })
  await expect(categories.locator('tbody tr', { hasText: 'Fluids' })).toContainText('₫1,000')
  await expect(categories.locator('tbody tr', { hasText: 'No category' })).toContainText('₫10,000')
  await expect(page.getByText('Total', { exact: true }).locator('..')).toContainText('₫11,000')

  // Valued at a date before any receipt, nothing was in stock.
  await page.getByLabel('Valued at').fill('2020-01-01')
  await expect(page.getByText('Nothing was in stock on this date.')).toBeVisible()
})
