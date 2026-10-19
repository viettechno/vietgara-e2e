// E2E-INV-031 · Scan into a goods receipt: a line, one more of the same, cases for a case code; unknown and inactive codes are told
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// A USB scanner types the code and Enter into the field, which is what the spec does. The parts and
// their barcodes are set up over the API; the phone camera is not covered here (manual).
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, createSuppliers } from '../../src/fixtures/inventory.js'
import { GoodsReceiptPage } from '../../src/pages/inventory/GoodsReceiptPage.js'

test('E2E-INV-031 scanning adds a line, one more of it, cases for a case code, and tells unknown and inactive codes', async ({
  page,
  signIn,
  freshOwner,
}) => {
  const owner = await freshOwner('inv031', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV031' })
  const gid = garage.id ?? ''
  await createSuppliers(owner.api, gid)

  const can = { name: 'Can', abbreviation: 'can' }
  const beer = await owner.api.createSimplePart(gid, { sku: 'BEER-330', name: 'Beer 330 ml', unit: can })
  const carton = await owner.api.createUnit(gid, 'Carton', 'ctn')
  await owner.api.setPartUnits(gid, beer.id ?? '', [{ unitId: carton.id ?? '', factor: '24' }])
  await owner.api.setPartBarcodes(gid, beer.id ?? '', [{ barcode: '8930001' }, { barcode: '8930024', unitId: carton.id }])
  const old = await owner.api.createSimplePart(gid, { sku: 'OLD-1', name: 'Old part', unit: can })
  await owner.api.setPartBarcodes(gid, old.id ?? '', [{ barcode: '8930099' }])
  // A part that stock refers to is deactivated, not deleted.
  await owner.api.receiveStock(gid, old.id ?? '', { quantity: '1', unitCost: 1 })
  await owner.api.deletePart(gid, old.id ?? '')
  await signIn(owner.session, garage.id)

  const receipt = new GoodsReceiptPage(page)
  await receipt.gotoNew()
  await receipt.chooseDefaultSupplier(SUPPLIER_1)
  const scan = page.getByRole('textbox', { name: 'Scan a barcode' })

  // Step 2: the same code twice is one line with quantity 2, and the field is empty again.
  await scan.fill('8930001')
  await scan.press('Enter')
  await expect(receipt.lineRow(0)).toContainText('BEER-330')
  await expect(scan).toHaveValue('')
  await scan.fill('8930001')
  await scan.press('Enter')
  await expect(page.getByRole('spinbutton', { name: 'Quantity 1' })).toHaveValue('2')

  // Step 3: the case code is a second line, in cartons.
  await scan.fill('8930024')
  await scan.press('Enter')
  await expect(page.locator('table tbody tr')).toHaveCount(2)
  await expect(page.getByRole('spinbutton', { name: 'Quantity 2' })).toHaveValue('1')
  await expect(receipt.lineRow(1)).toContainText('ctn')

  // Step 4: an unknown code and an inactive part are told, and add nothing.
  await scan.fill('0000000')
  await scan.press('Enter')
  await expect(page.getByText('No part has the code 0000000.')).toBeVisible()
  await scan.fill('8930099')
  await scan.press('Enter')
  await expect(page.getByText('Part OLD-1 is inactive.')).toBeVisible()
  await expect(page.locator('table tbody tr')).toHaveCount(2)

  // Step 5: one more carton, save, and read the quantities back over the API.
  await scan.fill('8930024')
  await scan.press('Enter')
  await expect(page.getByRole('spinbutton', { name: 'Quantity 2' })).toHaveValue('2')
  await receipt.saveDraftButton.click()
  const saved = await owner.api.getGoodsReceipt(gid, await receipt.savedId())
  const lines = saved.lines ?? []
  expect(lines.map((line) => line.enteredQuantity).sort()).toEqual(['2', '2'])
  expect(lines.find((line) => line.unitId === carton.id)?.quantity).toBe('48')
})
