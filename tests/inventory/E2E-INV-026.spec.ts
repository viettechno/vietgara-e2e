// E2E-INV-026 · A return to supplier records the credit; cancelling puts the parts back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: driven over the API; the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers, expectRefused, onHand } from '../../src/fixtures/inventory.js'

test('E2E-INV-026 a return to supplier records the credit; cancelling restores the stock', async ({ freshOwner }) => {
  const owner = await freshOwner('inv026', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV026' })
  const gid = garage.id ?? ''
  const oil = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const oilId = oil.id ?? ''
  const { first, second } = await createSuppliers(owner.api, gid)
  const { receipt } = await owner.api.receiveStock(gid, oilId, { quantity: '10', unitCost: 120, supplierId: first.id })

  // Steps 1-2: 4 L go back against the receipt; the credit defaults to what it paid.
  const ret = await owner.api.createSupplierReturn(gid, {
    supplierId: first.id ?? '',
    goodsReceiptId: receipt.id,
    creditNoteNumber: 'CN-1001',
    notes: 'wrong grade',
    lines: [{ partId: oilId, enteredQuantity: '4' }],
  })
  expect(ret.status).toBe('ADJUSTMENT_STATUS_COMPLETED')
  expect(ret.number).toMatch(/^TN-\d{6}-/)
  expect(ret.goodsReceiptNumber).toBe(receipt.number)
  expect(ret.supplierName).toBeTruthy()
  expect(ret.lines?.[0]?.unitCost).toBe('120')
  expect(ret.creditAmount).toBe('480')
  expect(await onHand(owner.api, gid, oil)).toBe('6')
  const card = await owner.api.stockCard(gid, oilId, 'STOCK_TRANSACTION_REF_TYPE_SUPPLIER_RETURN')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({ type: 'STOCK_TRANSACTION_TYPE_OUT', quantity: '4', refNumber: ret.number })

  // Step 3: a typed cost wins over the receipt's.
  const typed = await owner.api.createSupplierReturn(gid, {
    supplierId: first.id ?? '',
    lines: [{ partId: oilId, enteredQuantity: '1', unitCost: '90' }],
  })
  expect(typed.creditAmount).toBe('90')
  expect(await onHand(owner.api, gid, oil)).toBe('5')

  // Step 4: more than is on hand, and a receipt of another supplier, are refused.
  await expectRefused(
    owner.api.createSupplierReturn(gid, { supplierId: first.id ?? '', lines: [{ partId: oilId, enteredQuantity: '60' }] }),
    409,
    'INSUFFICIENT_STOCK',
  )
  await expectRefused(
    owner.api.createSupplierReturn(gid, {
      supplierId: second.id ?? '',
      goodsReceiptId: receipt.id,
      lines: [{ partId: oilId, enteredQuantity: '1' }],
    }),
    422,
  )

  // Step 5: the list filters by supplier.
  expect((await owner.api.listSupplierReturns(gid, { supplierId: first.id })).data).toHaveLength(2)
  expect((await owner.api.listSupplierReturns(gid, { supplierId: second.id })).data ?? []).toHaveLength(0)

  // Step 6: cancelling the first return puts its 4 L back, once.
  const cancelled = await owner.api.cancelSupplierReturn(gid, ret.id ?? '')
  expect(cancelled.status).toBe('ADJUSTMENT_STATUS_CANCELLED')
  expect(await onHand(owner.api, gid, oil)).toBe('9')
  await expectRefused(owner.api.cancelSupplierReturn(gid, ret.id ?? ''), 409, 'SUPPLIER_RETURN_ALREADY_CANCELLED')
})
