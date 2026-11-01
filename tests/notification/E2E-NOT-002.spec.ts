// E2E-NOT-002 · Switch a type off and change the sender name in the garage settings
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/12_Notifications.md
//
// The owner switches "Quote ready" off and names the sender in the garage
// settings; both survive a reload; sending a quote then shows up in the
// garage's e-mail log as "Not sent", with the reason. That a switched-off type
// sends nothing and the sender name reaches the mail is in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-NOT-002 switch a type off and change the sender name in the garage settings', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('not002')
  const gid = (await owner.api.createGarage({ name: 'QA Gara NOT002' })).id ?? ''
  const email = `signup.not002.customer.${Date.now()}@vietgara.test`
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An NOT002', phone: '0911000221', email })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-222.21' })
  const quote = await owner.api.createQuote(gid, {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change', quantity: '1', unitPrice: '250000' }],
  })
  await signIn(owner.session, gid)

  // Steps 1 to 3: switch the type off, name the sender, save.
  await page.goto(`/garages/${gid}/settings`)
  const quoteReady = page.getByRole('switch', { name: 'Quote ready' })
  await expect(quoteReady).toBeChecked()
  // Wait for each save to land (a reload would cancel one still running).
  const saved = () =>
    page.waitForResponse((r) => ['PUT', 'PATCH'].includes(r.request().method()) && r.url().includes(`/garages/${gid}`) && r.ok())
  const switchSaved = saved()
  await quoteReady.click()
  await switchSaved
  await page.getByLabel('Sender name').fill('Gara An Phat')
  const nameSaved = saved()
  await page.getByLabel('Sender name').locator('xpath=ancestor::form').getByRole('button', { name: 'Save' }).click()
  await nameSaved

  // Both stay after a reload.
  await page.reload()
  await expect(page.getByRole('switch', { name: 'Quote ready' })).not.toBeChecked()
  await expect(page.getByLabel('Sender name')).toHaveValue('Gara An Phat')
  await expect(page.getByRole('switch', { name: 'Vehicle ready' })).toBeChecked()

  // Step 4: sending the quote now sends no e-mail, and the log says why.
  await owner.api.sendQuote(gid, quote.id ?? '')
  // The log is written from an event, so give it a moment.
  const row = page.locator('tbody tr', { hasText: email })
  await expect(async () => {
    await page.reload()
    await expect(row).toBeVisible({ timeout: 2_000 })
  }).toPass({ timeout: 20_000 })
  await expect(row).toContainText('Quote ready')
  await expect(row).toContainText('Not sent')
  await expect(row).toContainText('You switched this e-mail off.')
})
