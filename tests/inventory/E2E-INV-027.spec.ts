// E2E-INV-027 · Return of unused parts from a repair order, after its stock issue is posted
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the part, its stock and the repair order are set up over the API, and the owner
// acts as MANAGER_A1. The draft issue offers no return on screen, so step 1's refusal is asserted
// over the API; the screen also stops an over-return and an empty reason before sending them.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart, waitForStockIssue } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-INV-027 unused parts return to stock after the stock issue is posted; more than was issued is refused', async ({
  page,
  signIn,
  freshOwner,
}) => {
  const owner = await freshOwner('inv027', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV027' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-272.72' })
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const order = await owner.api.createRepairOrder(gid, {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity: '2', unitPrice: '180000' },
    ],
  })
  const orderId = order.id ?? ''
  await waitForStockIssue(owner.api, gid, orderId)
  await signIn(owner.session, garage.id)

  // Step 1: while the issue is a draft nothing has left stock: no return is offered, and the API refuses one.
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  await expect(detail.stockIssue.status).toHaveText('Draft')
  await expect(detail.stockIssue.returnPartsButton).toBeHidden()
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, {
      repairOrderLineId: order.lines?.[0]?.id ?? '',
      enteredQuantity: '1.5',
      reason: 'customer declined the extra oil',
    }),
    409,
    'STOCK_ISSUE_NOT_POSTED',
  )
  expect(await onHand(owner.api, gid, oil)).toBe('10')

  // Step 2: "Issue now" takes the 2 L.
  await detail.stockIssue.issueNowButton.click()
  await expect(detail.stockIssue.status).toHaveText('Posted')
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('8 L')

  // Steps 3-4: 1.5 L go back with a reason; the reason is needed before the button works.
  await detail.goto(orderId)
  await detail.stockIssue.returnPartsButton.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Up to 2 L can still be returned.')
  await dialog.getByLabel('Quantity', { exact: true }).fill('1.5')
  const submit = dialog.getByRole('button', { name: 'Return to stock' })
  await expect(submit).toBeDisabled()
  await dialog.getByLabel('Reason').fill('customer declined the extra oil')
  await expect(submit).toBeEnabled()
  await submit.click()
  await expect(page.getByText('Parts returned to stock.')).toBeVisible()

  // The restored 1.5 L are back at the 100 they left with; the stock issue and its history show the return.
  await expect(detail.stockIssue.lines.first()).toContainText('1.5 L')
  await expect(detail.stockIssue.returnedParts).toHaveCount(1)
  await expect(detail.stockIssue.returnedParts.first()).toContainText('customer declined the extra oil')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('9.5 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫100')

  // Step 5: 1 L more would make 2.5 L returned against 2 L issued: the screen says so and will not send it.
  await detail.goto(orderId)
  await detail.stockIssue.returnPartsButton.click()
  await expect(dialog).toContainText('Up to 0.5 L can still be returned.')
  await dialog.getByLabel('Quantity', { exact: true }).fill('1')
  await dialog.getByLabel('Reason').fill('one more')
  await expect(dialog).toContainText('More than was issued and not yet returned.')
  await expect(dialog.getByRole('button', { name: 'Return to stock' })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, {
      repairOrderLineId: order.lines?.[0]?.id ?? '',
      enteredQuantity: '1',
      reason: 'one more',
    }),
    409,
    'RETURN_EXCEEDS_ISSUED',
  )

  // Step 6: the reason is required (the API refuses an empty one).
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, { repairOrderLineId: order.lines?.[0]?.id ?? '', enteredQuantity: '0.5', reason: '  ' }),
    422,
  )
  expect(await onHand(owner.api, gid, oil)).toBe('9.5')

  // Step 7: the stock card has the return: In 1.5, the reason, 9.5 on hand after it, at the cost 100.
  await inventory.goto()
  const card = await inventory.openStockCard('OIL-5W30')
  const movement = card.locator('tbody tr', { hasText: 'Parts returned from repair order' })
  await expect(movement).toHaveCount(1)
  await expect(movement).toContainText('In')
  await expect(movement).toContainText('+1.5')
  await expect(movement).toContainText('customer declined the extra oil')
  await expect(movement).toContainText('9.5 L')
  await expect(movement).toContainText('₫100')
})
