// E2E-INV-033 · Import parts: a 500-row file with 5 bad rows lists all 5 and saves nothing; after fixing, parts, units, barcodes and opening stock appear
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// The screen is what this spec is about: the preview lists every problem at once with its row and
// column, offers no confirmation, and nothing is saved until the fixed file is confirmed. The API rules
// (every error code, the opening-stock receipt) are in the backend's blackbox TestImportPartsAllOrNothing.
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, createSuppliers } from '../../src/fixtures/inventory.js'
import { PARTS_COLUMNS, partsRows, workbook, type WorkbookRow } from '../../src/fixtures/workbook.js'
import { ImportPage } from '../../src/pages/inventory/ImportPage.js'

test('E2E-INV-033 a parts file with problems saves nothing; the fixed file imports', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv033', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV033' })
  const gid = garage.id ?? ''
  await createSuppliers(owner.api, gid)
  await signIn(owner.session, garage.id)

  const good = partsRows(500, SUPPLIER_1)
  const bad = good.map((row) => ({ ...row }))
  const at = (index: number): WorkbookRow => bad[index] as WorkbookRow
  at(3).Name = '' // row 5
  at(20).SKU = at(19).SKU ?? '' // row 22
  at(40).Supplier = 'Nobody' // row 42
  at(60).Barcodes = 'bad_code' // row 62
  at(81)['Opening quantity'] = 'many' // row 83

  const imports = new ImportPage(page)
  await imports.goto()

  // Step 2: every problem at once, and no way to confirm.
  await imports.choose('parts-bad.xlsx', await workbook(PARTS_COLUMNS, bad))
  await expect(imports.problems).toBeVisible()
  expect(await imports.listedProblems()).toEqual(['5:Name', '22:SKU', '42:Supplier', '62:Barcodes', '83:Opening quantity'])
  await expect(imports.problems).toContainText('A value is required.')
  await expect(imports.problems).toContainText('This SKU appears more than once in the file.')
  await expect(imports.problems).toContainText('This supplier does not exist.')
  await expect(imports.problems).toContainText('This barcode is not valid')
  await expect(imports.problems).toContainText('The quantity is not valid.')
  await expect(imports.summary).toContainText('500 rows')
  await expect(imports.summary).toContainText('495 without problems')
  await expect(imports.summary).toContainText('5 problems')
  await expect(page.getByRole('button', { name: /^Import \d+ rows$/ })).toHaveCount(0)

  // Step 4: nothing was created, not even the units of the good rows.
  expect((await owner.api.listParts(gid)).length).toBe(0)

  // Steps 5-6: the fixed file previews clean and imports.
  await imports.choose('parts.xlsx', await workbook(PARTS_COLUMNS, good))
  await expect(imports.problems).toHaveCount(0)
  await expect(imports.summary).toContainText('0 problems')
  await expect(imports.summary).toContainText('500 parts')
  await expect(imports.summary).toContainText('550 barcodes')
  await expect(imports.summary).toContainText('428 lines of opening stock')
  await imports.confirmButton(500).click()
  await expect(imports.doneMessage).toHaveText('500 rows imported.')

  // Step 7: the receipt of the opening stock, and the stock itself.
  await page.getByRole('link', { name: /^Open goods receipt / }).click()
  await expect(page.getByText('Completed', { exact: true })).toBeVisible()
  const [stocked] = await owner.api.listParts(gid, { query: 'P-0003' })
  expect((await owner.api.getStockLevel(gid, stocked?.id ?? '')).quantityOnHand).toBe('4')
  const [withCase] = await owner.api.listParts(gid, { query: 'P-0010' })
  expect(withCase?.packagingUnits?.length).toBe(1)
  expect(withCase?.barcodes?.length).toBe(2)
})
