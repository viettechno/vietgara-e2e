// E2E-LIC-002 · Owner switches from the trial to a paid plan
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-002 owner switches from the trial to a paid plan', async ({ page, signIn, freshOwner, adminApi }) => {
  const owner = await freshOwner('lic002')
  await signIn(owner.session)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()

  // Release 5.2: choosing quotes a bank transfer; the test quotes in the
  // UI, declares and approves over the API, then reads the result in the UI.
  await subscription.choosePlan('Starter')
  await expect(page.getByText('Payment details for Starter are ready below.')).toBeVisible()

  const quoted = await owner.api.getMySubscription()
  const requestId = quoted.openRequest?.id ?? ''
  if (!requestId) throw new Error('no open payment request after quoting Starter')
  await owner.api.post(`/v1/me/subscription/payment-requests/${requestId}:submit`, {
    payerName: 'QA Payer',
    transferredAmount: quoted.openRequest?.amountDue ?? '0',
    paidAt: new Date().toISOString(),
    evidence: {
      content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      contentType: 'image/png',
    },
  })
  await adminApi.post(`/v1/admin/plan-payment-requests/${requestId}:approve`, {})

  await subscription.goto()
  await expect(page.getByText('Your payment for the Starter plan was approved')).toBeVisible()
  await expect(page.getByText('Starter').first()).toBeVisible()
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible()
  // The Starter card is now the current plan: its button reads Renew.
  await expect(subscription.planCard('Starter').getByRole('button', { name: 'Renew' })).toBeVisible()
  // The trial banner is gone.
  await expect(page.getByText('days left in your free trial')).toBeHidden()
})
