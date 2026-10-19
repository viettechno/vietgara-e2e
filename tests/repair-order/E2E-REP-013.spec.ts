// E2E-REP-013 · Add, edit and remove lines of an open repair order
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { completeAndClose, expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, lineOf, oilParts, openOrder } from '../../src/fixtures/jobs.js'
import { RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-REP-013 add, edit and remove lines of an open repair order', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('rep013', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP013' })
  const gid = garage.id ?? ''
  await oilParts(owner.api, gid)
  const { vehicle } = await customerWithVehicle(owner.api, gid, '013')
  const order = await openOrder(owner.api, gid, vehicle.id ?? '')
  const orderId = order.id ?? ''
  await signIn(owner.session, garage.id)
  const detail = new RepairOrderDetailPage(page)
  await detail.goto(orderId)
  const read = () => owner.api.getRepairOrder(gid, orderId)

  // Step 1: a labor line, then a part line; the lines follow the first and the total adds up.
  await detail.addLineButton.click()
  await detail.saveLineDialog({ description: 'Wash', quantity: '1', unitPrice: '50000' })
  await detail.addLineButton.click()
  await detail.saveLineDialog({ itemType: 'Part', partSku: 'OIL-5W30', quantity: '4' })
  await expect(detail.editLineButton('Engine oil 5W-30')).toBeVisible()
  let current = await read()
  expect((current.lines ?? []).map((line) => line.description)).toEqual(['Oil change', 'Wash', 'Engine oil 5W-30'])
  expect(current.totalAmount).toBe('660000') // 250,000 + 50,000 + 4 × 90,000

  // Step 2: Wash becomes Full wash at 80,000.
  await detail.editLineButton('Wash').click()
  await detail.saveLineDialog({ description: 'Full wash', unitPrice: '80000' })
  await expect(detail.editLineButton('Full wash')).toBeVisible()
  current = await read()
  expect(lineOf(current, 'Full wash').lineTotal).toBe('80000')
  expect(current.totalAmount).toBe('690000')

  // Step 3: the oil goes to 5 L, then to 1 Jug (= 5 L); a bare quantity on the jug line is refused.
  await detail.editLineButton('Engine oil 5W-30').click()
  await detail.saveLineDialog({ quantity: '5' })
  expect(lineOf(await read(), 'Engine oil 5W-30')).toMatchObject({ quantity: '5', lineTotal: '450000' })
  await detail.editLineButton('Engine oil 5W-30').click()
  await detail.saveLineDialog({ unit: 'jug', quantity: '1' })
  const jug = lineOf(await read(), 'Engine oil 5W-30')
  expect(jug).toMatchObject({ unitAbbreviation: 'jug', enteredQuantity: '1', quantity: '5', lineTotal: '450000' })
  await expectRefused(owner.api.editRepairOrderLine(gid, orderId, jug.id ?? '', { quantity: '10' }), 422)

  // Step 4: Full wash goes, and the lines renumber without a gap.
  await detail.removeLine('Full wash')
  await expect(detail.editLineButton('Full wash')).toBeHidden()
  current = await read()
  expect((current.lines ?? []).map((line) => line.description)).toEqual(['Oil change', 'Engine oil 5W-30'])
  expect(current.totalAmount).toBe('700000')

  // Step 5: one more goes; the last line cannot be removed (the screen disables it, the API refuses).
  await detail.removeLine('Engine oil 5W-30')
  await expect(detail.removeLineButton('Oil change')).toBeDisabled()
  const last = await read()
  await expectRefused(owner.api.removeRepairOrderLine(gid, orderId, lineOf(last, 'Oil change').id ?? ''), 409, 'LAST_LINE')

  // Step 6: a closed order refuses every change, and the screen offers none.
  await completeAndClose(owner.api, gid, last)
  await page.reload()
  await expect(detail.addLineButton).toBeHidden()
  await expect(detail.editLineButton('Oil change')).toBeHidden()
  await expectRefused(
    owner.api.addRepairOrderLine(gid, orderId, {
      itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR',
      description: 'Late',
      quantity: '1',
      unitPrice: '1',
    }),
    409,
  )
  await expectRefused(owner.api.editRepairOrderLine(gid, orderId, lineOf(last, 'Oil change').id ?? '', { description: 'Late' }), 409)
})
