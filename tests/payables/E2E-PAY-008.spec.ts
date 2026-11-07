// E2E-PAY-008 · The payables screen and the payment-out voucher form
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/15_Payables_Vouchers.md
//
// Two goods receipts of one supplier make two payables (an event, so the setup
// waits for them over the API). The form applies a payment to the oldest first,
// shows what is left unallocated, and the voucher is numbered; voiding it asks
// for a reason and reopens the payables.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-PAY-008 pay a supplier: payables, voucher and void', async ({ page, signIn, freshOwner }) => {
  test.setTimeout(120_000)
  const owner = await freshOwner('pay008')
  const garage = await owner.api.createGarage({ name: 'QA Gara PAY008' })
  const gid = garage.id ?? ''
  const supplier = await owner.api.createSupplier(gid, { name: 'QA Supplier PAY008' })
  const part = await owner.api.createSimplePart(gid, { sku: 'OIL-PAY008', name: 'Oil PAY008' })
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 100_000, supplierId: supplier.id })
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '5', unitCost: 100_000, supplierId: supplier.id })
  await expect.poll(async () => (await owner.api.listSupplierPayables(gid)).data?.length ?? 0, { timeout: 60_000 }).toBe(2)
  await signIn(owner.session, garage.id)

  await page.goto('/payables')
  // The aging table sums them (1,500,000); each receipt has its own row.
  await expect(page.locator('tbody tr', { hasText: /PN-\d+-0001/ })).toContainText('1,000,000')
  await expect(page.locator('tbody tr', { hasText: /PN-\d+-0002/ })).toContainText('500,000')

  await page.getByRole('button', { name: 'New payment voucher' }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByPlaceholder('Choose a supplier').click()
  await dialog.getByText('QA Supplier PAY008').click()
  await dialog.getByLabel('Amount', { exact: true }).fill('1200000')
  await dialog.getByRole('button', { name: 'Apply to the oldest first' }).click()
  // The payments of 1,200,000 fill the older 1,000,000 receipt, then 200,000 of the other.
  await expect(dialog.getByText('Unallocated')).toContainText('0')
  // An allocation above the voucher is refused beside the field.
  const inputs = dialog.locator('input[type="number"]')
  await inputs.nth(1).fill('2000000')
  await expect(dialog.getByText('The amounts applied exceed the voucher amount.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Apply to the oldest first' }).click()
  await dialog.getByRole('button', { name: 'New payment voucher' }).click()
  await expect(page.getByText(/Payment voucher PC-\d{4}-\d{5} issued\./)).toBeVisible()

  await page.getByRole('tab', { name: 'Payment vouchers' }).click()
  const voucher = page.locator('tbody tr', { hasText: /PC-\d{4}-\d{5}/ })
  await expect(voucher).toContainText('1,200,000')
  const number = (await voucher.locator('td').first().innerText()).trim().split(/\s/)[0]
  expect(number).toMatch(/^PC-\d{4}-\d{5}$/)

  // Voiding asks for a reason; the payables reopen.
  await page.getByRole('button', { name: `Void voucher: ${number}` }).click()
  const voidDialog = page.getByRole('dialog')
  await expect(voidDialog.getByRole('button', { name: /^Void/ })).toBeDisabled()
  await voidDialog.getByRole('textbox').fill('Paid the wrong supplier')
  await voidDialog.getByRole('button', { name: /^Void/ }).click()
  await expect(page.getByText('Payment voucher voided.')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Include voided' }).check()
  await expect(page.locator('tbody tr', { hasText: number })).toContainText('Voided')
  await expect.poll(async () => (await owner.api.listSupplierPayables(gid)).data?.every((p) => p.paidAmount === '0')).toBe(true)
})
