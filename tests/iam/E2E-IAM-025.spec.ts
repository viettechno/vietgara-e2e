// E2E-IAM-025 · Regenerate the recovery codes and turn MFA off
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { enableMfa } from '../../src/fixtures/mfa.js'
import { SecurityPage } from '../../src/pages/account/SecurityPage.js'

test('E2E-IAM-025 regenerate the recovery codes and turn MFA off', async ({ page, api, freshOwner, signIn }) => {
  const owner = await freshOwner('iam025')
  const { app, recoveryCodes: oldCodes } = await enableMfa(owner.api)
  const [oldCode = ''] = oldCodes

  // The owner is already signed in (a session from before MFA was turned on).
  await signIn(owner.session)
  const security = new SecurityPage(page)
  await security.goto()
  await expect(security.on).toBeVisible()

  // Step 1: an old recovery code does not regenerate the codes.
  await security.newCodes.click()
  await security.dialog.getByLabel('Authentication code').fill(oldCode)
  await security.dialog.getByRole('button', { name: 'New recovery codes' }).click()
  await expect(security.dialog.getByRole('alert')).toContainText('The code is incorrect.')

  // Step 2: the code from the app does; a new set of 10 is shown once.
  await security.dialog.getByLabel('Authentication code').fill(await app.code())
  await security.dialog.getByRole('button', { name: 'New recovery codes' }).click()
  const newCodes = await security.takeRecoveryCodes()
  expect(newCodes).toHaveLength(10)

  // Step 5: turn MFA off with a recovery code.
  await security.turnOff.click()
  await security.dialog.getByLabel('Authentication code or recovery code').fill(newCodes[0] ?? '')
  await security.dialog.getByRole('button', { name: 'Turn off' }).click()
  await expect(security.off).toBeVisible()

  // Step 6: signing in needs the password alone. (The signIn fixture re-pins
  // the old session on every page load, so this step goes through the API.)
  const session = await api.login(owner.email, owner.password)
  expect(session.mfaRequired).toBeFalsy()
  expect(session.accessToken).toBeTruthy()
})
