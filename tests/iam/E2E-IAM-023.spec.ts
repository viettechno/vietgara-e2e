// E2E-IAM-023 · A recovery code signs in once
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { enableMfa } from '../../src/fixtures/mfa.js'
import { AccountMenu, LoginPage } from '../../src/pages/auth/LoginPage.js'
import { SecurityPage } from '../../src/pages/account/SecurityPage.js'

test('E2E-IAM-023 a recovery code signs in once', async ({ page, freshOwner }) => {
  const owner = await freshOwner('iam023')
  const { recoveryCodes } = await enableMfa(owner.api)
  const [first = '', second = ''] = recoveryCodes

  const login = new LoginPage(page)
  const signInWithRecoveryCode = async (code: string) => {
    await login.goto()
    await login.signInAs(owner.email, owner.password)
    await page.getByRole('button', { name: 'Use a recovery code' }).click()
    await page.getByLabel('Recovery code').fill(code)
    await page.getByRole('button', { name: 'Verify' }).click()
  }

  // Step 1: the first code signs in, in any letter case.
  await signInWithRecoveryCode(first.toLowerCase())
  await expect(page).toHaveURL(/\/garages/)
  await new AccountMenu(page).signOut()

  // Step 2: the same code is refused.
  await signInWithRecoveryCode(first)
  await expect(page.getByRole('alert')).toContainText('The code is incorrect.')
  await expect(page).not.toHaveURL(/\/garages/)

  // Step 3: another code still works.
  await page.getByLabel('Recovery code').fill(second)
  await page.getByRole('button', { name: 'Verify' }).click()
  await expect(page).toHaveURL(/\/garages/)

  // Step 4: eight codes are left.
  const security = new SecurityPage(page)
  await security.goto()
  await expect(page.getByText('8 recovery codes left', { exact: false })).toBeVisible()
})
