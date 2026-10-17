// E2E-INV-027 · Return of unused parts from a repair order, after its stock issue is posted
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: driven over the API; the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart, waitForStockIssue } from '../../src/fixtures/inventory.js'

test('E2E-INV-027 unused parts return to stock after the stock issue is posted; more than was issued is refused', async ({
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
  const lineId = order.lines?.[0]?.id ?? ''
  const issue = await waitForStockIssue(owner.api, gid, orderId)
  const giveBack = (enteredQuantity: string, reason: string) =>
    owner.api.returnRepairOrderPart(gid, orderId, { repairOrderLineId: lineId, enteredQuantity, reason })

  // Step 1: nothing has left stock while the issue is a draft.
  await expectRefused(giveBack('1.5', 'customer declined the extra oil'), 409, 'STOCK_ISSUE_NOT_POSTED')
  expect(await onHand(owner.api, gid, oil)).toBe('10')

  // Step 2: "Issue now" takes the 2 L.
  await owner.api.postStockIssue(gid, issue.id ?? '')
  expect(await onHand(owner.api, gid, oil)).toBe('8')

  // Steps 3-4: 1.5 L go back at the cost they left with; the average cost is untouched.
  const back = await giveBack('1.5', 'customer declined the extra oil')
  expect(back).toMatchObject({ quantity: '1.5', unitCost: '100', reason: 'customer declined the extra oil' })
  expect(await onHand(owner.api, gid, oil)).toBe('9.5')
  expect((await owner.api.getStockLevel(gid, oil.id ?? '')).averageCost).toBe('100')

  // Step 5: 1 L more would make 2.5 L returned against 2 L issued: refused, nothing changes.
  await expectRefused(giveBack('1', 'one more'), 409, 'RETURN_EXCEEDS_ISSUED')
  expect(await onHand(owner.api, gid, oil)).toBe('9.5')

  // Step 6: the reason is required.
  await expectRefused(giveBack('0.5', '  '), 422)

  // Step 7: the stock issue line shows what came back, and the stock card the reason and balance.
  expect((await owner.api.getStockIssue(gid, orderId)).lines?.[0]?.returnedQuantity).toBe('1.5')
  const card = await owner.api.stockCard(gid, oil.id ?? '', 'STOCK_TRANSACTION_REF_TYPE_REPAIR_ORDER_RETURN')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({
    type: 'STOCK_TRANSACTION_TYPE_IN',
    quantity: '1.5',
    quantityAfter: '9.5',
    unitCost: '100',
    reason: 'customer declined the extra oil',
  })
})
