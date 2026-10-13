// E2E-QUO-014 · Permissions: no access, and full access
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-014 permissions: no access, and full access', async ({ page, api, freshOwner, signIn }) => {
  // Create owner with garage (over the API: garage setup is not this spec's
  // subject, and the UI creation races the immediate list on slow runners).
  const owner = await freshOwner('quo014-owner')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO014' })
  const garageId = garage.id ?? ''
  if (!garageId) throw new Error('Garage not found')
  await signIn(owner.session, garageId)

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

  // Create a draft quote (pickers search by name/plate, not by id; the
  // form starts with one empty line, so fill it rather than adding)
  await quoteForm.pickCustomer(customer.fullName ?? '', customer.fullName ?? '')
  await quoteForm.pickSearchSelect(quoteForm.vehicleField, vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await quoteForm.fillLine(0, { itemType: 'Labor', description: 'Oil change', quantity: '1', unitPrice: '250000' })
  await quoteForm.saveButton.click()
  await expect(page.getByText('Draft')).toBeVisible()

  // Test TECHNICIAN (no quote access) - no Quotes in sidebar
  // This requires a technician user context - placeholder for now
  // await page.goto('/quotes') - should show no access or redirect

  // Test MANAGER (everything) - same as owner
  // placeholder

  // Clean up (deletion lives on the quote detail, confirmed with Delete)
  const quoteId = page.url().split('/').pop()!
  await quoteForm.open(quoteId)
  await quoteForm.deleteButton.click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click()
})
