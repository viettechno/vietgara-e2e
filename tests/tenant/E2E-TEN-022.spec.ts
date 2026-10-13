// E2E-TEN-022 · One owner cannot reach another owner's garage
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { GarageSwitcher } from '../../src/pages/garages/GarageSwitcher.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'

test('E2E-TEN-022 one owner cannot reach another owner garage', async ({ page, api, freshOwner, signIn }) => {
  // Create owner A with garage A
  const ownerA = await freshOwner('ten022-ownerA')
  await signIn(ownerA.session)
  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN022 A', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage A ID and customer
  const listedA = await api.withToken(ownerA.session.accessToken).listGarages()
  const garageA = listedA.data?.find((g) => g.name === 'QA Gara TEN022 A')
  const garageAId = garageA?.id
  if (!garageAId) throw new Error('Garage A not found')

  // Create customer in garage A
  const customerA = await api.withToken(ownerA.session.accessToken).createCustomer(garageAId, {
    fullName: 'QA Customer TEN022 A',
    phone: '0911000022',
  })

  // Create owner B with garage B
  const ownerB = await freshOwner('ten022-ownerB')
  await signIn(ownerB.session)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN022 B', address: '2 Test St, Ba Dinh, HN' })

  // Step 1: Owner B's garage selector only shows garage B (scope to the
  // popover: the page behind also renders the garage name)
  const switcher = new GarageSwitcher(page)
  await switcher.switcherButton.click()
  const popover = page.getByRole('dialog')
  await expect(popover.getByText('QA Gara TEN022 B')).toBeVisible()
  await expect(popover.getByText('QA Gara TEN022 A')).toBeHidden()
  await page.keyboard.press('Escape')

  // Step 2: Owner B tries to access garage A settings directly
  await page.goto(`/garages/${garageAId}/settings`)
  await expect(page.getByText(/no access|not found/i)).toBeVisible()

  // Step 3: Owner B tries to access customer A directly
  await page.goto(`/customers/${customerA.id}`)
  await expect(page.getByText(/no access|not found/i)).toBeVisible()

  // Step 4: Owner B searches for customer A's phone - should not find
  const customers = new CustomersPage(page)
  await customers.goto()
  await customers.search('0911000022')
  await expect(page.getByText(/no customers|no results/i)).toBeVisible()
})
