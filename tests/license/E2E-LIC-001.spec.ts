// E2E-LIC-001 · A new owner gets a 14-day trial with trial limits
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
//
// The sign-up itself is E2E-IAM-001's subject; here a verified owner reads
// the trial they landed on: plan, status, usage and the offered plans.
import { expect, test } from '../../src/fixtures/index.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-001 a new owner gets a 14-day trial with trial limits', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('lic001')
  await signIn(owner.session)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()

  await expect(page.getByText('Free trial')).toBeVisible()
  await expect(page.getByText('Trial', { exact: true }).first()).toBeVisible()
  // Usage meters render the label and the "used / max" value in separate
  // spans, so each half is asserted on its own (trial: 1 garage, 5 staff).
  await expect(page.getByText('Garages', { exact: true })).toBeVisible()
  await expect(page.getByText('0 / 1', { exact: true })).toBeVisible()
  await expect(page.getByText('Staff', { exact: true })).toBeVisible()
  await expect(page.getByText('0 / 5', { exact: true })).toBeVisible()
  for (const plan of ['Starter', 'Pro', 'Garage chain']) {
    await expect(subscription.planCard(plan)).toBeVisible()
  }
  await expect(page.getByText('days left in your free trial')).toBeVisible()
})
