// E2E-IAM-009 · Sign out ends the session
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
import { expect, test } from '../../src/fixtures/index.js'
import { AccountMenu, LoginPage } from '../../src/pages/auth/LoginPage.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'

test('E2E-IAM-009 sign out ends the session', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('iam009')
  const garage = await owner.api.createGarage({ name: 'QA Gara IAM009' })
  await signIn(owner.session, garage.id)

  const customers = new CustomersPage(page)
  await customers.goto()
  const address = page.url()

  await new AccountMenu(page).signOut()
  await expect(page).toHaveURL(/\/login/)

  await page.goBack()
  // Sign-out navigates with `replace` (no history entry), so Back lands on
  // about:blank when the test started mid-history. Either way no customer
  // data may show: not the customers page.
  await expect(page).not.toHaveURL(/\/customers/)

  await page.goto(address)
  await expect(page).toHaveURL(/\/login/)
  await expect(new LoginPage(page).submit).toBeVisible()
})
