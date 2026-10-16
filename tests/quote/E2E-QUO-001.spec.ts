// E2E-QUO-001 · Create a draft quote with labor and part lines
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-001 create a draft quote with labor and part lines', { tag: '@smoke' }, async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('quo001')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO001' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An Nguyen', phone: '0911000001' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-111.11' })

  await signIn(owner.session, garage.id)

  const quoteForm = new QuoteFormPage(page)
  await quoteForm.goto()

  await quoteForm.pickCustomer('An Nguyen', customer.fullName ?? '')
  await quoteForm.pickSearchSelect(quoteForm.vehicleField, vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')

  await quoteForm.fillLine(0, { itemType: 'Labor', description: 'Oil change service', quantity: '1', unitPrice: '250000' })
  await quoteForm.addLine({ itemType: 'Part', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' })

  await quoteForm.saveButton.click()

  await expect(page).toHaveURL(/\/quotes\/(?!new)[^/]+$/)
  await expect(page.getByText('Draft')).toBeVisible()
  // (250,000 x 1) + (180,000 x 4) = 970,000
  await expect(page.getByText('970,000', { exact: false }).first()).toBeVisible()
})
