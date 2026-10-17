// E2E-INV-013 · Cancelling a completed receipt restores stock and cost; refused once the stock is used
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// The stock is "used" by posting the stock issue of a repair order over the
// API (the scenario closes the order; closing is E2E-INV-018's subject).
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers, waitForStockIssue } from '../../src/fixtures/inventory.js'
import { GoodsReceiptPage } from '../../src/pages/inventory/GoodsReceiptPage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-013 reversing a receipt restores stock and cost; refused once the stock is used', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv013', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV013' })
  const gid = garage.id ?? ''
  const part = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-131.31' })
  const { first } = await createSuppliers(owner.api, gid)
  const { receipt: r1 } = await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 100, supplierId: first.id })
  const { receipt: r2 } = await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 200, supplierId: first.id })
  await signIn(owner.session, garage.id)

  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('20 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫150')

  // Step 1: reverse R2 from its page, with the confirmation.
  const receipt = new GoodsReceiptPage(page)
  await inventory.goodsReceiptsTab.click()
  await page.getByRole('link', { name: r2.number ?? '' }).click()
  await expect(receipt.status).toHaveText('Completed')
  await receipt.reverseButton.click()
  await expect(page.getByRole('dialog')).toContainText(
    'Its stock and cost are taken back. This is refused if the stock has already been used.',
  )
  await page.getByRole('dialog').getByRole('button', { name: 'Reverse receipt' }).click()

  // Step 2: R2 is Cancelled, the stock and the average are back to R1 alone.
  await expect(inventory.goodsReceiptsTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('tbody tr', { hasText: r2.number ?? '' })).toContainText('Cancelled')
  await inventory.stockOnHandTab.click()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫100')

  // Step 3: 3 L are used by a repair order's stock issue.
  const order = await owner.api.createRepairOrder(gid, {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: part.id, description: 'Engine oil 5W-30', quantity: '3', unitPrice: '180000' },
    ],
  })
  const issue = await waitForStockIssue(owner.api, gid, order.id ?? '')
  await owner.api.postStockIssue(gid, issue.id ?? '')
  await page.reload()
  await expect(inventory.partRow('OIL-5W30')).toContainText('7 L')

  // Step 4: R1's 10 L can no longer be taken back: refused, nothing changes.
  await inventory.goodsReceiptsTab.click()
  await page.getByRole('link', { name: r1.number ?? '' }).click()
  await receipt.reverseButton.click()
  await page.getByRole('dialog').getByRole('button', { name: 'Reverse receipt' }).click()
  await expect(page.getByRole('dialog')).toContainText('Part of this delivery has already been used, so the receipt cannot be reversed.')
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
  await receipt.goto(r1.id ?? '')
  await expect(receipt.status).toHaveText('Completed')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('7 L')

  // A cancelled receipt stays readable, with its notice, and cannot be reversed again.
  await receipt.goto(r2.id ?? '')
  await expect(receipt.status).toHaveText('Cancelled')
  await expect(page.getByText('This receipt was cancelled')).toBeVisible()
  await expect(receipt.reverseButton).toBeHidden()
})
