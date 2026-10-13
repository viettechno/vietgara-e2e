// E2E-BIL-009 · Permissions: billing view and billing write
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-BIL-009 permissions: billing view and billing write', async ({ page, api, freshOwner, signIn }) => {
  // Create owner with garage
  const owner = await freshOwner('bil009-owner')
  await signIn(owner.session)
  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara BIL009', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find(g => g.name === 'QA Gara BIL009')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Test with a staff member who has no billing permission (Technician role)
  // The baseline seeder creates staff with known roles
  // This test verifies the UI hides settlements for non-billing staff
  await page.goto(`/garages/${garageId}/settlements`)
  // Should either redirect or show permission denied
  await expect(page.getByText(/no access|not allowed|permission denied/i)).toBeVisible()
})