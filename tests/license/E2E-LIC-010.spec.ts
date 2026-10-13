// E2E-LIC-010 · Period ends: the owner's garages become read-only
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
//
// The period end is moved with SQL helper H1 (src/fixtures/timeshift.ts) and
// the stack's expiry job (every 5 s in ci/compose.yml) does the rest.
// Reading stays allowed; every change is refused. The garage profile is
// exempt from the license check by design, so it is not asserted here.
import { expect, test } from '../../src/fixtures/index.js'
import { expirySetup, waitForStatus } from '../../src/fixtures/expiry-setup.js'
import { endPeriod, timeshiftAvailable } from '../../src/fixtures/timeshift.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-010 period ends: the garages become read-only', async ({ page, api, mailpit, signIn }) => {
  test.skip(!timeshiftAvailable(), 'needs DATABASE_URL to move the period end (SQL helper H1)')

  const { owner, garage } = await expirySetup(api, mailpit, 'lic010')
  await endPeriod(owner.email)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_PAST_DUE')

  await signIn(owner.session, garage.id)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()
  await expect(page.getByText('Past due (read-only)').first()).toBeVisible()
  await expect(page.getByText('The subscription has expired: the garage is read-only')).toBeVisible()
  await expect(page.getByText(/Renew within \d+ days to avoid suspension/)).toBeVisible()

  const message = await mailpit.waitForMessage(owner.email, { subjectContains: 'read-only until' })
  expect(message.Text).toContain('read-only')

  const customers = new CustomersPage(page)
  await customers.goto()
  await expect(customers.row('QA Customer Em Vo')).toBeVisible() // reading is allowed

  await customers.createCustomer({ fullName: 'QA Customer Giang Do', phone: '0911000011' })
  await expect(page.getByText('The subscription is past due: read-only mode.').first()).toBeVisible()
  await expect(customers.row('QA Customer Giang Do')).toBeHidden()
})

test('E2E-LIC-010 staff see the data and the staff banner', async ({ page, api, mailpit, signIn }) => {
  test.skip(!timeshiftAvailable(), 'needs DATABASE_URL to move the period end (SQL helper H1)')

  const { owner, staff, garage } = await expirySetup(api, mailpit, 'lic010s')
  await endPeriod(owner.email)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_PAST_DUE')

  await signIn(staff.session, garage.id)
  const customers = new CustomersPage(page)
  await customers.goto()
  await expect(customers.row('QA Customer Em Vo')).toBeVisible()
  await expect(page.getByText('Ask the garage owner to renew the subscription.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Renew' })).toBeHidden()
})
