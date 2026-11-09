// E2E-LIC-006 · A plan's limits can change while nobody uses it; once it has subscribers they are locked
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test("E2E-LIC-006 a plan's limits are locked once it has subscribers", async ({ page, freshOwner, signIn, adminSession, adminApi }) => {
  await signIn(adminSession, undefined)

  // Create a test plan (unique code: retries share one DB)
  const limitCode = `qa-limit-test-${Date.now()}`
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill(limitCode)
  await page.getByLabel('Name').fill('QA Limit Test')
  await page.getByLabel('Price').fill('1000000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('2')
  await page.getByLabel('Max transactions per day').fill('10')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  // Create an owner and subscribe to the plan
  const owner = await freshOwner('lic006-owner')
  const listed = await owner.api.listPlans()
  const created = (listed.data ?? []).find((p) => p.code === limitCode)
  await owner.api.changeMyPlan(created?.id ?? '', adminApi)

  // Admin tries to change max staff from 2 to 3: the plan has a subscriber now.
  await plansPage.row(limitCode).getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Max staff').fill('3')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(
    page.getByText("This plan has subscribers, so its price, billing cycle, limits and features can't change. Create a new plan instead."),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()

  // The subscriber keeps the limit it bought.
  const unchanged = await owner.api.getMySubscription()
  expect(unchanged.plan?.limits?.maxStaff).toBe(2)

  // The description is not a term: it saves.
  await plansPage.row(limitCode).getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Description').fill('Limits are locked while the plan has subscribers')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()
  await expect(plansPage.row(limitCode)).toBeVisible()
})
