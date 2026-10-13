// E2E-CUS-010 · Manage suppliers
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// Since Release 5.0 a partner is a supplier: the screen is Suppliers and has
// no insurer type. The second garage proves suppliers belong to one garage.
import { expect, test } from '../../src/fixtures/index.js'
import { GarageSwitcher } from '../../src/pages/garages/GarageSwitcher.js'
import { SuppliersPage } from '../../src/pages/suppliers/SuppliersPage.js'

test('E2E-CUS-010 manage suppliers', async ({ page, signIn, freshOwner, adminApi }) => {
  const owner = await freshOwner('cus010', { locale: 'LOCALE_EN' })
  const pro = ((await owner.api.listPlans()).data ?? []).find((p) => p.name === 'Pro')
  await owner.api.changeMyPlan(pro?.id ?? '', adminApi) // two garages
  const garageOne = await owner.api.createGarage({ name: 'QA Gara CUS010 One' })
  await owner.api.createGarage({ name: 'QA Gara CUS010 Two' })
  await signIn(owner.session, garageOne.id)

  const suppliers = new SuppliersPage(page)
  await suppliers.goto()

  await suppliers.createSupplier({
    name: 'QA Supplier Dau Nhot Mien Nam',
    taxCode: '0309876543',
    contactPerson: 'Mr. Tuan',
    phone: '0912000003',
    email: 'sales.daunhot@vietgara.test',
  })
  await expect(suppliers.row('QA Supplier Dau Nhot Mien Nam')).toContainText('Mr. Tuan')
  // Phones are stored normalized (E.164): 0912000003 shows as +84912000003.
  await expect(suppliers.row('QA Supplier Dau Nhot Mien Nam')).toContainText('+84912000003')

  await suppliers.search('Dau Nhot')
  await expect(page.locator('tbody tr')).toHaveCount(1)

  await suppliers.editContactPerson('QA Supplier Dau Nhot Mien Nam', 'Ms. Thu')
  await expect(suppliers.row('QA Supplier Dau Nhot Mien Nam')).toContainText('Ms. Thu')

  await page.getByRole('button', { name: 'Delete: QA Supplier Dau Nhot Mien Nam' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Delete QA Supplier Dau Nhot Mien Nam?' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(suppliers.row('QA Supplier Dau Nhot Mien Nam')).toBeHidden()

  // Suppliers belong to one garage: the other garage has none.
  await owner.api.createSupplier(garageOne.id ?? '', { name: 'QA Supplier Only In One' })
  await new GarageSwitcher(page).switchTo('QA Gara CUS010 Two')
  await expect(suppliers.row('QA Supplier Only In One')).toBeHidden()
})
