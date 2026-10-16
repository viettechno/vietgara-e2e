// E2E-QUO-010 · Convert an approved quote into a repair order, preserving only approved lines
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
//
// The approval happens on the public link (E2E-QUO-006's path, one approve
// + one reject over the API here); the conversion itself is the UI under
// test: banner, link, and the repair order carrying only the approved line.
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-010 convert an approved quote into a repair order', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('quo010')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO010' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An QUO010', phone: '0911000010' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-101.01' })
  const quote = await owner.api.createQuote(garage.id ?? '', {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [
      { itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' },
      { itemType: 'QUOTE_ITEM_TYPE_PART', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
    ],
  })
  const sent = await owner.api.sendQuote(garage.id ?? '', quote.id ?? '')
  const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
  const viewed = await owner.api.getPublicQuote(token)
  const lines = viewed.lines ?? []
  await owner.api.decidePublicQuote(
    token,
    lines.map((line, index) => ({ lineId: line.id ?? '', approved: index === 0 })),
  )
  await signIn(owner.session, garage.id)

  const quoteForm = new QuoteFormPage(page)
  await quoteForm.open(quote.id ?? '')
  await expect(page.getByText('Approved')).toBeVisible()
  await quoteForm.convertButton.click()

  await expect(page.getByText('A repair order was created from this quote.')).toBeVisible()
  await page.getByRole('link', { name: 'View repair order' }).click()
  await expect(page).toHaveURL(/\/repair-orders\/(?!new)[^/]+$/)
  await expect(page.getByText(customer.fullName ?? '')).toBeVisible()
  await expect(page.getByText(vehicle.licensePlate ?? '')).toBeVisible()
  // Only the approved line survived the conversion.
  await expect(page.getByText('Oil change service')).toBeVisible()
  await expect(page.getByText('Engine oil 5W-30')).toBeHidden()
})
