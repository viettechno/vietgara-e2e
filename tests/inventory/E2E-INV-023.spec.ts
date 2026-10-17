// E2E-INV-023 · Cancelling a completed count restores the stock; refused once the stock is used
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-023 cancelling a completed count restores the stock; refused once the stock is used', async ({ freshOwner }) => {
  const owner = await freshOwner('inv023', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV023' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '5', unitCost: 100 })
  const oilId = oil.id ?? ''

  // Steps 1-2: count 1 raises the stock to 9; cancelling it reverses the adjustment.
  const first = await owner.api.completeStockCount(
    gid,
    (await owner.api.createCountedStockCount(gid, 'Count 1', { [oilId]: '9' })).id ?? '',
  )
  expect(await onHand(owner.api, gid, oil)).toBe('9')
  const cancelled = await owner.api.cancelStockCount(gid, first.id ?? '')
  expect(cancelled.status).toBe('STOCK_COUNT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, oil)).toBe('5')
  await expectRefused(owner.api.cancelStockCount(gid, first.id ?? ''), 409, 'STOCK_COUNT_ALREADY_CANCELLED')

  // Steps 3-4: count 2 raises it to 9 again, then a write-off uses 8 L.
  const second = await owner.api.completeStockCount(
    gid,
    (await owner.api.createCountedStockCount(gid, 'Count 2', { [oilId]: '9' })).id ?? '',
  )
  expect(await onHand(owner.api, gid, oil)).toBe('9')
  await owner.api.createWriteOff(gid, { reason: 'WRITE_OFF_REASON_LOST', lines: [{ partId: oilId, enteredQuantity: '8' }] })
  expect(await onHand(owner.api, gid, oil)).toBe('1')

  // Step 5: taking back the 4 L the count added would leave -3: refused, nothing changes.
  await expectRefused(owner.api.cancelStockCount(gid, second.id ?? ''), 409, 'INSUFFICIENT_STOCK_TO_REVERSE')
  expect((await owner.api.getStockCount(gid, second.id ?? '')).status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(await onHand(owner.api, gid, oil)).toBe('1')
})
