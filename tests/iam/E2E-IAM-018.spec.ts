// E2E-IAM-018 · Interface and e-mail language
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { LoginPage, AccountMenu } from '../../src/pages/auth/LoginPage.js'

test('E2E-IAM-018 interface and e-mail language', async ({ page, api, mailpit }) => {
  // Use a baseline user with Vietnamese locale - ADVISOR_A1 from dataset
  // For now, create a fresh user with Vietnamese locale
  const email = `signup.iam018.${Date.now()}@vietgara.test`
  const password = 'Qa@123456'
  const fullName = 'QA IAM018 Vietnamese'

  const initial = await api.register({ email, password, fullName, locale: 'LOCALE_VI' })
  const message = await mailpit.waitForMessage(email, { subjectContains: 'VietGara' })
  const otpCode = mailpit.extractOtp(message)
  await api.withToken(initial.accessToken).verifyEmail(otpCode, initial.refreshToken ?? '')

  // The switcher is a dropdown (button + radio items), not a combobox.
  const switchLanguage = async (label: 'English' | 'Tiếng Việt') => {
    await page.getByRole('button', { name: /language|ngôn ngữ/i }).click()
    await page.getByRole('menuitemradio', { name: label }).click()
  }

  // Step 1: Switch language on sign-in page to English
  const login = new LoginPage(page)
  await login.goto()
  await switchLanguage('English')

  // Step 2: Sign in as the Vietnamese user
  await login.signInAs(email, password)
  await expect(page).toHaveURL(/\/garages/)

  // Step 3: Use header language switcher to choose English, reload
  await switchLanguage('English')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Add garage' })).toBeVisible()

  // Step 4: Sign out and sign in again - should stay in English
  const accountMenu = new AccountMenu(page)
  await accountMenu.signOut()
  await login.signInAs(email, password)
  await expect(page.getByRole('button', { name: 'Add garage' })).toBeVisible()

  // Step 5: Request password reset, check email in Mailpit - should be in English
  await accountMenu.signOut()
  await login.goto()
  await login.forgotPassword.click()
  await page.getByLabel('Email').fill(email)
  await page.getByRole('button', { name: 'Send code' }).click()
  await expect(page.getByRole('heading', { name: 'Enter the code' })).toBeVisible()
  await expect(page.getByText(/code was sent/)).toBeVisible()

  const resetMessage = await mailpit.waitForMessage(email, { subjectContains: 'VietGara' })
  const resetBody = resetMessage.Text ?? ''
  // Check English content in reset email
  expect(resetBody).toContain('code')
  expect(resetBody).toContain('valid')

  // Step 6: Switch back to Vietnamese
  await login.goto()
  await switchLanguage('Tiếng Việt')
  await expect(page.getByText('Tiếng Việt')).toBeVisible()
})
