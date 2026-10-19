// E2E-QUO-016 · A hidden consumable is not billed, not shown to the customer and not decided
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, draftQuote, oilChange } from '../../src/fixtures/jobs.js'
import { PublicQuotePage } from '../../src/pages/quotes/PublicQuotePage.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-QUO-016 a hidden consumable is not billed, not shown to the customer and not decided', async ({
  page,
  api,
  signIn,
  freshOwner,
}) => {
  const owner = await freshOwner('quo016', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO016' })
  const gid = garage.id ?? ''
  const { filter, job } = await oilChange(owner.api, gid)
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '016')
  const quote = await owner.api.addQuoteJob(
    gid,
    (await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')).id ?? '',
    job.id ?? '',
  )
  await signIn(owner.session, garage.id)

  // Step 1: the hidden line is marked, priced 0 and left out of the total.
  const form = new QuoteFormPage(page)
  await form.open(quote.id ?? '')
  const hiddenRow = form.lineRow(3)
  await expect(hiddenRow).toContainText('Oil filter')
  await expect(hiddenRow.getByRole('checkbox', { name: 'Do not bill 4' })).toBeChecked()
  await expect(hiddenRow.getByRole('spinbutton').last()).toHaveValue('0')
  await expect(hiddenRow.getByRole('spinbutton').last()).toBeDisabled()
  await expect(form.total).toContainText('660,000')

  // Step 2: a labor line or a free-form line cannot be hidden (the screen offers no such box);
  // the server refuses it, and a quote whose only line is hidden.
  await expect(form.lineRow(0).getByRole('checkbox')).toHaveCount(0)
  const hiddenLabor = [
    { itemType: 'QUOTE_ITEM_TYPE_LABOR' as const, description: 'Oil filter', quantity: '1', unitPrice: '0', nonBillable: true },
  ]
  const onlyHidden = [
    {
      itemType: 'QUOTE_ITEM_TYPE_PART' as const,
      itemRefId: filter.id,
      description: 'Oil filter',
      quantity: '1',
      unitPrice: '0',
      nonBillable: true,
    },
  ]
  const base = { customerId: customer.id ?? '', vehicleId: vehicle.id ?? '' }
  await expectRefused(owner.api.createQuote(gid, { ...base, lines: hiddenLabor }), 422)
  await expectRefused(owner.api.createQuote(gid, { ...base, lines: onlyHidden }), 422)

  // Step 3: sent, the quote shows "Hidden from the customer" to staff; the public link lists the billable lines only.
  const sent = await owner.api.sendQuote(gid, quote.id ?? '')
  const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
  await form.open(quote.id ?? '')
  await expect(page.getByText('Hidden from the customer')).toBeVisible()
  const pdf = page.waitForEvent('download')
  await form.exportPdfButton.click()
  expect((await pdf).suggestedFilename()).toMatch(/\.pdf$/)

  const link = new PublicQuotePage(page)
  await link.goto(token)
  await expect(page.getByText('Oil change').first()).toBeVisible()
  await expect(page.getByText('Engine oil 5W-30').first()).toBeVisible()
  await expect(page.getByText('Oil filter')).toBeHidden()
  await expect(page.locator('body')).toContainText('660,000')

  // Step 5: the customer decides on the lines shown; the hidden one is not among them.
  await link.startButton.click()
  await expect(page.getByRole('radiogroup', { name: 'Oil filter' })).toHaveCount(0)
  await expect(page.getByRole('radiogroup')).toHaveCount(3)
  await link.decideLine('Engine oil 5W-30', false)
  await link.submitButton.click()
  await expect(page.getByText('You approved this quote. Thank you!')).toBeVisible({ timeout: 20000 })

  // A decision that names the hidden line is refused, for the customer and for staff.
  const second = await owner.api.addQuoteJob(
    gid,
    (await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')).id ?? '',
    job.id ?? '',
  )
  const secondSent = await owner.api.sendQuote(gid, second.id ?? '')
  const hiddenId = (second.lines ?? []).find((line) => line.nonBillable)?.id ?? ''
  const decisions = (second.lines ?? []).filter((line) => !line.nonBillable).map((line) => ({ lineId: line.id ?? '', approved: true }))
  await expectRefused(
    api.decidePublicQuote((secondSent.publicUrl ?? '').split('/').pop() ?? '', [...decisions, { lineId: hiddenId, approved: true }]),
    422,
  )
  await expectRefused(owner.api.recordQuoteDecision(gid, second.id ?? '', [...decisions, { lineId: hiddenId, approved: true }]), 422)
  expect((await owner.api.recordQuoteDecision(gid, second.id ?? '', decisions)).status).toBe('QUOTE_STATUS_APPROVED')
})
