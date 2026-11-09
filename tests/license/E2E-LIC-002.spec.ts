// E2E-LIC-002 · Owner switches from the trial to a paid plan
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
//
// Release 5.2: the owner quotes the plan, declares the bank transfer with a
// screenshot (both in the owner web), and a platform admin approves it in the
// review queue of the admin web. The plan applies at once. The amounts and
// the other rules (credit, one open request, rejection) are in the blackbox
// suite.
import { expect, test } from '../../src/fixtures/index.js'
import { openAdminPage } from '../../src/fixtures/admin-page.js'
import { AdminPaymentRequestsPage } from '../../src/pages/admin/AdminPages.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

// A valid 1x1 PNG: the transfer screenshot.
const SCREENSHOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

test('E2E-LIC-002 owner switches from the trial to a paid plan', async ({ page, browser, signIn, freshOwner, adminSession }) => {
  const owner = await freshOwner('lic002')
  await signIn(owner.session)

  // Steps 1 and 2: choose Starter and get the payment details.
  const subscription = new SubscriptionPage(page)
  await subscription.goto()
  await subscription.choosePlan('Starter')
  await expect(page.getByText('Payment details for Starter are ready below.')).toBeVisible()
  await expect(page.getByText('Transfer reference')).toBeVisible()
  await expect(page.getByText('Amount to transfer')).toBeVisible()
  await expect(subscription.planCard('Starter')).toContainText('/year')
  await expect(page.getByText('2,990,000').first()).toBeVisible() // yearly price; a trial has no credit
  const quote = (await owner.api.listMyPlanPaymentRequests()).data?.[0]
  expect(quote?.quotedAmount).toBe('2990000')
  expect(quote?.creditApplied).toBe('0')
  expect(quote?.amountDue).toBe('2990000')

  // Step 3: declare the transfer with its screenshot.
  await subscription.declareTransfer({
    payerName: 'QA Payer',
    evidence: { name: 'transfer.png', mimeType: 'image/png', buffer: SCREENSHOT },
  })
  await expect(page.getByText('Waiting for review').first()).toBeVisible()

  // Step 4: the platform admin approves it in the admin web.
  const admin = await openAdminPage(browser, adminSession)
  const adminPage = admin.page
  const queue = new AdminPaymentRequestsPage(adminPage)
  await queue.goto()
  await expect(queue.row(owner.email)).toBeVisible()
  await queue.approve(owner.email)
  await expect(adminPage.getByText('Approved: the plan applies now.')).toBeVisible()
  await admin.close()

  // Step 5: the owner sees the plan applied at once.
  await subscription.goto()
  await expect(page.getByText('Your payment for the Starter plan was approved')).toBeVisible()
  await expect(subscription.planCard('Starter').getByRole('button', { name: 'Renew' })).toBeVisible()
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('days left in your free trial')).toBeHidden()
})
