// E2E-INV-022 · Two drafts merge into one; uncounted lines are skipped on completion
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the drafts are made over the API. The screen cannot merge fewer than two
// drafts (the button stays disabled), so the validation error of step 2 and the
// second merge of step 5 (the absorbed draft has no checkbox) are asserted over the API.
import { expect, test } from '../../src/fixtures/index.js'
import { PIECE, countLine, expectRefused, onHand, stockedPart } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { StockCountPage, documentRow } from '../../src/pages/inventory/StockAdjustmentPages.js'

test('E2E-INV-022 two drafts merge into one; uncounted lines are skipped on completion', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv022', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV022' })
  const gid = garage.id ?? ''
  const oil = await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  const filter = await stockedPart(owner.api, gid, { sku: 'FILTER-01', name: 'Air filter', quantity: '4', unitCost: 50, unit: PIECE })
  const plug = await stockedPart(owner.api, gid, { sku: 'PLUG-M12', name: 'Spark plug M12', quantity: '3', unitCost: 200, unit: PIECE })

  // Step 1: two people count different shelves; the oil is on both, the plug on D was not counted.
  const shelfC = await owner.api.createCountedStockCount(gid, 'Shelf C', { [oil.id ?? '']: '4', [filter.id ?? '']: '4' })
  let shelfD = await owner.api.createStockCount(gid, { name: 'Shelf D' })
  shelfD = await owner.api.addStockCountLines(gid, shelfD.id ?? '', [oil.id ?? '', plug.id ?? ''])
  shelfD = await owner.api.countStockLine(gid, shelfD.id ?? '', countLine(shelfD, 'OIL-5W30').id ?? '', '6')
  await signIn(owner.session, garage.id)

  // Step 2: merging needs two drafts: the button waits for the second tick (the API refuses one).
  const inventory = new InventoryPage(page)
  await inventory.gotoTab('counts')
  const merge = page.getByRole('button', { name: 'Merge selected' })
  await documentRow(page, shelfC.number ?? '')
    .getByRole('checkbox')
    .check()
  await expect(merge).toBeDisabled()
  await expectRefused(owner.api.mergeStockCounts(gid, [shelfC.id ?? '']), 422)

  // Step 3: C is kept: the oil adds up (4 + 6), the filter stays, the uncounted plug comes along.
  await documentRow(page, shelfD.number ?? '')
    .getByRole('checkbox')
    .check()
  await merge.click()
  await expect(page.getByText('Counts merged.')).toBeVisible()
  const count = new StockCountPage(page)
  await expect(page).toHaveURL(new RegExp(`/inventory/stock-counts/${shelfC.id}$`))
  await expect(count.lineRow('OIL-5W30')).toContainText('10 L')
  await expect(count.lineRow('OIL-5W30')).toContainText('Matches')
  await expect(count.lineRow('FILTER-01')).toContainText('Matches')
  await expect(count.lineRow('PLUG-M12')).toContainText('Not counted')

  // Step 4: D is cancelled, has no lines, and points to the count it went into.
  await count.goto(shelfD.id ?? '')
  await expect(count.status).toHaveText('Cancelled')
  await expect(page.getByText('This count was cancelled; no stock changed.')).toBeVisible()
  await expect(page.getByText('Add the parts to count.')).toBeVisible()
  expect((await owner.api.getStockCount(gid, shelfD.id ?? '')).notes).toContain(`Merged into ${shelfC.number}`)

  // Step 5: a cancelled count cannot be merged again.
  await expectRefused(owner.api.mergeStockCounts(gid, [shelfC.id ?? '', shelfD.id ?? '']), 409, 'STOCK_COUNT_NOT_DRAFT')

  // Step 6: completion is refused while the plug is uncounted (the API), and the screen offers to skip it.
  await expectRefused(owner.api.completeStockCount(gid, shelfC.id ?? ''), 409, 'STOCK_COUNT_HAS_UNCOUNTED_LINES')
  await count.goto(shelfC.id ?? '')
  await count.completeButton.click()
  await expect(page.getByRole('dialog')).toContainText(
    '1 lines have not been counted. Leave them out and post the differences of the rest?',
  )
  await page.getByRole('dialog').getByRole('button', { name: 'Skip uncounted and complete' }).click()
  await expect(count.status).toHaveText('Completed')
  await expect(count.lineRow('OIL-5W30')).toContainText('Matches')
  await expect(count.lineRow('FILTER-01')).toContainText('Matches')
  await expect(count.lineRow('PLUG-M12')).toHaveCount(0)
  expect(await onHand(owner.api, gid, oil)).toBe('10')
  expect(await onHand(owner.api, gid, filter)).toBe('4')
  expect(await onHand(owner.api, gid, plug)).toBe('3')
})
