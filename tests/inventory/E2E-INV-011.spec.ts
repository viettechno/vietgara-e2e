// E2E-INV-011 · A goods receipt with a supplier on each line; completion is blocked while a line has none (partial)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the UI offers no way to clear one line's supplier while the receipt
// has a header supplier (the line inherits it), so "completion is blocked" is
// exercised with no supplier anywhere; the PDF export is checked by hand.
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, SUPPLIER_2, createSuppliers } from '../../src/fixtures/inventory.js'
import { GoodsReceiptPage } from '../../src/pages/inventory/GoodsReceiptPage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-011 a goods receipt with a supplier on each line', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv011', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV011' })
  const gid = garage.id ?? ''
  await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', reorderThreshold: '5' })
  await owner.api.createSimplePart(gid, { sku: 'FILTER-01', name: 'Air filter', reorderThreshold: '2' })
  await createSuppliers(owner.api, gid)
  await signIn(owner.session, garage.id)

  // Step 1: a new receipt with two parts and no supplier yet: it can be saved, not completed.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await inventory.goodsReceiptsTab.click()
  await page.getByRole('link', { name: 'New goods receipt' }).click()
  const receipt = new GoodsReceiptPage(page)
  await receipt.deliveryNote.fill('DN-77')
  await receipt.addLine({ sku: 'OIL-5W30', quantity: '10', unitCost: '100' })
  await receipt.addLine({ sku: 'FILTER-01', quantity: '4', unitCost: '2500' })
  await expect(page.getByText('₫11,000')).toBeVisible() // the running total: 10 x 100 + 4 x 2,500
  await expect(receipt.completeButton).toBeDisabled()
  await expect(receipt.supplierNeededHint).toBeVisible()
  await receipt.saveDraft()
  const receiptId = await receipt.savedId()
  await expect(receipt.status).toHaveText('Draft')
  await expect(receipt.completeButton).toBeDisabled()
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('0 L') // a draft moves no stock

  // Step 2: the header supplier covers the first line; the second has its own.
  await receipt.goto(receiptId)
  await receipt.chooseDefaultSupplier(SUPPLIER_1)
  await expect(receipt.completeButton).toBeEnabled() // every line now has a supplier
  await receipt.chooseLineSupplier(1, SUPPLIER_2)
  await receipt.complete()
  await expect(receipt.status).toHaveText('Completed')

  // Step 3: the saved document is read-only and shows each line's supplier. Reload:
  // the editor keeps its pre-save line state (an inherited supplier shows as a dash) until then.
  await page.reload()
  await expect(receipt.status).toHaveText('Completed')
  await expect(receipt.completeButton).toBeHidden()
  await expect(receipt.deliveryNote).toBeDisabled()
  await expect(receipt.deliveryNote).toHaveValue('DN-77')
  await expect(receipt.lineRow(0)).toContainText(SUPPLIER_1)
  await expect(receipt.lineRow(1)).toContainText(SUPPLIER_2)

  // Step 4: stock and cost of each part followed.
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫100')
  await expect(inventory.partRow('FILTER-01')).toContainText('4 L')
  await expect(inventory.partRow('FILTER-01')).toContainText('₫2,500')
})
