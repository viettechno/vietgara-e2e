// E2E-LIC-021 · A plan's billing cycle can be changed only while nobody uses it
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test("E2E-LIC-021 a plan's billing cycle can be changed only while nobody uses it", async ({
  page,
  adminSession,
  adminApi,
  signIn,
  freshOwner,
}) => {
  await signIn(adminSession, undefined)
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()

  const stamp = Date.now()
  const emptyCode = `qa-empty-${stamp}`
  const subscribedCode = `qa-cycle-lock-${stamp}`

  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill(emptyCode)
  await page.getByLabel('Name').fill('QA Empty')
  await page.getByLabel('Price').fill('5000000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('5')
  await page.getByLabel('Max transactions per day').fill('50')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  await plansPage.row(emptyCode).getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_MONTHLY')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()
  await plansPage.row(emptyCode).getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill(subscribedCode)
  await page.getByLabel('Name').fill('QA Cycle Lock')
  await page.getByLabel('Price').fill('1000000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('5')
  await page.getByLabel('Max transactions per day').fill('50')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  const owner = await freshOwner('lic021')
  const plans = await owner.api.listPlans()
  const subscribedPlan = (plans.data ?? []).find((plan) => plan.code === subscribedCode)
  if (!subscribedPlan?.id) throw new Error('QA Cycle Lock plan not listed')
  await owner.api.changeMyPlan(subscribedPlan.id, adminApi)
  const before = await owner.api.getMySubscription()

  await plansPage.row(subscribedCode).getByRole('button', { name: 'Edit' }).click()
  const cycle = page.getByLabel('Billing cycle')
  await cycle.selectOption('BILLING_CYCLE_MONTHLY')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText("The billing cycle can't be changed while this plan has subscribers.")).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()

  await plansPage.row(subscribedCode).getByRole('button', { name: 'Edit' }).click()
  await expect(cycle).toHaveValue('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Price').fill('1500000')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  const after = await owner.api.getMySubscription()
  expect(after.currentPeriodEnd).toBe(before.currentPeriodEnd)
  expect(after.periodPaidAmount).toBe(before.periodPaidAmount)
  const nextQuote = await owner.api.post<{ quotedAmount?: string }>('/v1/me/subscription/payment-requests', {
    planId: subscribedPlan.id,
    kind: 'PLAN_PAYMENT_KIND_RENEW',
  })
  expect(nextQuote.quotedAmount).toBe('1500000')
})
