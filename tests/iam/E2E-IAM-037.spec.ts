// E2E-IAM-037 · Change the password from the owner web console
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
// The admin console shows the same card; it is covered by its component tests, because the
// baseline platform admin cannot change its password without breaking every other scenario.
import { expect, test } from '../../src/fixtures/index.js'
import { PasswordPage } from '../../src/pages/account/PasswordPage.js'

test('E2E-IAM-037 change the password from the owner web console', async ({ page, api, freshOwner, signIn }) => {
  const owner = await freshOwner('iam037')
  const newPassword = `${owner.password}-new`

  await signIn(owner.session)
  const password = new PasswordPage(page)
  await password.goto()

  // Step 1: a wrong current password is refused and nothing changes.
  await password.fill('Wrong@123456', newPassword, newPassword)
  await password.submit.click()
  await expect(page.getByRole('alert').filter({ hasText: 'The password is incorrect.' })).toBeVisible()

  // Step 2: a repeat that differs is flagged and sends no request.
  await password.fill(owner.password, newPassword, `${newPassword}x`)
  await expect(page.getByText('The passwords do not match.')).toBeVisible()
  await password.submit.click()
  await expect(page.getByText('The passwords do not match.')).toBeVisible()

  // Step 2: the same repeat changes it, says so, and keeps the user signed in.
  await password.repeat.fill(newPassword)
  await password.submit.click()
  await expect(page.getByText('Password changed. Other devices were signed out.')).toBeVisible()
  await expect(page).toHaveURL(/\/account/)

  // Step 3: the new password signs in; the old one does not.
  await expect(api.login(owner.email, owner.password)).rejects.toThrow()
  const session = await api.login(owner.email, newPassword)
  expect(session.accessToken).toBeTruthy()
})
