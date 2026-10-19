// E2E-INV-023 · Cancelling a draft closes it; cancelling a completed count posts its reversal, refused once the stock is used
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial. The draft is cancelled on screen. The reversal of a *completed* count (steps 4-5)
// is driven over the API: owner-web 7.1 shows Cancel count on drafts only, so the screen
// cannot take the step the scenario describes (reported to web). The stock is "used" by a
// repair order completed and closed over the API (the close is E2E-INV-018's subject).
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, completeAndClose, expectRefused, onHand, stockedPart, waitForStockIssue } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { StockCountPage, documentRow } from '../../src/pages/inventory/StockAdjustmentPages.js'

test('E2E-INV-023 cancelling a draft closes it; a completed count is reversed unless its stock was used', async ({
  page,
  signIn,
  freshOwner,
}) => {
  // Events (stock issue, reservation, posting) are polled for up to 60 s; the full suite shares the runner with the stack.
  test.setTimeout(120_000)
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
  await signIn(owner.session, garage.id)

  // Step 1: a new draft with FILTER-01 is cancelled on screen: it closes and no stock moves.
  const draft = await owner.api.createCountedStockCount(gid, 'Draft', { [filterId]: '10' })
  const count = new StockCountPage(page)
  await count.goto(draft.id ?? '')
  await count.cancelDraft()
  await expect(page.getByText('Count cancelled.')).toBeVisible()
  const inventory = new InventoryPage(page)
  await expect(inventory.stockCountsTab).toHaveAttribute('aria-selected', 'true')
  await expect(documentRow(page, draft.number ?? '')).toContainText('Cancelled')
  expect(await onHand(owner.api, gid, filter)).toBe('18')

  // Step 2: a cancelled count offers no second cancel, and the API refuses one.
  await count.goto(draft.id ?? '')
  await expect(count.status).toHaveText('Cancelled')
  await expect(count.cancelButton).toBeHidden()
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

  // Steps 4-5: taking back the 2 the count added would leave -1: refused, nothing changes.
  await expectRefused(owner.api.cancelStockCount(gid, shelfA.id ?? ''), 409, 'INSUFFICIENT_STOCK_TO_REVERSE')
  await inventory.goto()
  await expect(inventory.partRow('PLUG-M12')).toContainText('1 pc')
  await count.goto(shelfA.id ?? '')
  await expect(count.status).toHaveText('Completed')
})
