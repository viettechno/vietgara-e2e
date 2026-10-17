// E2E-INV-003 · A goods receipt raises stock on hand when it is completed
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, createSuppliers } from '../../src/fixtures/inventory.js'
import { GoodsReceiptPage } from '../../src/pages/inventory/GoodsReceiptPage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-003 a goods receipt raises stock on hand when it is completed', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv003', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV003' })
  await owner.api.createSimplePart(garage.id ?? '', { sku: 'OIL-5W30', name: 'Engine oil 5W-30', reorderThreshold: '5' })
  await createSuppliers(owner.api, garage.id ?? '')
  await signIn(owner.session, garage.id)

  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('0 L')

  // Steps 1-2: a draft receipt is listed, and changes no stock.
  await inventory.goodsReceiptsTab.click()
  await page.getByRole('link', { name: 'New goods receipt' }).click()
  const receipt = new GoodsReceiptPage(page)
  await receipt.chooseDefaultSupplier(SUPPLIER_1)
  await receipt.deliveryNote.fill('DN-01')
  await receipt.addLine({ sku: 'OIL-5W30', quantity: '10', unitCost: '150000' })
  await receipt.saveDraft()
  const receiptId = await receipt.savedId()
  await expect(receipt.status).toHaveText('Draft')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('0 L')
  await inventory.goodsReceiptsTab.click()
  const listed = page.locator('tbody tr', { hasText: 'DN-01' })
  await expect(listed).toContainText('Draft')
  await expect(listed).toContainText(/PN-\d{6}-\d{4}/)

  // Steps 3-4: completing it raises the stock.
  await receipt.goto(receiptId)
  await receipt.complete()
  await expect(receipt.status).toHaveText('Completed')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')

  // Step 5: a second receipt, without a unit cost.
  await inventory.receiveStock('OIL-5W30', { quantity: '5', supplier: SUPPLIER_1 })
  await expect(inventory.partRow('OIL-5W30')).toContainText('15 L')

  // Both receipts are In movements referencing a goods receipt.
  await inventory.stockMovementsTab.click()
  const receipts = page.locator('tbody tr', { hasText: 'OIL-5W30' }).filter({ hasText: 'In' }).filter({ hasText: 'Goods receipt' })
  await expect(receipts).toHaveCount(2)
})
