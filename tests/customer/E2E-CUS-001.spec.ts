// E2E-CUS-001 · Create a customer with consent and find them by search
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
import { expect, test } from '../../src/fixtures/index.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'

test('E2E-CUS-001 create a customer with consent and find them by search', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cus001')
  const garage = await owner.api.createGarage({ name: 'QA Gara CUS001' })
  await signIn(owner.session, garage.id)

  const customers = new CustomersPage(page)
  await customers.goto()
  await customers.createCustomer({
    fullName: 'QA Customer Hoa Pham',
    phone: '0911000020',
    email: 'customer.hoa@vietgara.test',
    consent: true,
  })

  const row = customers.row('QA Customer Hoa Pham')
  await expect(row).toBeVisible()
  await expect(row).toContainText('Consent given')

  for (const query of ['Hoa', '0911000020', 'customer.hoa']) {
    await customers.search(query)
    await expect(customers.row('QA Customer Hoa Pham')).toBeVisible()
  }
})
