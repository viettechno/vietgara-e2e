// E2E-INV-023 · Cancelling a draft closes it; cancelling a completed count posts its reversal, refused once the stock is used
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// The stock is "used" by a repair order that is completed and closed over the API
// (closing posts its stock issue; the close itself is E2E-INV-018's subject).
// Partial: driven over the API; the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, completeAndClose, expectRefused, onHand, stockedPart, waitForStockIssue } from '../../src/fixtures/inventory.js'

test('E2E-INV-023 cancelling a draft closes it; a completed count is reversed unless its stock was used', async ({ freshOwner }) => {
  const owner = await freshOwner('inv023', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV023' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-232.32' })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '20', unitCost: 50, unit: PIECE })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-M12', name: 'Spark plug M12', quantity: '5', unitCost: 200, unit: PIECE })
  const filterId = filter.id ?? ''
  const plugId = plug.id ?? ''

  // Precondition (E2E-INV-020): Shelf A is completed and added 2 PLUG-M12; FILTER-01 was counted down to 18.
  const shelfA = await owner.api.completeStockCount(
    gid,
    (await owner.api.createCountedStockCount(gid, 'Shelf A', { [plugId]: '7', [filterId]: '18' })).id ?? '',
  )
  expect(await onHand(owner.api, gid, plug)).toBe('7')

  // Steps 1-2: cancelling a draft closes it, moves no stock, and works only once.
  const draft = await owner.api.createCountedStockCount(gid, 'Draft', { [filterId]: '10' })
  expect((await owner.api.cancelStockCount(gid, draft.id ?? '')).status).toBe('STOCK_COUNT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, filter)).toBe('18')
  await expectRefused(owner.api.cancelStockCount(gid, draft.id ?? ''), 409, 'STOCK_COUNT_ALREADY_CANCELLED')

  // The reversal that works: a second completed count is cancelled while its stock is still on hand.
  const recount = await owner.api.completeStockCount(
    gid,
    (await owner.api.createCountedStockCount(gid, 'Recount', { [filterId]: '20' })).id ?? '',
  )
  expect(await onHand(owner.api, gid, filter)).toBe('20')
  expect((await owner.api.cancelStockCount(gid, recount.id ?? '')).status).toBe('STOCK_COUNT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, filter)).toBe('18')

  // Step 3: a repair order uses 6 PLUG-M12 and is closed; the stock issue posts and 1 is left.
  const order = await owner.api.createRepairOrder(gid, {
    vehicleId: vehicle.id ?? '',
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', itemRefId: plugId, description: 'Spark plug M12', quantity: '6', unitPrice: '90000' },
    ],
  })
  await waitForStockIssue(owner.api, gid, order.id ?? '')
  await completeAndClose(owner.api, gid, order)
  await expect.poll(() => onHand(owner.api, gid, plug), { timeout: 60_000 }).toBe('1')

  // Steps 4-5: taking back the 2 the count added would leave -1: refused, and nothing changes.
  await expectRefused(owner.api.cancelStockCount(gid, shelfA.id ?? ''), 409, 'INSUFFICIENT_STOCK_TO_REVERSE')
  expect((await owner.api.getStockCount(gid, shelfA.id ?? '')).status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(await onHand(owner.api, gid, plug)).toBe('1')
})
