// E2E-TEN-017 · Create a custom role in the role editor
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-TEN-017 create a custom role in the role editor', async ({ page, freshOwner, signIn }) => {
  const owner = await freshOwner('ten017')
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN017', address: '1 Test St, Quan 1, TP.HCM' })

  // Navigate to Roles & groups
  await page.goto('/roles')

  // Add role (a link to /roles/new, not a button)
  await page.getByRole('link', { name: 'Add role' }).click()

  // Fill role details (the name field is labelled Name)
  await page.getByLabel('Name', { exact: true }).fill('QA Supplier Clerk')
  await page.getByLabel('Description').fill('Manages suppliers only')

  // Suppliers -> Manage (write implies view)
  await page.getByRole('checkbox', { name: 'Manage suppliers' }).check()

  // Verify View is also checked
  await expect(page.getByRole('checkbox', { name: 'View suppliers' })).toBeChecked()

  // Save (the editor saves with Save, not Create)
  await page.getByRole('button', { name: 'Save', exact: true }).click()

  // Verify role created
  await expect(page.getByText('Role created.')).toBeVisible()
  await expect(page.getByText('QA Supplier Clerk')).toBeVisible()

  // Verify no default tag
  await expect(page.getByText('Default')).toBeHidden()

  // Clean up: delete the role
  await page.getByRole('button', { name: 'Delete: QA Supplier Clerk' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByText('QA Supplier Clerk')).toBeHidden()
})
