// E2E-INV-020 · Count a shelf: matched, over and short lines; completion makes stock equal the count
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: driven over the API (the owner acts as MANAGER_A1); the owner-web screens are not covered yet.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'

test('E2E-INV-020 a stock count makes stock equal the count and values the difference', async ({ freshOwner }) => {
  const owner = await freshOwner('inv020', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV020' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '20', unitCost: 50, unit: PIECE })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-M12', name: 'Spark plug M12', quantity: '5', unitCost: 200, unit: PIECE })

  // Step 1: a draft with a number from the stock count template.
  let count = await owner.api.createStockCount(gid, { name: 'Shelf A', notes: 'monthly' })
  expect(count.status).toBe('STOCK_COUNT_STATUS_DRAFT')
  expect(count.number).toMatch(/^KK-\d{6}-0001$/)

  // Step 2: the system quantities are captured; every line is uncounted.
  count = await owner.api.addStockCountLines(gid, count.id ?? '', [oil.id ?? '', filter.id ?? '', plug.id ?? ''])
  expect(count.lines).toHaveLength(3)
  expect(count.uncountedLines).toBe(3)
  expect(countLine(count, 'OIL-5W30')).toMatchObject({ systemQuantity: '10', result: 'STOCK_COUNT_LINE_RESULT_UNCOUNTED' })
  expect(countLine(count, 'FILTER-01').systemQuantity).toBe('20')
  expect(countLine(count, 'PLUG-M12').systemQuantity).toBe('5')

  // Step 3: completing before typing a quantity is refused and changes nothing.
  await expectRefused(owner.api.completeStockCount(gid, count.id ?? ''), 409, 'STOCK_COUNT_HAS_UNCOUNTED_LINES')
  expect((await owner.api.getStockCount(gid, count.id ?? '')).status).toBe('STOCK_COUNT_STATUS_DRAFT')
  expect(await onHand(owner.api, gid, filter)).toBe('20')

  // Steps 4-5: matched, short and over, valued at average cost.
  for (const [sku, quantity] of Object.entries({ 'OIL-5W30': '10', 'FILTER-01': '18', 'PLUG-M12': '7' })) {
    count = await owner.api.countStockLine(gid, count.id ?? '', countLine(count, sku).id ?? '', quantity)
  }
  expect(countLine(count, 'OIL-5W30').result).toBe('STOCK_COUNT_LINE_RESULT_MATCHED')
  expect(countLine(count, 'FILTER-01')).toMatchObject({
    result: 'STOCK_COUNT_LINE_RESULT_SHORT',
    differenceQuantity: '-2',
    differenceValue: '-100',
  })
  expect(countLine(count, 'PLUG-M12')).toMatchObject({
    result: 'STOCK_COUNT_LINE_RESULT_OVER',
    differenceQuantity: '2',
    differenceValue: '400',
  })
  expect([count.matchedLines, count.overLines, count.shortLines, count.uncountedLines]).toEqual([1, 1, 1, 0])
  expect(count.totalDifferenceValue).toBe('300')
  expect(await onHand(owner.api, gid, filter)).toBe('20')

  // Step 6: the review workbook is an xlsx file.
  const workbook = await owner.api.downloadStockCountExcel(gid, count.id ?? '')
  expect(workbook.contentType).toContain('spreadsheetml')
  expect(workbook.bytes.subarray(0, 2).toString()).toBe('PK')

  // Step 7: completing makes stock equal the count; an adjustment leaves the average cost alone.
  count = await owner.api.completeStockCount(gid, count.id ?? '')
  expect(count.status).toBe('STOCK_COUNT_STATUS_COMPLETED')
  expect(count.totalDifferenceValue).toBe('300')
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('18')
  expect(await onHand(owner.api, gid, plug)).toBe('7')
  expect((await owner.api.getStockLevel(gid, plug.id ?? '')).averageCost).toBe('200')

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

  // Step 9: a completed count cannot be edited.
  await expectRefused(
    owner.api.countStockLine(gid, count.id ?? '', countLine(count, 'OIL-5W30').id ?? '', '1'),
    409,
    'STOCK_COUNT_NOT_DRAFT',
  )
})
