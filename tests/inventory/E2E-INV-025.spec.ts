// E2E-INV-025 · A write-off reduces stock at average cost; refused beyond on hand; cancelling puts the parts back
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Partial: the part and its stock are set up over the API, and the owner acts as MANAGER_A1.
// A cancelled write-off offers no second cancel on screen, so the refusal of step 7 is asserted over the API.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused, stockedPart } from '../../src/fixtures/inventory.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { WriteOffPage, documentRow } from '../../src/pages/inventory/StockAdjustmentPages.js'

test('E2E-INV-025 a write-off reduces stock at average cost; cancelling puts the parts back', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv025', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV025' })
  const gid = garage.id ?? ''
  await stockedPart(owner.api, gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', quantity: '10', unitCost: 100 })
  await signIn(owner.session, garage.id)

  // Step 1: write off 3 L as damaged, with a note.
  const inventory = new InventoryPage(page)
  await inventory.gotoTab('writeoffs')
  await page.getByRole('link', { name: 'New write-off' }).click()
  const writeOff = new WriteOffPage(page)
  await writeOff.reason.selectOption({ label: 'Damaged' })
  await writeOff.notes.fill('dropped in transit')
  await writeOff.addLine('OIL-5W30', '3')
  const writeOffId = await writeOff.post()
  await expect(page.getByText('Write-off posted. Stock is updated.')).toBeVisible()
  const title = page.getByRole('heading', { level: 1 })
  await expect(title).toHaveText(/^XH-\d{6}-/)
  const number = (await title.innerText()).trim()
  await expect(page.getByText('Completed', { exact: true })).toBeVisible()

  // Step 2: the line is valued at the average cost of the moment: 3 x 100 = 300.
  await expect(writeOff.lineRow(0)).toContainText('OIL-5W30')
  await expect(writeOff.lineRow(0)).toContainText('3 L')
  await expect(writeOff.lineRow(0)).toContainText('₫100')
  await expect(writeOff.lineRow(0)).toContainText('₫300')

  // Step 3: 7 L are left.
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('7 L')

  // Step 4: 70 L cannot be written off: the screen shows the refusal and nothing changes.
  await writeOff.gotoNew()
  await writeOff.reason.selectOption({ label: 'Expired' })
  await writeOff.addLine('OIL-5W30', '70')
  await writeOff.postButton.click()
  await expect(page.getByText('There is not enough stock for this.')).toBeVisible()
  await expect(page).toHaveURL(/\/inventory\/write-offs\/new$/)

  // Step 5: the stock card has the write-off: Out 3, its number, the reason, and 7 on hand after it.
  await inventory.goto()
  const card = await inventory.openStockCard('OIL-5W30')
  const movement = card.locator('tbody tr', { hasText: 'Write-off' })
  await expect(movement).toHaveCount(1)
  await expect(movement).toContainText('Out')
  await expect(movement).toContainText('−3')
  await expect(movement).toContainText(number)
  await expect(movement).toContainText('damaged')
  await expect(movement).toContainText('7 L')

  // Step 6: cancelling puts the parts back; the app returns to the list with the write-off Cancelled.
  await page.goto(`/inventory/write-offs/${writeOffId}`)
  await writeOff.cancel()
  await expect(page.getByText('Write-off cancelled.')).toBeVisible()
  await expect(inventory.writeOffsTab).toHaveAttribute('aria-selected', 'true')
  await expect(documentRow(page, number)).toContainText('Cancelled')

  // Step 7: 10 L again at the same average cost; a second cancel is not offered, and the API refuses it.
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫100')
  await page.goto(`/inventory/write-offs/${writeOffId}`)
  await expect(writeOff.cancelledNotice).toBeVisible()
  await expect(writeOff.cancelButton).toBeHidden()
  await expectRefused(owner.api.cancelWriteOff(gid, writeOffId), 409, 'WRITE_OFF_ALREADY_CANCELLED')
})
