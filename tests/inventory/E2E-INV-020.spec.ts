// E2E-INV-020 · A stock count makes stock equal the count and values the difference
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
import { expect, test } from '../../src/fixtures/index.js'
import { countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-020 a stock count makes stock equal the count and values the difference', async ({ freshOwner }) => {
  const owner = await freshOwner('inv020', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV020' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '20', unitCost: 50 })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-01', name: 'Spark plug', quantity: '5', unitCost: 200 })

  // Steps 1-3: a draft with a line per part, none counted yet.
  let count = await owner.api.createStockCount(gid, { name: 'Shelf A' })
  expect(count.status).toBe('STOCK_COUNT_STATUS_DRAFT')
  expect(count.number).toBeTruthy()
  count = await owner.api.addStockCountLines(gid, count.id ?? '', [oil.id ?? '', filter.id ?? '', plug.id ?? ''])
  expect(count.lines).toHaveLength(3)
  expect(count.uncountedLines).toBe(3)
  expect(countLine(count, 'OIL-5W30').systemQuantity).toBe('10')
  expect(countLine(count, 'OIL-5W30').result).toBe('STOCK_COUNT_LINE_RESULT_UNCOUNTED')

  // Step 4: type the counted quantities: one matched, one short, one over.
  const counted = { 'OIL-5W30': '10', 'FILTER-01': '18', 'PLUG-01': '7' }
  for (const [sku, quantity] of Object.entries(counted)) {
    count = await owner.api.countStockLine(gid, count.id ?? '', countLine(count, sku).id ?? '', quantity)
  }

  // Step 5: matched, short and over lines, valued at average cost; a draft changes no stock.
  expect(count.matchedLines).toBe(1)
  expect(count.shortLines).toBe(1)
  expect(count.overLines).toBe(1)
  expect(count.uncountedLines).toBe(0)
  expect(countLine(count, 'OIL-5W30').result).toBe('STOCK_COUNT_LINE_RESULT_MATCHED')
  expect(countLine(count, 'FILTER-01')).toMatchObject({
    result: 'STOCK_COUNT_LINE_RESULT_SHORT',
    differenceQuantity: '-2',
    differenceValue: '-100',
  })
  expect(countLine(count, 'PLUG-01')).toMatchObject({
    result: 'STOCK_COUNT_LINE_RESULT_OVER',
    differenceQuantity: '2',
    differenceValue: '400',
  })
  expect(count.totalDifferenceValue).toBe('300')
  expect(await onHand(owner.api, gid, filter)).toBe('20')

  // Step 6: completing posts the adjustments.
  count = await owner.api.completeStockCount(gid, count.id ?? '')
  expect(count.status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(count.totalDifferenceValue).toBe('300')

  // Step 7: stock equals the count, the average cost is untouched, and the count is frozen.
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('18')
  expect(await onHand(owner.api, gid, plug)).toBe('7')
  expect((await owner.api.getStockLevel(gid, plug.id ?? '')).averageCost).toBe('200')
  await expectRefused(
    owner.api.countStockLine(gid, count.id ?? '', countLine(count, 'OIL-5W30').id ?? '', '1'),
    409,
    'STOCK_COUNT_NOT_DRAFT',
  )

  // Step 8: the adjustment is in the part's stock card, with the document and the user.
  const card = await owner.api.stockCard(gid, plug.id ?? '', 'STOCK_TRANSACTION_REF_TYPE_STOCK_COUNT')
  expect(card).toHaveLength(1)
  expect(card[0]).toMatchObject({
    type: 'STOCK_TRANSACTION_TYPE_IN',
    quantity: '2',
    quantityAfter: '7',
    unitCost: '200',
    refNumber: count.number,
  })
  expect(card[0]?.createdByName).toBeTruthy()
})
