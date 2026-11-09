// E2E-LIC-016 · The admin rejects a request with a reason; the owner submits again
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
//
// The owner declares a transfer, the platform admin rejects it with a
// reason in the admin web, the owner sees the reason and the plan unchanged,
// and can quote again. (A reason is required: the Reject button of the
// dialog stays inert without one.)
import { expect, test } from '../../src/fixtures/index.js'
import { openAdminPage } from '../../src/fixtures/admin-page.js'
import { AdminPaymentRequestsPage } from '../../src/pages/admin/AdminPages.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

const SCREENSHOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

test('E2E-LIC-016 the admin rejects a request with a reason; the owner submits again', async ({
  page,
  browser,
  signIn,
  freshOwner,
  adminSession,
}) => {
  const owner = await freshOwner('lic016')
  await signIn(owner.session)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()
  await subscription.choosePlan('Starter')
  await expect(subscription.planCard('Starter')).toContainText('/year')
  await expect(page.getByText('2,990,000').first()).toBeVisible()
  await subscription.declareTransfer({
    payerName: 'QA Payer',
    evidence: { name: 'transfer.png', mimeType: 'image/png', buffer: SCREENSHOT },
  })
  await expect(page.getByText('Waiting for review').first()).toBeVisible()

  // Steps 1 to 3: the admin finds the request in the queue and rejects it with a reason.
  const admin = await openAdminPage(browser, adminSession)
  const queue = new AdminPaymentRequestsPage(admin.page)
  await queue.goto()
  await expect(queue.row(owner.email)).toBeVisible()
  await queue.reject(owner.email, 'Transfer not received')
  await expect(admin.page.getByText('Request rejected.')).toBeVisible()
  await admin.close()

  // Step 4: the owner sees the rejection with its reason; the plan did not change.
  await subscription.goto()
  await expect(page.getByText('Your payment for the Starter plan was rejected')).toBeVisible()
  await expect(page.getByText('Transfer not received')).toBeVisible()
  await expect(page.getByText('Free trial').first()).toBeVisible()
  await expect(page.getByText('days left in your free trial')).toBeVisible()

  // ...and a rejected request does not block a new one.
  await subscription.choosePlan('Starter')
  await expect(page.getByText('Payment details for Starter are ready below.')).toBeVisible()
})
