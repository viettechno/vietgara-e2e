// E2E-INV-020 · Count a shelf: matched, over and short lines; completion makes stock equal the count
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the parts are set up over the API and the owner acts as MANAGER_A1; the
// refusal of an uncounted count (step 3) is asserted over the API, because the screen
// offers the skip instead of sending a count it knows is refused.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { NewStockCountDialog, StockCountPage } from '../../src/pages/inventory/StockAdjustmentPages.js'

test('E2E-INV-020 a stock count makes stock equal the count and values the difference', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv020', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV020' })
  const gid = garage.id ?? ''
  await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '20', unitCost: 50, unit: PIECE })
  await stockedPart(owner.api, gid, { sku: 'PLUG-M12', name: 'Spark plug M12', quantity: '5', unitCost: 200, unit: PIECE })
  await signIn(owner.session, garage.id)

  // Step 1: a draft count with a number from the stock count template.
  const inventory = new InventoryPage(page)
  await inventory.gotoTab('counts')
  await page.getByRole('button', { name: 'New stock count' }).click()
  const countId = await new NewStockCountDialog(page).create({ name: 'Shelf A', notes: 'monthly' })
  const count = new StockCountPage(page)
  const number = await count.number()
  expect(number).toMatch(/^KK-\d{6}-0001$/)
  await expect(count.status).toHaveText('Draft')

  // Step 2: the three parts, each with its system quantity and no count yet.
  for (const sku of ['OIL-5W30', 'FILTER-01', 'PLUG-M12']) await count.addPartBySku(sku)
  await expect(count.lineRow('OIL-5W30')).toContainText('10 L')
  await expect(count.lineRow('FILTER-01')).toContainText('20 pc')
  await expect(count.lineRow('PLUG-M12')).toContainText('5 pc')
  for (const sku of ['OIL-5W30', 'FILTER-01', 'PLUG-M12']) await expect(count.lineRow(sku)).toContainText('Not counted')

  // Step 3: nothing is counted yet. The screen offers to skip the lines instead of sending the
  // completion; the refusal itself is the API's, and nothing changes.
  await count.completeButton.click()
  await expect(page.getByRole('dialog')).toContainText('3 lines have not been counted.')
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
  await expectRefused(owner.api.completeStockCount(gid, countId), 409, 'STOCK_COUNT_HAS_UNCOUNTED_LINES')
  expect(await onHand(owner.api, gid, filter)).toBe('20')

  // Steps 4-5: the counts, each saved when typed; matched, short, over, and the value of the difference.
  await count.count('OIL-5W30', '10')
  await count.count('FILTER-01', '18')
  await count.count('PLUG-M12', '7')
  await expect(count.lineRow('OIL-5W30')).toContainText('Matches')
  await expect(count.lineRow('FILTER-01')).toContainText('Short')
  await expect(count.lineRow('FILTER-01')).toContainText('-2')
  await expect(count.lineRow('FILTER-01')).toContainText('-₫100')
  await expect(count.lineRow('PLUG-M12')).toContainText('Over')
  await expect(count.lineRow('PLUG-M12')).toContainText('+2')
  await expect(count.lineRow('PLUG-M12')).toContainText('+₫400')
  await expect(count.summary).toContainText('Not counted: 0')
  await expect(count.summary).toContainText('Matched: 1')
  await expect(count.summary).toContainText('Over: 1')
  await expect(count.summary).toContainText('Short: 1')
  await expect(page.getByText('Difference value:')).toContainText('+₫300')

  // Step 6: the review workbook downloads under the count's number.
  const download = page.waitForEvent('download')
  await count.downloadExcelButton.click()
  expect((await download).suggestedFilename()).toBe(`${number}.xlsx`)

  // Step 7: completing makes stock equal the count; the average cost of the plug stays 200.
  await count.complete()
  await expect(page.getByText('Count completed. Stock is updated.')).toBeVisible()
  await expect(count.status).toHaveText('Completed')
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('FILTER-01')).toContainText('18 pc')
  await expect(inventory.partRow('PLUG-M12')).toContainText('7 pc')
  await expect(inventory.partRow('PLUG-M12')).toContainText('₫200')

  // Step 8: the plug's stock card has the adjustment: In 2, the count's number, 7 on hand after it, and the user.
  const card = await inventory.openStockCard('PLUG-M12')
  const adjustment = card.locator('tbody tr', { hasText: 'Stock count' })
  await expect(adjustment).toHaveCount(1)
  await expect(adjustment).toContainText('In')
  await expect(adjustment).toContainText('+2')
  await expect(adjustment).toContainText(number)
  await expect(adjustment).toContainText('7 pc')
  await expect(adjustment).toContainText('₫200')
  await expect(adjustment).toContainText(owner.fullName)

  // Step 9: a completed count cannot be edited: the screen has no counted fields, and the API refuses.
  await count.goto(countId)
  await expect(count.status).toHaveText('Completed')
  await expect(count.countedInput('OIL-5W30')).toHaveCount(0)
  const oilLine = (await owner.api.getStockCount(gid, countId)).lines?.find((line) => line.partSku === 'OIL-5W30')
  await expectRefused(owner.api.countStockLine(gid, countId, oilLine?.id ?? '', '1'), 409, 'STOCK_COUNT_NOT_DRAFT')
})
