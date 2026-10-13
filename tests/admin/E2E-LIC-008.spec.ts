// E2E-LIC-008 · Platform admin finds and extends a subscription
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminSubscriptionsPage } from '../../src/pages/admin/AdminPages.js'

test('E2E-LIC-008 platform admin finds and extends a subscription', async ({ page, freshOwner, signIn, adminSession }) => {
  await signIn(adminSession, undefined)

  // Create an owner with trial
  const owner = await freshOwner('lic008-owner')
  const subBefore = await owner.api.getMySubscription()
  const trialEnd = subBefore.currentPeriodEnd ?? ''

  const subsPage = new AdminSubscriptionsPage(page)
  await subsPage.goto()

  // Search by owner email
  await subsPage.search(owner.email)
  await expect(subsPage.row(owner.email)).toBeVisible()
  await expect(subsPage.row(owner.email).getByText('Free trial')).toBeVisible()
  await expect(subsPage.row(owner.email).getByText('Trial')).toBeVisible()

  // Filter by Trial status
  await page.getByRole('combobox', { name: 'Status' }).selectOption('Trial')
  await expect(subsPage.row(owner.email)).toBeVisible()

  // Extend subscription by 30 days
  await subsPage.row(owner.email).getByRole('button', { name: 'Extend' }).click()
  await page.getByLabel('Days').fill('0')
  await page.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(page.getByText(/1-366 days|invalid/i)).toBeVisible()

  await page.getByLabel('Days').fill('400')
  await page.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(page.getByText(/1-366 days|invalid/i)).toBeVisible()

  await page.getByLabel('Days').fill('30')
  await page.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(page.getByText('Subscription extended.')).toBeVisible()

  // Verify owner sees extended trial
  const subAfter = await owner.api.getMySubscription()
  const newTrialEnd = new Date(subAfter.currentPeriodEnd ?? '')
  const oldTrialEnd = new Date(trialEnd)
  expect(newTrialEnd.getTime() - oldTrialEnd.getTime()).toBeGreaterThan(29 * 24 * 60 * 60 * 1000)
})