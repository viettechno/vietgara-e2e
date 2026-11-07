// E2E-DSR-010 · The request page and the customer's data requests
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/18_Data_Requests.md
//
// A person asks on the public page to see their data; the e-mailed link is
// opened and the confirmation says how many garages were reached. The staff
// record a view and a deletion on the customer's page (the deletion asks for a
// confirmation) and the list shows the requests.
import { env, expect, test } from '../../src/fixtures/index.js'

test('E2E-DSR-010 data requests: the public page and the customer page', async ({ page, signIn, freshOwner, mailpit }) => {
  test.setTimeout(120_000)
  const owner = await freshOwner('dsr010')
  const garage = await owner.api.createGarage({ name: 'QA Gara DSR010' })
  const gid = garage.id ?? ''
  // One address per run: a request reaches every garage that holds the address, so a fixed one would count the earlier runs' garages too.
  const email = `customer.dsr010.${Date.now()}@${env.testEmailDomain}`
  const customer = await owner.api.createCustomer(gid, {
    fullName: 'QA Customer DSR010',
    phone: '0911000101',
    email,
    personalDataConsent: true,
  })

  // The public page answers the same for any address; the link in the e-mail does the work.
  await page.goto('/data-request')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Type of request').selectOption({ label: 'See the data' })
  await page.getByRole('button', { name: 'Send request' }).click()
  await expect(page.getByText(/a confirmation e-mail has been sent/)).toBeVisible()
  const mail = await mailpit.waitForMessage(email, { timeoutMs: 30_000 })
  const link = mailpit.extractLink(mail)
  await page.goto(link)
  // Opening the link does nothing yet: the request is acted on when the button is pressed.
  await page.getByRole('button', { name: 'Confirm request' }).click()
  await expect(page.getByText(/Your request was carried out at 1 garage/)).toBeVisible()

  await signIn(owner.session, garage.id)
  await page.goto(`/customers/${customer.id}`)
  await expect(page.getByText('Personal-data requests')).toBeVisible()
  await expect(page.getByText('See the data')).toBeVisible()

  // A view in person shows the data held.
  await page.getByRole('button', { name: 'Record a request' }).click()
  const view = page.getByRole('dialog')
  await view.getByRole('button', { name: 'Record' }).click()
  await expect(page.getByRole('dialog').getByText('The data held')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('QA Customer DSR010')
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).last().click()

  // A deletion asks for a confirmation and warns that it cannot be undone.
  await page.getByRole('button', { name: 'Record a request' }).click()
  const del = page.getByRole('dialog')
  await del.getByLabel('Type of request').selectOption({ label: 'Delete the data' })
  await expect(del.getByText(/This cannot be undone/)).toBeVisible()
  await expect(del.getByRole('button', { name: 'Record' })).toBeDisabled()
  await del.getByRole('checkbox', { name: /I understand/ }).check()
  await del.getByRole('button', { name: 'Record' }).click()
  await expect(page.getByText('The customer was anonymized.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'QA Customer DSR010' })).toBeHidden()

  // The list shows each request with its type, status and source.
  await page.goto('/data-requests')
  await expect(page.locator('tbody tr')).toHaveCount(3)
  await expect(page.locator('tbody tr', { hasText: 'Public page' })).toContainText('See the data')
  await expect(page.locator('tbody tr', { hasText: 'At the garage' }).first()).toBeVisible()
})
