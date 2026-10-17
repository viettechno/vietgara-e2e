// E2E-INV-026 · A return to supplier records the credit; cancelling puts the parts back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the suppliers, the part and the completed receipt are set up over the API, and the
// owner acts as MANAGER_A1. The receipt search only lists receipts of the chosen supplier, so the
// link to another supplier's receipt (step 5) cannot be made on screen and is asserted over the API.
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers, expectRefused } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { SupplierReturnPage, documentRow } from '../../src/pages/inventory/StockAdjustmentPages.js'

test('E2E-INV-026 a return to supplier records the credit; cancelling restores the stock', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv026', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV026' })
  const gid = garage.id ?? ''
  const oil = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const { first, second } = await createSuppliers(owner.api, gid)
  const { receipt } = await owner.api.receiveStock(gid, oil.id ?? '', { quantity: '10', unitCost: 120, supplierId: first.id })
  await signIn(owner.session, garage.id)

  // Step 1: 4 L go back to S1 against the receipt, with the credit note number; the credit is left automatic.
  const inventory = new InventoryPage(page)
  await inventory.gotoTab('returns')
  await page.getByRole('link', { name: 'New supplier return' }).click()
  const supplierReturn = new SupplierReturnPage(page)
  await supplierReturn.chooseSupplier('QA Supplier Phu Tung Sai Gon')
  await supplierReturn.chooseReceipt(receipt.number ?? '')
  await supplierReturn.creditNote.fill('CN-1001')
  await page.getByLabel('Note', { exact: true }).fill('wrong grade')
  await supplierReturn.addLine('OIL-5W30', '4')
  const firstId = await supplierReturn.post()
  await expect(page.getByText('Return posted. Stock is updated.')).toBeVisible()
  const title = page.getByRole('heading', { level: 1 })
  await expect(title).toHaveText(/^TN-\d{6}-/)
  const number = (await title.innerText()).trim()
  await expect(page.getByText('Completed', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: receipt.number ?? '' })).toBeVisible()
  await expect(page.getByText('CN-1001')).toBeVisible()

  // Step 2: the line costs 120, what the receipt paid, so the credit is 4 x 120 = 480.
  await expect(supplierReturn.lineRow(0)).toContainText('₫120')
  await expect(supplierReturn.lineRow(0)).toContainText('₫480')
  await expect(page.getByText('₫480').last()).toBeVisible()

  // Step 3: 6 L are left.
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('6 L')

  // Step 4: a second return of 1 L at a typed credit of 90.
  await supplierReturn.gotoNew()
  await supplierReturn.chooseSupplier('QA Supplier Phu Tung Sai Gon')
  await supplierReturn.addLine('OIL-5W30', '1', '90')
  await supplierReturn.post()
  await expect(supplierReturn.lineRow(0)).toContainText('₫90')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('5 L')

  // Step 5: S2 has no receipt to link (the search lists the chosen supplier's only); the API refuses the
  // link, and 60 L is refused on screen for want of stock.
  await supplierReturn.gotoNew()
  await supplierReturn.chooseSupplier('QA Supplier Lop Xe Viet')
  await supplierReturn.goodsReceipt.fill(receipt.number ?? '')
  await expect(page.getByRole('listbox')).toContainText('None')
  await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(0)
  await expectRefused(
    owner.api.createSupplierReturn(gid, {
      supplierId: second.id ?? '',
      goodsReceiptId: receipt.id,
      lines: [{ partId: oil.id ?? '', enteredQuantity: '1' }],
    }),
    422,
  )
  await supplierReturn.gotoNew()
  await supplierReturn.chooseSupplier('QA Supplier Phu Tung Sai Gon')
  await supplierReturn.addLine('OIL-5W30', '60')
  await supplierReturn.postButton.click()
  await expect(page.getByText('There is not enough stock for this.')).toBeVisible()
  await expect(page).toHaveURL(/\/inventory\/supplier-returns\/new$/)

  // Step 6: cancelling the first return puts its 4 L back (9 L in all); the list shows it Cancelled.
  await page.goto(`/inventory/supplier-returns/${firstId}`)
  await supplierReturn.cancel()
  await expect(page.getByText('Return cancelled.')).toBeVisible()
  await expect(inventory.supplierReturnsTab).toHaveAttribute('aria-selected', 'true')
  await expect(documentRow(page, number)).toContainText('Cancelled')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('9 L')
  await page.goto(`/inventory/supplier-returns/${firstId}`)
  await expect(supplierReturn.cancelButton).toBeHidden()
  await expectRefused(owner.api.cancelSupplierReturn(gid, firstId), 409, 'SUPPLIER_RETURN_ALREADY_CANCELLED')
})
