// E2E-QUO-008 · MANUAL mode: the advisor records the customer's decision directly
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
//
// MANUAL mode has no link and no e-mail: the send only marks the quote
// ready, and the decision panel records it. Each line's Approve/Reject
// control is the same radio group the public link uses.
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-008 manual mode records the decision directly', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('quo008')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO008' })
  const customerEmail = `customer.quo008.${Date.now()}@vietgara.test`
  const customer = await owner.api.createCustomer(garage.id ?? '', {
    fullName: 'QA Customer An QUO008',
    phone: '0911000082',
    email: customerEmail,
  })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-882.82' })
  const quote = await owner.api.createQuote(garage.id ?? '', {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_MANUAL',
    lines: [
      { itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' },
      { itemType: 'QUOTE_ITEM_TYPE_PART', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
    ],
  })
  await signIn(owner.session, garage.id)

  const quoteForm = new QuoteFormPage(page)
  await quoteForm.open(quote.id ?? '')
  await quoteForm.sendButton.click()
  await expect(page.getByText('Sent')).toBeVisible()

  // MANUAL mode sends nothing: no banner link, no e-mail even with an address on file.
  await expect(page.getByRole('button', { name: 'Copy link' })).toBeHidden()

  await expect(page.getByText("Record the customer's decision")).toBeVisible()
  await page.getByRole('radiogroup', { name: 'Oil change service' }).getByRole('radio', { name: 'Approve' }).click()
  await page.getByRole('radiogroup', { name: 'Engine oil 5W-30' }).getByRole('radio', { name: 'Approve' }).click()
  await page.getByRole('button', { name: 'Save decision' }).click()

  await expect(page.getByText('Approved')).toBeVisible()
  await expect(quoteForm.convertButton).toBeVisible()
})
