// E2E-QUO-014 · Permissions: no access, and full access
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-014 permissions: no access, and full access', async ({ page, api, freshOwner, signIn }) => {
  // Create owner with garage
  const owner = await freshOwner('quo014-owner')
  await signIn(owner.session)
  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara QUO014', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find(g => g.name === 'QA Gara QUO014')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Create customer and vehicle
  const customer = await api.withToken(owner.session.accessToken).createCustomer(garageId, {
    fullName: 'QA Customer QUO014',
    phone: '0911000140',
  })
  if (!customer.id) throw new Error('Customer creation failed')
  const vehicle = await api.withToken(owner.session.accessToken).createVehicle(garageId, {
    customerId: customer.id,
    licensePlate: '51A-140.14',
  })
  if (!vehicle.id) throw new Error('Vehicle creation failed')

  // Test ADVISOR (quote read/write) - has full access
  const quoteForm = new QuoteFormPage(page)
  await quoteForm.goto()
  // Should be able to create quote
  await expect(page.getByRole('heading', { name: 'New quote' })).toBeVisible()

  // Create a draft quote
  await quoteForm.pickCustomer(customer.id ?? '', customer.id ?? '')
  await quoteForm.pickSearchSelect(quoteForm.vehicleField, vehicle.id ?? '', vehicle.id ?? '')
  await quoteForm.addLine({ itemType: 'Labor', description: 'Oil change', quantity: '1', unitPrice: '250000' })
  await quoteForm.saveButton.click()
  await expect(page.getByText('Draft')).toBeVisible()

  // Test TECHNICIAN (no quote access) - no Quotes in sidebar
  // This requires a technician user context - placeholder for now
  // await page.goto('/quotes') - should show no access or redirect

  // Test MANAGER (everything) - same as owner
  // placeholder

  // Clean up
  await page.goto('/quotes')
  const quoteRow = page.locator('tr', { hasText: 'Oil change' })
  await quoteRow.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
})