// E2E-CAT-011 · Delete or deactivate a job; an inactive job leaves the picker and can be reactivated
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, draftQuote, oilParts } from '../../src/fixtures/jobs.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'

test('E2E-CAT-011 delete or deactivate a job; an inactive job leaves the picker and can be reactivated', async ({
  page,
  signIn,
  freshOwner,
}) => {
  const owner = await freshOwner('cat011', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT011' })
  const gid = garage.id ?? ''
  const { oil } = await oilParts(owner.api, gid)
  const used = await owner.api.createJob(gid, { name: 'QA Used job', laborPrice: 100000, parts: [{ partId: oil.id ?? '', quantity: '1' }] })
  await owner.api.createJob(gid, { name: 'QA Unused job', laborPrice: 50000 })
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '011')
  const oldQuote = await owner.api.addQuoteJob(
    gid,
    (await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')).id ?? '',
    used.id ?? '',
  )
  const oldLines = (oldQuote.lines ?? []).map((line) => line.description)
  await signIn(owner.session, garage.id)

  const catalogue = new CataloguePage(page)
  const dialog = page.getByRole('dialog')
  await catalogue.goto()
  await catalogue.openJobs()

  // Step 1: the unused job is deleted for good, and its name is free again.
  await catalogue.row('QA Unused job').getByRole('button', { name: 'Delete: QA Unused job' }).click()
  await expect(dialog.getByText(/will be deleted for good/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(catalogue.row('QA Unused job')).toBeHidden()
  await catalogue.newJobButton.first().click()
  await catalogue.fillJob({ name: 'QA Unused job' })
  await catalogue.saveJob()
  await expect(catalogue.row('QA Unused job')).toBeVisible()

  // Step 2: the used job is only deactivated.
  await catalogue.row('QA Used job').getByRole('button', { name: 'Delete: QA Used job' }).click()
  await expect(dialog.getByText(/will only be deactivated/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Deactivate' }).click()
  await expect(catalogue.row('QA Used job')).toBeHidden()
  await catalogue.showInactive.click()
  await expect(catalogue.row('QA Used job')).toContainText('Inactive')

  // Step 3: it is not offered on a new quote, and adding it over the API is refused.
  const fresh = await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  const quoteForm = new QuoteFormPage(page)
  await quoteForm.open(fresh.id ?? '')
  await quoteForm.addJobButton.click()
  await quoteForm.jobPicker.getByPlaceholder('Search by name or category…').fill('QA')
  await expect(quoteForm.jobPicker.getByText('QA Unused job')).toBeVisible()
  await expect(quoteForm.jobPicker.getByText('QA Used job')).toBeHidden()
  await expectRefused(owner.api.addQuoteJob(gid, fresh.id ?? '', used.id ?? ''), 409, 'JOB_INACTIVE')
  await page.keyboard.press('Escape')

  // Step 4: the old quote still has the lines the job made.
  expect(((await owner.api.getQuote(gid, oldQuote.id ?? '')).lines ?? []).map((line) => line.description)).toEqual(oldLines)
  await quoteForm.open(oldQuote.id ?? '')
  await expect(quoteForm.descriptionInput(1)).toHaveValue('QA Used job')

  // Step 5: reactivated, the job is offered again.
  await catalogue.goto()
  await catalogue.openJobs()
  await catalogue.showInactive.click()
  await catalogue.row('QA Used job').getByRole('button', { name: 'Reactivate: QA Used job' }).click()
  await catalogue.showInactive.click()
  await expect(catalogue.row('QA Used job')).not.toContainText('Inactive')
  expect((await owner.api.listJobs(gid)).map((job) => job.name).sort()).toEqual(['QA Unused job', 'QA Used job'])
  expect((await owner.api.addQuoteJob(gid, fresh.id ?? '', used.id ?? '')).lines).toHaveLength(3)
})
