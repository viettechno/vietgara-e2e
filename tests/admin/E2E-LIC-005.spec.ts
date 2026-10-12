// E2E-LIC-005 · Platform admin creates plans; hidden and duplicate plans
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect } from '@playwright/test'
import { test as base } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

// Use the admin-chromium project which targets the admin web origin
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

adminTest('E2E-LIC-005 platform admin creates plans; hidden and duplicate plans', async ({ adminPage, freshOwner }) => {
  // Sign in as platform admin manually
  const admin = await freshOwner('lic005-admin')
  await adminPage.addInitScript(
    ({ session }: { session: { accessToken?: string; refreshToken?: string; user?: object } }) => {
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      if (session.user) localStorage.setItem('vietgara.user', JSON.stringify(session.user))
    },
    { session: admin.session },
  )

  const plansPage = new AdminPlansPage(adminPage)
  await plansPage.goto()

  // Create QA Hidden plan
  await plansPage.newPlanButton.click()
  await adminPage.getByLabel('Code').fill('qa-hidden')
  await adminPage.getByLabel('Name').fill('QA Hidden')
  await adminPage.getByLabel('Price').fill('50000')
  await adminPage.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_MONTHLY')
  await adminPage.getByLabel('Max garages').fill('1')
  await adminPage.getByLabel('Max staff').fill('1')
  await adminPage.getByLabel('Max transactions per day').fill('5')
  await adminPage.getByLabel('Shown to customers').uncheck()
  await adminPage.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(adminPage.getByText('Plan created.')).toBeVisible()
  await expect(plansPage.row('qa-hidden')).toBeVisible()
  await expect(plansPage.row('qa-hidden').getByText('Hidden')).toBeVisible()

  // Create QA Yearly plan
  await plansPage.newPlanButton.click()
  await adminPage.getByLabel('Code').fill('qa-yearly')
  await adminPage.getByLabel('Name').fill('QA Yearly')
  await adminPage.getByLabel('Price').fill('5000000')
  await adminPage.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await adminPage.getByLabel('Max garages').fill('3')
  await adminPage.getByLabel('Max staff').fill('30')
  await adminPage.getByLabel('Max transactions per day').fill('300')
  await adminPage.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(adminPage.getByText('Plan created.')).toBeVisible()
  await expect(plansPage.row('qa-yearly')).toBeVisible()

  // Try to create duplicate code qa-small (assuming it exists in baseline)
  await plansPage.newPlanButton.click()
  await adminPage.getByLabel('Code').fill('qa-small')
  await adminPage.getByLabel('Name').fill('QA Duplicate')
  await adminPage.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(adminPage.getByText(/plan with this code exists/i)).toBeVisible()
  await adminPage.getByRole('button', { name: 'Cancel' }).click()

  // Verify code field is not editable on edit
  await plansPage.row('qa-yearly').getByRole('button', { name: 'Edit' }).click()
  await expect(adminPage.getByLabel('Code')).toBeDisabled()
  await adminPage.getByRole('button', { name: 'Cancel' }).click()
})