// E2E-LIC-002 · Owner switches from the trial to a paid plan
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-002 owner switches from the trial to a paid plan', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('lic002')
  await signIn(owner.session)

  const subscription = new SubscriptionPage(page)
  await subscription.goto()

  await subscription.choosePlan('Starter')

  await expect(page.getByText('Switched to Starter.')).toBeVisible()
  await expect(page.getByText('Starter').first()).toBeVisible()
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible()
  // The Starter card is now the current plan: its button reads Renew.
  await expect(subscription.planCard('Starter').getByRole('button', { name: 'Renew' })).toBeVisible()
  // The trial banner is gone.
  await expect(page.getByText('days left in your free trial')).toBeHidden()
})
