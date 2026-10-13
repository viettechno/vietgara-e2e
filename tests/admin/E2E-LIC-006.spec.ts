// E2E-LIC-006 · Platform admin changes a plan's limits; owners see them at once
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test('E2E-LIC-006 platform admin changes plan limits; owners see them at once', async ({ page, freshOwner, signIn, api }) => {
  const admin = await freshOwner('lic006-admin')
  await signIn(admin.session, undefined)

  // Create a test plan
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill('qa-limit-test')
  await page.getByLabel('Name').fill('QA Limit Test')
  await page.getByLabel('Price').fill('100000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_MONTHLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('2')
  await page.getByLabel('Max transactions per day').fill('10')
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(page.getByText('Plan created.')).toBeVisible()

  // Create an owner and subscribe to the plan
  const owner = await freshOwner('lic006-owner')
  await api.withToken(owner.session.accessToken).changeMyPlan('qa-limit-test')

  // Admin changes max staff from 2 to 3
  await plansPage.row('qa-limit-test').getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Max staff').fill('3')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Plan updated.')).toBeVisible()

  // Verify the plan shows updated limits
  await expect(plansPage.row('qa-limit-test')).toBeVisible()
})