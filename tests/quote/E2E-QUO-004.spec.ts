// E2E-QUO-004 · Send for approval (LINK mode): e-mailed automatically when the customer has an e-mail on file
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-004 send for approval (LINK mode) e-mails the customer', async ({ page, signIn, freshOwner, mailpit }) => {
  const owner = await freshOwner('quo004')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO004' })
  const customer = await owner.api.createCustomer(garage.id ?? '', {
    fullName: 'QA Customer An QUO004',
    phone: '0911000041',
    email: `customer.an.quo004.${Date.now()}@vietgara.test`,
  })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-441.41' })
  const quote = await owner.api.createQuote(garage.id ?? '', {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' }],
  })
  await signIn(owner.session, garage.id)

  const quoteForm = new QuoteFormPage(page)
  await quoteForm.open(quote.id ?? '')
  await quoteForm.sendButton.click()

  await expect(page.getByText('Sent')).toBeVisible()
  await expect(page.getByText('The approval link was e-mailed to the customer.')).toBeVisible()

  const approvalMail = await mailpit.waitForMessage(customer.email ?? '')
  const body = JSON.stringify(approvalMail)
  expect(body).toContain('/public/quotes/')

  // The sent quote downloads as a PDF through a download event (FR-QUO-05).
  const download = page.waitForEvent('download')
  await quoteForm.exportPdfButton.click()
  const pdf = await download
  expect(pdf.suggestedFilename()).toMatch(/\.pdf$/)
})
