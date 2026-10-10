// E2E-IAM-001 · Sign up with e-mail and verify with the code
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { RegisterPage, VerifyEmailPage } from '../../src/pages/auth/RegisterPage.js'

test('E2E-IAM-001 sign up with e-mail and verify with the code', async ({ page, mailpit }) => {
  const email = `signup.iam001.${Date.now()}@vietgara.test`
  const fullName = 'QA Signup IAM001'

  const register = new RegisterPage(page)
  await register.goto()
  await register.submitWith({ fullName, email, password: 'Qa@123456' })

  await expect(page).toHaveURL(/\/verify-email/)

  const message = await mailpit.waitForMessage(email, { subjectContains: 'VietGara' })
  const code = mailpit.extractOtp(message)

  const verify = new VerifyEmailPage(page)
  await verify.submitCode(code)

  // Verified users land on the authenticated app (garages, since a
  // brand-new owner has none yet) -- not back on /verify-email or /login.
  await expect(page).toHaveURL(/\/garages/)
  await expect(page.getByRole('heading', { name: 'Garages' })).toBeVisible()
})
