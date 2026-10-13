// E2E-LIC-005 · Platform admin creates plans; hidden and duplicate plans
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test('E2E-LIC-005 platform admin creates plans; hidden and duplicate plans', async ({ page, adminSession, signIn }) => {
  await signIn(adminSession, undefined)

  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()

  // Create QA Hidden plan
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill('qa-hidden')
  await page.getByLabel('Name').fill('QA Hidden')
  await page.getByLabel('Price').fill('50000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_MONTHLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('1')
  await page.getByLabel('Max transactions per day').fill('5')
  await page.getByLabel('Shown to customers').uncheck()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.')).toBeVisible()
  await expect(plansPage.row('qa-hidden')).toBeVisible()
  await expect(plansPage.row('qa-hidden').getByText('Hidden')).toBeVisible()

  // Create QA Yearly plan
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill('qa-yearly')
  await page.getByLabel('Name').fill('QA Yearly')
  await page.getByLabel('Price').fill('5000000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Max garages').fill('3')
  await page.getByLabel('Max staff').fill('30')
  await page.getByLabel('Max transactions per day').fill('300')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.')).toBeVisible()
  await expect(plansPage.row('qa-yearly')).toBeVisible()

  // Try to create duplicate code qa-small (assuming it exists in baseline)
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill('qa-small')
  await page.getByLabel('Name').fill('QA Duplicate')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText(/plan with this code exists/i)).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()

  // Verify code field is not editable on edit
  await plansPage.row('qa-yearly').getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByLabel('Code')).toBeDisabled()
  await page.getByRole('button', { name: 'Cancel' }).click()
})
