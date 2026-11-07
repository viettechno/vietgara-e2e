// E2E-PO-008 · The purchase order screens
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/16_Purchase_Orders.md
//
// A part below its reorder threshold with a default supplier is ordered from the
// low-stock list; the draft is edited, sent by e-mail (the supplier's mail lands
// in Mailpit) and received into a goods receipt that starts from the order.
import { env, expect, test } from '../../src/fixtures/index.js'

test('E2E-PO-008 purchase orders: from low stock to a received order', async ({ page, signIn, freshOwner, mailpit }) => {
  test.setTimeout(120_000)
  const owner = await freshOwner('po008')
  const garage = await owner.api.createGarage({ name: 'QA Gara PO008' })
  const gid = garage.id ?? ''
  const email = `sales.po008@${env.testEmailDomain}`
  const supplier = await owner.api.createSupplier(gid, { name: 'QA Supplier PO008', contact: { email } })
  const part = await owner.api.createSimplePart(gid, { sku: 'OIL-PO008', name: 'Oil PO008', reorderThreshold: '10' })
  await owner.api.putPartSuppliers(gid, part.id ?? '', [{ supplierId: supplier.id ?? '', isDefault: true }])
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '4', unitCost: 100_000, supplierId: supplier.id })
  await signIn(owner.session, garage.id)

  await page.goto('/inventory?tab=orders')
  await page.getByRole('button', { name: 'Create from low stock' }).click()
  const picker = page.getByRole('dialog')
  await expect(picker.getByRole('checkbox', { name: /OIL-PO008/ })).toBeChecked()
  await picker.getByRole('button', { name: 'Create orders for 1 part' }).click()
  // The result lists the draft it created; twice the threshold (20) less the 4 in stock is 16.
  const created = picker.getByRole('link', { name: /^DH-\d{4}-\d{5}$/ })
  await expect(created).toBeVisible()
  const number = (await created.innerText()).trim()
  await created.click()

  await expect(page.getByRole('heading', { name: number })).toBeVisible()
  await expect(page.getByText('Draft', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('spinbutton', { name: 'Quantity 1' })).toHaveValue('16')
  await page.getByRole('spinbutton', { name: 'Quantity 1' }).fill('20')
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
  await page.getByLabel('Expected date').fill(tomorrow)
  await page.getByRole('button', { name: 'Save draft' }).click()
  // The editor reloads what the server kept: wait for it before sending.
  await expect(page.getByText('Changes saved.')).toBeVisible()
  await expect(page.getByRole('spinbutton', { name: 'Quantity 1' })).toHaveValue('20')

  await page.getByRole('button', { name: 'Send order' }).click()
  const send = page.getByRole('dialog')
  await send.getByRole('textbox').fill('Please deliver on Monday')
  await send.getByRole('button', { name: 'Send order' }).click()
  await expect(page.getByText(`Order sent to ${email}.`)).toBeVisible()
  await expect(page.getByText('Sent', { exact: true }).first()).toBeVisible()
  // The supplier's mail, with the number of the order in its subject, lands in the inbox.
  const mail = await mailpit.waitForMessage(email, { subjectContains: number })
  expect(mail.Text).toContain(number)

  // Receive: the goods receipt opens pre-filled from what is outstanding.
  await page.getByRole('button', { name: 'Receive goods' }).click()
  await expect(page).toHaveURL(/\/inventory\/receipts\/(?!new)[^/]+$/)
  await expect(page.getByRole('spinbutton', { name: 'Quantity 1' })).toHaveValue('20')
  await page.getByRole('button', { name: 'Complete receipt' }).click()
  await expect(page.getByText('Completed', { exact: true }).first()).toBeVisible()

  await page.goto('/inventory?tab=orders')
  await page.getByRole('link', { name: number }).click()
  await expect(page.getByText('Received', { exact: true }).first()).toBeVisible()
})
