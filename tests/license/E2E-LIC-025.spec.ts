// E2E-LIC-025 · The owner pays the amount due in cash and the admin approves it
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { openAdminPage } from '../../src/fixtures/admin-page.js'
import { AdminPaymentRequestsPage } from '../../src/pages/admin/AdminPages.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-025 the owner pays the amount due in cash and the admin approves it', async ({
  page,
  browser,
  signIn,
  freshOwner,
  adminSession,
}) => {
  const owner = await freshOwner('lic025')
  await signIn(owner.session)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()
  await subscription.choosePlan('Starter')
  await expect(page.getByText('2,990,000').first()).toBeVisible()

  await page.getByRole('button', { name: 'Declare payment' }).click()
  const declaration = page.getByRole('dialog')
  await declaration.getByLabel('Payment method').selectOption('PAYMENT_METHOD_CASH')
  await expect(declaration.getByLabel('Payer bank')).toHaveCount(0)
  await expect(declaration.getByLabel('Payer account')).toHaveCount(0)
  await expect(declaration.getByLabel('Bank transaction code')).toHaveCount(0)
  const evidence = declaration.getByLabel('Evidence (screenshot or PDF)')
  await expect(evidence).not.toHaveAttribute('required')
  await declaration.getByLabel('Payer name').fill('QA Cash Payer')
  await declaration.getByLabel('Amount paid').fill('2990000')
  await expect(declaration.getByLabel('Date paid')).not.toHaveValue('')
  await declaration.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByText('Waiting for review').first()).toBeVisible()
  await expect(page.getByText('Cash', { exact: true }).first()).toBeVisible()

  const requests = await owner.api.listMyPlanPaymentRequests()
  const request = requests.data?.[0]
  if (!request?.id) throw new Error('Submitted cash request not found')
  expect((request as typeof request & { paymentMethod?: string }).paymentMethod).toBe('PAYMENT_METHOD_CASH')

  const admin = await openAdminPage(browser, adminSession)
  const queue = new AdminPaymentRequestsPage(admin.page)
  await queue.goto()
  await expect(queue.row(owner.email)).toBeVisible()
  await queue.row(owner.email).getByRole('button', { name: 'Review' }).click()
  const review = admin.page.getByRole('dialog')
  await expect(review.getByText('Cash', { exact: true })).toBeVisible()
  await expect(review.getByText('Cash payments do not require bank evidence.')).toBeVisible()
  await review.getByRole('button', { name: 'Approve', exact: true }).click()
  await review.getByLabel('Note').fill('Received in cash')
  await review.getByRole('button', { name: 'Approve and apply the plan' }).click()
  await expect(admin.page.getByText('Approved: the plan applies now.')).toBeVisible()

  const approved = await owner.api.getMyPlanPaymentRequest(request.id)
  expect((approved as typeof approved & { paymentMethod?: string }).paymentMethod).toBe('PAYMENT_METHOD_CASH')
  expect(approved.reviewNote).toBe('Received in cash')
  await admin.close()

  await subscription.goto()
  await expect(page.getByText('Your payment for the Starter plan was approved')).toBeVisible()
  await expect(subscription.planCard('Starter').getByRole('button', { name: 'Renew' })).toBeVisible()
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible()
})
