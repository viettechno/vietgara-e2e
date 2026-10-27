// E2E-IAM-008 · Sign in and wrong credentials
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { env, expect, test } from '../../src/fixtures/index.js'
import { AccountMenu, LoginPage } from '../../src/pages/auth/LoginPage.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-IAM-008 sign in and wrong credentials', async ({ page, freshOwner }) => {
  const owner = await freshOwner('iam008')
  const login = new LoginPage(page)
  await login.goto()

  const wrongMessage = 'Wrong e-mail or password.'
  await login.signInAs(owner.email, 'Wrong@123456')
  await expect(page.getByText(wrongMessage)).toBeVisible()

  await login.signInAs(`nobody@${env.testEmailDomain}`, owner.password)
  await expect(page.getByText(wrongMessage)).toBeVisible()

  // E-mail letter case does not matter.
  await login.signInAs(owner.email.toUpperCase(), owner.password)
  await expect(page).toHaveURL(/\/garages/)
  await expect(new GaragesPage(page).addGarageButton).toBeVisible()
  await new AccountMenu(page).menuButton.click()
  await expect(page.getByText(owner.fullName)).toBeVisible()
})
