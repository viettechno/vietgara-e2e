// E2E-CAT-003 · A new quote line prefills from the selling price; a later price change leaves the quote unchanged
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-CAT-003 a new quote line prefills from the selling price; a later change leaves the quote unchanged', async ({
  page,
  signIn,
  freshOwner,
}) => {
  const owner = await freshOwner('cat003', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT003' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An Nguyen', phone: '0913003003' })
  await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-333.33' })
  const part = await owner.api.createSimplePart(garage.id ?? '', { sku: 'OIL-5W30', name: 'Engine oil 5W-30', salePrice: 120000 })
  await signIn(owner.session, garage.id)

  const form = new QuoteFormPage(page)

  /** Starts a quote and picks the part on its first line; the price field is the subject. */
  const startQuoteWithPart = async () => {
    await form.goto()
    await form.pickCustomer('QA Customer', 'QA Customer An Nguyen')
    await form.pickSearchSelect(form.vehicleField, '51A-333', '51A-333.33')
    const row = form.lineRow(0)
    await row.locator('select').first().selectOption('QUOTE_ITEM_TYPE_PART')
    await row.locator('input[role="combobox"]').fill('OIL-5W30')
    await page.getByRole('listbox').getByRole('option', { name: 'OIL-5W30' }).first().click()
    return row.getByLabel(/^Unit price/)
  }

  // Step 1: the price comes from the part; the saved line keeps it.
  const price = await startQuoteWithPart()
  await expect(price).toHaveValue('120000')
  await form.saveButton.click()
  await expect(page).toHaveURL(/\/quotes\/(?!new)[^/]+$/)
  const quoteUrl = page.url()

  // Step 2: the manager raises the selling price.
  await owner.api.updatePart(garage.id ?? '', part.id ?? '', { salePrice: 150000 })

  // Step 3: the saved quote is unchanged; a new line is prefilled with the new price.
  await page.goto(quoteUrl)
  await expect(form.lineRow(0).getByLabel(/^Unit price/)).toHaveValue('120000')
  await expect(await startQuoteWithPart()).toHaveValue('150000')
})
