// E2E-LIC-011 · Grace period ends: garages are suspended; admin extension restores them
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
//
// Past due (helper H1), then the grace end (helper H2): the garage is
// locked for the owner and staff and a second e-mail arrives. The platform
// admin's extension brings the data back.
import { expect, test } from '../../src/fixtures/index.js'
import { expirySetup, waitForStatus } from '../../src/fixtures/expiry-setup.js'
import { endGrace, endPeriod, timeshiftAvailable } from '../../src/fixtures/timeshift.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'

test('E2E-LIC-011 grace period ends: suspended; an admin extension restores', async ({ page, api, mailpit, signIn, adminApi }) => {
  test.skip(!timeshiftAvailable(), 'needs DATABASE_URL to move the period and grace ends (SQL helpers H1, H2)')

  const { owner, staff, garage } = await expirySetup(api, mailpit, 'lic011')
  await endPeriod(owner.email)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_PAST_DUE')
  await endGrace(owner.email)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_SUSPENDED')

  await mailpit.waitForMessage(owner.email, { subjectContains: 'is suspended' })

  await signIn(owner.session, garage.id)
  const customers = new CustomersPage(page)
  await customers.goto()
  await expect(page.getByText('The subscription is suspended').first()).toBeVisible()
  await expect(page.getByText('The garage is locked until you renew. Your data is kept safe.')).toBeVisible()
  await expect(customers.row('QA Customer Em Vo')).toBeHidden()

  // Staff are locked out too, with the staff wording.
  const staffContext = await page.context().browser()?.newContext()
  if (!staffContext) throw new Error('browser context unavailable')
  const staffPage = await staffContext.newPage()
  await staffPage.addInitScript(
    ({ session, garageId }) => {
      localStorage.setItem('vietgara.language', 'en')
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      localStorage.setItem('vietgara.user', JSON.stringify(session.user))
      localStorage.setItem('vietgara.garageId', garageId)
    },
    { session: staff.session, garageId: garage.id ?? '' },
  )
  await staffPage.goto('/customers')
  await expect(staffPage.getByText('Ask the garage owner to renew the subscription.')).toBeVisible()
  await staffContext.close()

  // The admin extends the subscription by 30 days: the data is back.
  const listed = await adminApi.listSubscriptions(owner.email)
  const subscriptionId = listed.data?.[0]?.subscription?.id
  if (!subscriptionId) throw new Error('the admin list does not show the suspended subscription')
  expect(listed.data?.[0]?.subscription?.status).toBe('SUBSCRIPTION_STATUS_SUSPENDED')
  await adminApi.extendSubscription(subscriptionId, 30)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_ACTIVE')

  await customers.goto()
  await expect(customers.row('QA Customer Em Vo')).toBeVisible()
  await customers.createCustomer({ fullName: 'QA Customer Giang Do', phone: '0911000011' })
  await expect(customers.row('QA Customer Giang Do')).toBeVisible()
})
