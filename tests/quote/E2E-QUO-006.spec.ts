// E2E-QUO-006 · The customer decides each line from the public link
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
//
// No sign-in: the public link is the whole point. Setup (draft + send) goes
// over the API; every decision and assertion is the customer-facing page.
import { expect, test } from '../../src/fixtures/index.js'
import type { ApiClient } from '../../src/api/client.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'
import { PublicQuotePage } from '../../src/pages/quotes/PublicQuotePage.js'

async function sentQuote(
  api: ApiClient,
  garageId: string,
  customerId: string,
  vehicleId: string,
): Promise<{ quoteId: string; token: string }> {
  const quote = await api.createQuote(garageId, {
    customerId,
    vehicleId,
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [
      { itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' },
      { itemType: 'QUOTE_ITEM_TYPE_PART', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
    ],
  })
  const sent = await api.sendQuote(garageId, quote.id ?? '')
  const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
  if (!token) throw new Error('sendQuote answered without a publicUrl')
  return { quoteId: quote.id ?? '', token }
}

test('E2E-QUO-006 the customer decides each line from the public link', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('quo006')
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO006' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An QUO006', phone: '0911000061' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-661.61' })

  const mixed = await sentQuote(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const link = new PublicQuotePage(page)
  await link.goto(mixed.token)
  // The quote number heads the public page; the garage name slot renders
  // empty (the public API omits it — product question, not asserted here).
  await expect(page.getByRole('heading', { name: /Quote BG-/ })).toBeVisible()
  await expect(page.getByText(vehicle.licensePlate ?? '')).toBeVisible()

  await link.startButton.click()
  await link.decideLine('Oil change service', true)
  await link.decideLine('Engine oil 5W-30', false)
  await link.submitButton.click()
  await expect(page.getByText('You approved this quote. Thank you!')).toBeVisible()

  // Decided links turn read-only: no way to decide again.
  await page.reload()
  await expect(page.getByText('You approved this quote. Thank you!')).toBeVisible()
  await expect(link.submitButton).toBeHidden()

  // Every line rejected instead: the quote becomes Rejected.
  const rejected = await sentQuote(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  await link.goto(rejected.token)
  await link.startButton.click()
  await link.decideLine('Oil change service', false)
  await link.decideLine('Engine oil 5W-30', false)
  await link.submitButton.click()
  await expect(page.getByText('You rejected this quote.')).toBeVisible()

  // The owner web agrees with both decisions.
  await signIn(owner.session, garage.id)
  const quoteForm = new QuoteFormPage(page)
  await quoteForm.open(mixed.quoteId)
  await expect(page.getByText('Approved')).toBeVisible()
  await quoteForm.open(rejected.quoteId)
  await expect(page.getByText('Rejected')).toBeVisible()
})
