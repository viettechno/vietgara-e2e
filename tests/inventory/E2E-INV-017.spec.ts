// E2E-INV-017 · A repair order's stock issue reserves its parts; "issue now" posts it (partial)
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// The draft issue is created by an event a moment after the order, so the card
// is polled for with reloads, like the deduction in E2E-INV-008. Partial: the
// order is created over the API, and "Issue now" has no confirmation or second
// click to test (the button leaves once the issue is posted).
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers, waitForStockIssue } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-INV-017 a stock issue reserves the order parts; Issue now posts it', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv017', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV017' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-171.71' })
  const oil = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const filter = await owner.api.createSimplePart(gid, { sku: 'FILTER-01', name: 'Air filter' })
  const { first } = await createSuppliers(owner.api, gid)
  await owner.api.receiveStock(gid, oil.id ?? '', { quantity: '10', unitCost: 100, supplierId: first.id })
  await owner.api.receiveStock(gid, filter.id ?? '', { quantity: '5', unitCost: 2500, supplierId: first.id })
  // Step 1: a repair order with two part lines.
  const order = await owner.api.createRepairOrder(gid, {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: filter.id, description: 'Air filter', quantity: '1', unitPrice: '90000' },
    ],
  })
  await waitForStockIssue(owner.api, gid, order.id ?? '')
  await signIn(owner.session, garage.id)

  // Step 2: the draft reserves the parts: still 10 on hand, 6 available.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('4 reserved')
  await expect(inventory.partRow('FILTER-01')).toContainText('1 reserved')

  // Step 3: the order's stock issue card lists both lines as a draft.
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(order.id ?? '')
  await expect(detail.stockIssue.title).toBeVisible()
  await expect(detail.stockIssue.title).toContainText(/PX-/)
  await expect(detail.stockIssue.status).toHaveText('Draft')
  await expect(detail.stockIssue.lines).toHaveCount(2)
  await expect(detail.stockIssue.lines.filter({ hasText: 'OIL-5W30' })).toContainText('4')
  await expect(detail.stockIssue.lines.filter({ hasText: 'FILTER-01' })).toContainText('1')
  await expect(page.getByText('These parts are reserved for the order.')).toBeVisible()

  // Step 4: "Issue now" takes the stock before the order is closed.
  await detail.stockIssue.issueNowButton.click()
  await expect(page.getByText('Stock issue posted.')).toBeVisible()
  await expect(detail.stockIssue.status).toHaveText('Posted')
  await expect(detail.stockIssue.issueNowButton).toBeHidden()

  // Step 5: on hand dropped, nothing is reserved any more, and two Out movements reference the issue.
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('6 L')
  await expect(inventory.partRow('OIL-5W30')).not.toContainText('reserved')
  await expect(inventory.partRow('FILTER-01')).toContainText('4 L')
  await inventory.stockMovementsTab.click()
  const out = page.locator('tbody tr').filter({ hasText: 'Out' }).filter({ hasText: 'Stock issue' })
  await expect(out).toHaveCount(2)
})
