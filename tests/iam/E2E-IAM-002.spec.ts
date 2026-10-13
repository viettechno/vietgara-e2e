// E2E-IAM-002 · Unverified user can only use the Account page
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { LoginPage } from '../../src/pages/auth/LoginPage.js'

test('E2E-IAM-002 unverified user can only use the Account page', async ({ page, api }) => {
  // Create an unverified user by registering but not verifying
  const email = `signup.iam002.${Date.now()}@vietgara.test`
  const password = 'Qa@123456'
  const fullName = 'QA Unverified User'

  await api.register({ email, password, fullName, locale: 'LOCALE_EN' })
  // Do NOT verify - this user stays unverified

  // Sign in as the unverified user
  const login = new LoginPage(page)
  await login.goto()
  await login.signInAs(email, password)

  // Step 1: Should land on verification page (the heading plus the
  // explanation paragraph share the title text — scope to the heading)
  await expect(page.getByRole('heading', { name: 'Verify your e-mail' })).toBeVisible()
  await expect(page.getByText(/6-digit code/)).toBeVisible()

  // Step 2: Navigate to protected pages - all should redirect to verification page
  const protectedPaths = ['/garages', '/staff', '/customers', '/subscription']
  for (const path of protectedPaths) {
    await page.goto(path)
    await expect(page.getByText('Verify your e-mail before managing garages, staff and data')).toBeVisible()
  }

  // Step 3: Account page should be accessible
  await page.goto('/account')
  await expect(page.getByText('Not verified')).toBeVisible()

  // Step 4: Change full name and save
  await page.getByLabel('Full name').fill('QA Unverified User Edited')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.')).toBeVisible()
})
