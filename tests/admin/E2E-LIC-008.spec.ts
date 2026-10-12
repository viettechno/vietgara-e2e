// E2E-LIC-008 · Platform admin finds and extends a subscription
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect } from '@playwright/test'
import { test as base } from '../../src/fixtures/index.js'
import { AdminSubscriptionsPage } from '../../src/pages/admin/AdminPages.js'
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

adminTest('E2E-LIC-008 platform admin finds and extends a subscription', async ({ adminPage, freshOwner, api }) => {
  // Sign in as platform admin
  const admin = await freshOwner('lic008-admin')
  await adminPage.addInitScript(
    ({ session }: { session: { accessToken?: string; refreshToken?: string; user?: object } }) => {
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      if (session.user) localStorage.setItem('vietgara.user', JSON.stringify(session.user))
    },
    { session: admin.session },
  )

  // Create an owner with trial
  const owner = await freshOwner('lic008-owner')
  const subBefore = await api.withToken(owner.session.accessToken).getMySubscription()
  const trialEnd = (subBefore as { periodEnd: string }).periodEnd

  const subsPage = new AdminSubscriptionsPage(adminPage)
  await subsPage.goto()

  // Search by owner email
  await subsPage.search(owner.email)
  await expect(subsPage.row(owner.email)).toBeVisible()
  await expect(subsPage.row(owner.email).getByText('Free trial')).toBeVisible()
  await expect(subsPage.row(owner.email).getByText('Trial')).toBeVisible()

  // Filter by Trial status
  await adminPage.getByRole('combobox', { name: 'Status' }).selectOption('Trial')
  await expect(subsPage.row(owner.email)).toBeVisible()

  // Extend subscription by 30 days
  await subsPage.row(owner.email).getByRole('button', { name: 'Extend' }).click()
  await adminPage.getByLabel('Days').fill('0')
  await adminPage.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(adminPage.getByText(/1-366 days|invalid/i)).toBeVisible()

  await adminPage.getByLabel('Days').fill('400')
  await adminPage.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(adminPage.getByText(/1-366 days|invalid/i)).toBeVisible()

  await adminPage.getByLabel('Days').fill('30')
  await adminPage.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(adminPage.getByText('Subscription extended.')).toBeVisible()

  // Verify owner sees extended trial
  const subAfter = await api.withToken(owner.session.accessToken).getMySubscription()
  const newTrialEnd = new Date((subAfter as { periodEnd: string }).periodEnd)
  const oldTrialEnd = new Date(trialEnd)
  expect(newTrialEnd.getTime() - oldTrialEnd.getTime()).toBeGreaterThan(29 * 24 * 60 * 60 * 1000)
})