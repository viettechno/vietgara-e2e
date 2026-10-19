// E2E-QUO-015 · Pick a job on a quote: the labor line and the part lines appear, editable
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, draftQuote, oilChange } from '../../src/fixtures/jobs.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-015 pick a job on a quote: the labor line and the part lines appear, editable', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('quo015', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO015' })
  const gid = garage.id ?? ''
  const { job } = await oilChange(owner.api, gid)
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '015')
  const quote = await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  await signIn(owner.session, garage.id)

  // Step 1: Add a job → search "oil" → Oil change: labor, oil and the hidden filter join the quote.
  const form = new QuoteFormPage(page)
  await form.open(quote.id ?? '')
  await form.addJob('Oil change', 'oil')
  await expect(form.descriptionInput(1)).toHaveValue('Oil change')
  await expect(form.descriptionInput(2)).toHaveValue('Engine oil 5W-30')
  await expect(form.quantityInput(2)).toHaveValue('4')
  await expect(form.descriptionInput(3)).toHaveValue('Oil filter')
  await expect(form.lineRow(3).getByRole('checkbox', { name: 'Do not bill 4' })).toBeChecked()
  await expect(form.total).toContainText('660,000') // 100,000 + 200,000 + 4 × 90,000; the filter is not billed

  // Step 2: the oil goes to 5 and the quote is saved; the labor line is untouched.
  await form.quantityInput(2).fill('5')
  await expect(form.total).toContainText('750,000')
  await form.save()
  const saved = await owner.api.getQuote(gid, quote.id ?? '')
  const byDescription = (description: string) => (saved.lines ?? []).find((line) => line.description === description)
  expect(byDescription('Engine oil 5W-30')).toMatchObject({ quantity: '5', lineTotal: '450000', jobId: job.id })
  expect(byDescription('Oil change')).toMatchObject({ lineTotal: '200000', jobId: job.id })
  expect(byDescription('Oil filter')).toMatchObject({ nonBillable: true, unitPrice: '0', lineTotal: '0' })
  expect(saved.totalAmount).toBe('750000')

  // Step 3: the same job again adds its lines again.
  await form.addJob('Oil change', 'oil')
  await expect(form.total).toContainText('1,310,000') // 750,000 + 200,000 + 4 × 90,000
  await form.save()
  expect((await owner.api.getQuote(gid, quote.id ?? '')).lines).toHaveLength(7)

  // Step 4: a sent quote has no Add a job, and the API refuses it as not editable.
  await form.sendButton.click()
  await expect(page.getByText('Sent').first()).toBeVisible()
  await expect(form.addJobButton).toBeHidden()
  await expectRefused(owner.api.addQuoteJob(gid, quote.id ?? '', job.id ?? ''), 409)
})
