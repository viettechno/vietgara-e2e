// E2E-IAM-022 · Turn on MFA with an authenticator app and sign in with the code
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { Authenticator } from '../../src/fixtures/totp.js'
import { AccountMenu, LoginPage } from '../../src/pages/auth/LoginPage.js'
import { SecurityPage } from '../../src/pages/account/SecurityPage.js'

test('E2E-IAM-022 turn on MFA with an authenticator app and sign in with the code', async ({ page, freshOwner }) => {
  // The second code may have to wait for the next 30-second TOTP step.
  test.setTimeout(90_000)
  const owner = await freshOwner('iam022')

  const login = new LoginPage(page)
  await login.goto()
  await login.signInAs(owner.email, owner.password)
  await expect(page).toHaveURL(/\/garages/)

  // Step 1: the Security panel says two-step verification is off.
  const security = new SecurityPage(page)
  await security.goto()
  await expect(security.off).toBeVisible()

  // Step 2: scan the QR code (here: read the key) and confirm with a code.
  await security.turnOn.click()
  await expect(security.dialog.getByRole('img', { name: 'QR code for the authenticator app' })).toBeVisible()
  const app = new Authenticator(await security.dialog.getByRole('textbox', { name: 'Key' }).inputValue())
  await security.dialog.getByLabel('Authentication code').fill(await app.code())
  await security.dialog.getByRole('button', { name: 'Confirm' }).click()

  // Step 3: the 10 recovery codes are shown once.
  expect(await security.takeRecoveryCodes()).toHaveLength(10)
  await expect(security.on).toBeVisible()

  // Step 4: signing in now stops at the code page.
  await new AccountMenu(page).signOut()
  await login.signInAs(owner.email, owner.password)
  await expect(page.getByRole('heading', { name: 'Two-step verification' })).toBeVisible()
  await expect(page).not.toHaveURL(/\/garages/)
  expect(await page.evaluate(() => localStorage.getItem('vietgara.accessToken'))).toBeFalsy()

  // Step 5: the current code from the app signs in.
  await page.getByLabel('Authentication code').fill(await app.code())
  await page.getByRole('button', { name: 'Verify' }).click()
  await expect(page).toHaveURL(/\/garages/)

  // Step 6: the session survives a reload without asking again.
  await page.reload()
  await expect(page).toHaveURL(/\/garages/)
})
