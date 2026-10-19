// E2E-REP-018 · Permissions for line changes and cancellation
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
//
// API only (the scenario is marked Automated (API)).
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, lineOf, openOrder } from '../../src/fixtures/jobs.js'
import { joinWith } from '../../src/fixtures/members.js'

test('E2E-REP-018 permissions for line changes and cancellation', async ({ freshOwner }) => {
  const owner = await freshOwner('rep018', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara REP018' })
  const gid = garage.id ?? ''
  const { vehicle } = await customerWithVehicle(owner.api, gid, '018')
  const order = await openOrder(owner.api, gid, vehicle.id ?? '', [
    { itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'More work', quantity: '1', unitPrice: '1000' },
  ])
  const orderId = order.id ?? ''
  const lineId = lineOf(order, 'Oil change').id ?? ''

  // Step 1: Repair order → View sees the lines and changes nothing.
  const reader = await joinWith(owner, gid, await freshOwner('rep018reader'), 'Order Reader', ['PERMISSION_REPAIR_ORDER_READ'])
  expect((await reader.api.getRepairOrder(gid, orderId)).lines).toHaveLength(2)
  await expectRefused(
    reader.api.addRepairOrderLine(gid, orderId, {
      itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR',
      description: 'Nope',
      quantity: '1',
      unitPrice: '1',
    }),
    403,
  )
  await expectRefused(reader.api.editRepairOrderLine(gid, orderId, lineId, { description: 'Nope' }), 403)
  await expectRefused(reader.api.removeRepairOrderLine(gid, orderId, lineId), 403)
  await expectRefused(reader.api.cancelRepairOrder(gid, orderId), 403)

  // Step 2: Repair order → Edit adds, edits, removes and cancels.
  const advisor = await joinWith(owner, gid, await freshOwner('rep018writer'), 'Order Writer', [
    'PERMISSION_REPAIR_ORDER_READ',
    'PERMISSION_REPAIR_ORDER_WRITE',
  ])
  const added = await advisor.api.addRepairOrderLine(gid, orderId, {
    itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR',
    description: 'Extra',
    quantity: '1',
    unitPrice: '1',
  })
  await advisor.api.editRepairOrderLine(gid, orderId, lineId, { description: 'Edited' })
  await advisor.api.removeRepairOrderLine(gid, orderId, lineOf(added, 'Extra').id ?? '')
  expect((await advisor.api.cancelRepairOrder(gid, orderId)).status).toBe('REPAIR_ORDER_STATUS_CANCELLED')

  // Step 3: another garage's owner is refused at our address, and finds nothing at theirs.
  const outsider = await freshOwner('rep018other')
  const theirs = await outsider.api.createGarage({ name: 'QA Gara REP018 B' })
  await expectRefused(
    outsider.api.addRepairOrderLine(gid, orderId, {
      itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR',
      description: 'Nope',
      quantity: '1',
      unitPrice: '1',
    }),
    403,
  )
  await expectRefused(outsider.api.cancelRepairOrder(theirs.id ?? '', orderId), 404)
  expect(await owner.api.getRepairOrder(gid, orderId).then((o) => o.status)).toBe('REPAIR_ORDER_STATUS_CANCELLED')
})
