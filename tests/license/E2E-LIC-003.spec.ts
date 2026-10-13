// E2E-LIC-003 · Downgrade is refused while usage exceeds the new plan
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-003 downgrade is refused while usage exceeds the new plan', async ({ page, api, freshOwner, signIn, adminApi }) => {
  // Create owner and set up on Pro plan with 2 garages
  const owner = await freshOwner('lic003')
  await signIn(owner.session)

  // Need to set owner to Pro plan first - use API
  const plans = await api.withToken(owner.session.accessToken).listPlans()
  const proPlan = plans.data?.find((p) => p.name === 'Pro')
  if (proPlan?.id) {
    await api.withToken(owner.session.accessToken).changeMyPlan(proPlan.id, adminApi)
  }

  const garages = new GaragesPage(page)
  await garages.goto()

  // Create first garage
  await garages.createGarage({ name: 'QA Gara LIC003 A', address: '1 Test St, Quan 1, TP.HCM' })

  // Create second garage
  await garages.createGarage({ name: 'QA Gara LIC003 B', address: '2 Test St, Ba Dinh, HN' })

  // Try to downgrade to Starter (1 garage limit) - should be refused
  const subscription = new SubscriptionPage(page)
  await subscription.goto()

  const starterPlan = plans.data?.find((p) => p.name === 'Starter')
  if (starterPlan?.name) {
    await subscription.planCard(starterPlan.name).getByRole('button', { name: 'Choose this plan' }).click()
    // Over the limit: the dialog offers only Close, with the usage message.
    await expect(page.getByText(/usage exceeds|plan limit is reached|upgrade to add more/i)).toBeVisible()
    await page.getByRole('button', { name: 'Close', exact: true }).click()
  }

  // Deactivate one garage
  await page.goto('/garages')
  const garageRowB = garages.garageRow('QA Gara LIC003 B')
  await garageRowB.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Deactivate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  // Now downgrade to Starter should succeed (quote in UI, pay over the API).
  await subscription.goto()
  if (starterPlan?.name) {
    await subscription.choosePlan(starterPlan.name)
    await expect(page.getByText('Payment details for Starter are ready below.')).toBeVisible()
    const quoted = await api.withToken(owner.session.accessToken).getMySubscription()
    const requestId = quoted.openRequest?.id ?? ''
    if (!requestId) throw new Error('no open payment request after quoting Starter')
    await api.withToken(owner.session.accessToken).post(`/v1/me/subscription/payment-requests/${requestId}:submit`, {
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
  }

  // Verify cannot reactivate garage B while on Starter
  await page.goto('/garages')
  await garageRowB.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Reactivate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText(/plan limit is reached|upgrade to add more/i)).toBeVisible()
})
