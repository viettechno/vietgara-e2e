// E2E-CUS-017 · Tax profiles: one personal, many company, tax ID check, default moves
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// The browser part of FR-CUS-07: the customer page's "Tax profiles" section.
// The rules behind it (a second personal profile refused, 10 or 13 digit tax
// IDs, the separators dropped) are in the blackbox suite (TestTaxProfiles).
import { expect, test } from '../../src/fixtures/index.js'
import { TaxProfilesSection } from '../../src/pages/customers/CustomersPage.js'

test('E2E-CUS-017 tax profiles: one personal, many company, tax ID check, default moves', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cus017')
  const garage = await owner.api.createGarage({ name: 'QA Gara CUS017' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer Hoa Pham', phone: '0911000102' })
  await signIn(owner.session, garage.id)

  await page.goto(`/customers/${customer.id}`)
  const profiles = new TaxProfilesSection(page)

  // Step 1: the personal profile.
  await profiles.create({ kind: 'Personal', legalName: 'Pham Thi Hoa', taxId: '0123456789' })
  await expect(profiles.row('Pham Thi Hoa')).toBeVisible()
  await expect(profiles.row('Pham Thi Hoa')).toContainText('Personal')

  // Step 2: a customer has at most one personal profile, so the kind is not offered again.
  await profiles.newButton.click()
  await expect(profiles.dialog.getByLabel('Type').locator('option')).toHaveText(['Company'])
  await profiles.dialog.getByRole('button', { name: 'Cancel' }).click()

  // Step 3: a company profile as the default, then a branch with separators in its tax ID.
  await profiles.create({
    kind: 'Company',
    legalName: 'QA Company Hoa Binh JSC',
    taxId: '0312345678',
    address: '1 Nguyen Hue, Quan 1',
    invoiceEmail: 'ketoan@hoabinh.vietgara.test',
    isDefault: true,
  })
  await expect(profiles.row('QA Company Hoa Binh JSC')).toContainText('Default')

  await profiles.create({ kind: 'Company', legalName: 'QA Company Hoa Binh Branch', taxId: '0312345678 001' })
  await expect(profiles.row('QA Company Hoa Binh Branch')).toContainText('0312345678001')

  // Step 4: a tax ID that is neither 10 nor 13 digits is refused and the modal stays open.
  await profiles.create({ kind: 'Company', legalName: 'QA Company Bad', taxId: '12345' })
  await expect(profiles.dialog).toBeVisible()
  await expect(profiles.dialog.getByRole('alert')).toBeVisible()
  await profiles.dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(profiles.row('QA Company Bad')).toHaveCount(0)

  // Step 6: ticking Default on the branch moves the mark: exactly one row carries it.
  await profiles.edit('QA Company Hoa Binh Branch', async (dialog) => {
    await dialog.getByLabel(/Bill to this profile/).check()
  })
  await expect(profiles.row('QA Company Hoa Binh Branch')).toContainText('Default')
  await expect(profiles.row('QA Company Hoa Binh JSC')).not.toContainText('Default')
  await expect(page.getByText('Default', { exact: true })).toHaveCount(1)
})
