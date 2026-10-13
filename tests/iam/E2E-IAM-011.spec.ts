// E2E-IAM-011 · Reset a forgotten password
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
//
// Covers steps 1–5 (request, code, new password, old refused, new works).
// Step 6 (a second browser is signed out too) needs a second live session
// and stays manual until the suite grows a two-context actor fixture.
import { expect, test } from '../../src/fixtures/index.js'
import { LoginPage } from '../../src/pages/auth/LoginPage.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-IAM-011 reset a forgotten password', async ({ page, mailpit, freshOwner }) => {
  const owner = await freshOwner('iam011')
  const newPassword = 'Qa@654321'

  const login = new LoginPage(page)
  await login.goto()
  await login.forgotPassword.click()
  await expect(page.getByRole('heading', { name: 'Forgot password' })).toBeVisible()

  await page.getByLabel('Email', { exact: true }).fill(owner.email)
  await page.getByRole('button', { name: 'Send code' }).click()
  await expect(page.getByRole('heading', { name: 'Enter the code' })).toBeVisible()

  const message = await mailpit.waitForMessage(owner.email)
  await page.getByLabel('Verification code').fill(mailpit.extractOtp(message))
  await page.getByRole('button', { name: 'Confirm code' }).click()
  await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible()

  await page.getByLabel('New password', { exact: true }).fill(newPassword)
  await page.getByLabel('Repeat password').fill(newPassword)
  await page.getByRole('button', { name: 'Reset password' }).click()
  await expect(page.getByText('Password changed. Sign in again.')).toBeVisible()

  await login.signInAs(owner.email, owner.password)
  await expect(page.getByText('Wrong e-mail or password.')).toBeVisible()

  await login.signInAs(owner.email, newPassword)
  await expect(page).toHaveURL(/\/garages/)
  await expect(new GaragesPage(page).addGarageButton).toBeVisible()
})
