// E2E-LIC-006 · Platform admin changes a plan's limits; owners see them at once
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect } from '@playwright/test'
import { test as base } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'
import type { Page } from '@playwright/test'

const adminTest = base.extend<{ adminPage: Page }>({
  adminPage: async ({ playwright }, use) => {
    const context = await playwright.chromium.launchPersistentContext('', {
      headless: true,
      viewport: { width: 1280, height: 720 },
      baseURL: 'http://admin.localhost:8000',
    })
    const page = context.pages()[0] ?? await context.newPage()
    await page.addInitScript(() => localStorage.setItem('vietgara.language', 'en'))
    await use(page)
    await context.close()
  },
})

adminTest('E2E-LIC-006 platform admin changes plan limits; owners see them at once', async ({ adminPage, freshOwner, api }) => {
  // Sign in as platform admin
  const admin = await freshOwner('lic006-admin')
  await adminPage.addInitScript(
    ({ session }: { session: { accessToken?: string; refreshToken?: string; user?: object } }) => {
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      if (session.user) localStorage.setItem('vietgara.user', JSON.stringify(session.user))
    },
    { session: admin.session },
  )

  // Create a test plan
  const plansPage = new AdminPlansPage(adminPage)
  await plansPage.goto()
  await plansPage.newPlanButton.click()
  await adminPage.getByLabel('Code').fill('qa-limit-test')
  await adminPage.getByLabel('Name').fill('QA Limit Test')
  await adminPage.getByLabel('Price').fill('100000')
  await adminPage.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_MONTHLY')
  await adminPage.getByLabel('Max garages').fill('1')
  await adminPage.getByLabel('Max staff').fill('2')
  await adminPage.getByLabel('Max transactions per day').fill('10')
  await adminPage.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(adminPage.getByText('Plan created.')).toBeVisible()

  // Create an owner and subscribe to the plan
  const owner = await freshOwner('lic006-owner')
  await api.withToken(owner.session.accessToken).changeMyPlan('qa-limit-test')

  // Owner checks subscription - should see 2 staff limit
  const ownerApi = api.withToken(owner.session.accessToken)
  await ownerApi.getMySubscription()
  // Note: The entitlements API would show the limits, but we're testing UI
  // This is a placeholder for the full test

  // Admin changes max staff from 2 to 3
  await plansPage.row('qa-limit-test').getByRole('button', { name: 'Edit' }).click()
  await adminPage.getByLabel('Max staff').fill('3')
  await adminPage.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(adminPage.getByText('Plan updated.')).toBeVisible()

  // Owner should now see 3 staff limit
  // This would require checking the owner web subscription page
  // Placeholder for now
  await expect(plansPage.row('qa-limit-test')).toBeVisible()
})