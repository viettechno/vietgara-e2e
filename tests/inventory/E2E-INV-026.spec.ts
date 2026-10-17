// E2E-INV-026 · Unused parts of a posted stock issue return to stock; more than was issued is refused
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart, waitForStockIssue } from '../../src/fixtures/inventory.js'

test('E2E-INV-026 unused parts of a posted stock issue return to stock; more than was issued is refused', async ({ freshOwner }) => {
  const owner = await freshOwner('inv026', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV026' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-262.62' })
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const order = await owner.api.createRepairOrder(gid, {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: oil.id, description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
    ],
  })
  const orderId = order.id ?? ''
  const lineId = order.lines?.[0]?.id ?? ''
  const issue = await waitForStockIssue(owner.api, gid, orderId)

  // Step 1: nothing has left stock while the issue is a draft.
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, { repairOrderLineId: lineId, enteredQuantity: '1', reason: 'not needed' }),
    409,
    'STOCK_ISSUE_NOT_POSTED',
  )

  // Step 2: posting the issue takes the 4 L.
  await owner.api.postStockIssue(gid, issue.id ?? '')
  expect(await onHand(owner.api, gid, oil)).toBe('6')

  // Step 3: a reason is required.
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, { repairOrderLineId: lineId, enteredQuantity: '1.5', reason: '  ' }),
    422,
  )

  // Steps 4-5: 1.5 L go back at the cost they left with; the average cost is untouched.
  const back = await owner.api.returnRepairOrderPart(gid, orderId, {
    repairOrderLineId: lineId,
    enteredQuantity: '1.5',
    reason: 'customer declined the extra oil',
  })
  expect(back).toMatchObject({ quantity: '1.5', unitCost: '100', reason: 'customer declined the extra oil' })
  expect(await onHand(owner.api, gid, oil)).toBe('7.5')
  expect((await owner.api.getStockLevel(gid, oil.id ?? '')).averageCost).toBe('100')
  expect((await owner.api.getStockIssue(gid, orderId)).lines?.[0]?.returnedQuantity).toBe('1.5')
  const card = await owner.api.stockCard(gid, oil.id ?? '', 'STOCK_TRANSACTION_REF_TYPE_REPAIR_ORDER_RETURN')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({
    type: 'STOCK_TRANSACTION_TYPE_IN',
    quantity: '1.5',
    quantityAfter: '7.5',
    unitCost: '100',
    reason: 'customer declined the extra oil',
  })

  // Step 6: only 2.5 L are left to return, so 3 is refused and nothing changes.
  await expectRefused(
    owner.api.returnRepairOrderPart(gid, orderId, { repairOrderLineId: lineId, enteredQuantity: '3', reason: 'too many' }),
    409,
    'RETURN_EXCEEDS_ISSUED',
  )
  expect(await onHand(owner.api, gid, oil)).toBe('7.5')
})
