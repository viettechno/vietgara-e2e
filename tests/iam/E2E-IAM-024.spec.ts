// E2E-IAM-024 · Five wrong codes lock the second step
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { enableMfa } from '../../src/fixtures/mfa.js'
import { LoginPage } from '../../src/pages/auth/LoginPage.js'

test('E2E-IAM-024 five wrong codes lock the second step', async ({ page, freshOwner }) => {
  const owner = await freshOwner('iam024')
  const { app } = await enableMfa(owner.api)

  const login = new LoginPage(page)
  await login.goto()
  await login.signInAs(owner.email, owner.password)
  const code = page.getByLabel('Authentication code')
  const verify = page.getByRole('button', { name: 'Verify' })

  // Step 1: four wrong codes are each refused.
  for (let attempt = 1; attempt <= 4; attempt++) {
    await code.fill('000000')
    await verify.click()
    await expect(page.getByRole('alert')).toContainText('The code is incorrect.')
  }

  // Step 2: the fifth locks the second step.
  await code.fill('000000')
  await verify.click()
  await expect(page.getByRole('alert')).toContainText('Too many wrong codes. Try again in 15 minutes.')

  // Step 3: even the right code is refused while locked.
  await code.fill(await app.code())
  await verify.click()
  await expect(page.getByRole('alert')).toContainText('Too many wrong codes. Try again in 15 minutes.')
  await expect(page).not.toHaveURL(/\/garages/)

  // Step 4: signing in again with the password works up to the code page, which is still locked.
  await page.getByRole('button', { name: 'Back to sign in' }).click()
  await login.signInAs(owner.email, owner.password)
  await code.fill(app.stale())
  await verify.click()
  await expect(page.getByRole('alert')).toContainText('Too many wrong codes. Try again in 15 minutes.')
})
