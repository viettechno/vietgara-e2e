// E2E-IAM-009 · Sign out ends the session
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { AccountMenu, LoginPage } from '../../src/pages/auth/LoginPage.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'

test('E2E-IAM-009 sign out ends the session', async ({ page, freshOwner }) => {
  const owner = await freshOwner('iam009')
  const garage = await owner.api.createGarage({ name: 'QA Gara IAM009' })

  // Sign in through the real form: the signIn fixture's localStorage seed
  // re-runs on every full page load and would restore the session after
  // the sign-out below, hiding a real regression here.
  const login = new LoginPage(page)
  await login.goto()
  await login.signInAs(owner.email, owner.password)
  await expect(page).toHaveURL(/\/garages/)

  const customers = new CustomersPage(page)
  await customers.goto()
  const address = page.url()

  await new AccountMenu(page).signOut()
  await expect(page).toHaveURL(/\/login/)

  await page.goBack()
  // Sign-out navigates with `replace`, so there is no customers entry to
  // go back to: Back lands on about:blank (fresh context) or the sign-in
  // page. Either shows no customer data; the direct navigation below then
  // proves the session ended.
  await expect(page).toHaveURL(/\/login|about:blank/)

  await page.goto(address)
  await expect(page).toHaveURL(/\/login/)
  await expect(new LoginPage(page).submit).toBeVisible()
})
