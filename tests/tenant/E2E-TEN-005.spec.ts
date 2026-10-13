// E2E-TEN-005 · Switch the active garage
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
//
// Needs two garages, so the owner moves to Pro first (one API call — the
// plan change itself is E2E-LIC-002's subject, not this spec's).
import { expect, test } from '../../src/fixtures/index.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'
import { GarageSwitcher } from '../../src/pages/garages/GarageSwitcher.js'

test('E2E-TEN-005 switch the active garage', async ({ page, signIn, freshOwner, adminApi }) => {
  const owner = await freshOwner('ten005')
  const plans = await owner.api.listPlans()
  const pro = (plans.data ?? []).find((p) => p.name === 'Pro')
  await owner.api.changeMyPlan(pro?.id ?? '', adminApi)
  const gara1 = await owner.api.createGarage({ name: 'QA Gara TEN005 One' })
  const gara2 = await owner.api.createGarage({ name: 'QA Gara TEN005 Two' })
  const an = await owner.api.createCustomer(gara1.id ?? '', { fullName: 'QA Customer TEN005 An', phone: '0911000051' })
  const chi = await owner.api.createCustomer(gara2.id ?? '', { fullName: 'QA Customer TEN005 Chi', phone: '0911000052' })
  await signIn(owner.session, gara1.id)

  const customers = new CustomersPage(page)
  const switcher = new GarageSwitcher(page)

  await customers.goto()
  await expect(customers.row(an.fullName ?? '')).toBeVisible()
  await expect(customers.row(chi.fullName ?? '')).toBeHidden()

  await switcher.switchTo('QA Gara TEN005 Two')
  // The signIn fixture re-seeds the original garage on every full page
  // load, so re-pin it to the switched garage before navigating further.
  await signIn(owner.session, gara2.id)
  // Re-navigate so the customers list fetches for the new active garage
  // (the list keeps the previous garage's rows while refetching).
  await customers.goto()
  await expect(customers.row(chi.fullName ?? '')).toBeVisible()
  await expect(customers.row(an.fullName ?? '')).toBeHidden()

  await page.reload()
  await expect(customers.row(chi.fullName ?? '')).toBeVisible()
})
