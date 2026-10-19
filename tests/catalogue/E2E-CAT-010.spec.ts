// E2E-CAT-010 · Create and edit a job with suggested parts; its rules and validation
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
//
// The job is made and edited on screen; the rules the form does not pre-empt (negative price,
// the same part twice, a quantity of 0 or 1.0005, 31 parts, an inactive part) are asserted over the API.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { oilParts } from '../../src/fixtures/jobs.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'

test('E2E-CAT-010 create and edit a job with suggested parts; its rules and validation', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat010', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT010' })
  const gid = garage.id ?? ''
  const { oil, filter } = await oilParts(owner.api, gid)
  await signIn(owner.session, garage.id)

  // Step 1: Catalogue → Jobs → New job with the test data.
  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  await catalogue.openJobs()
  await catalogue.newJobButton.first().click()
  await catalogue.fillJob({
    name: 'Oil change',
    category: 'Maintenance',
    laborPrice: '200000',
    duration: '45',
    parts: [
      { sku: 'OIL-5W30', quantity: '4' },
      { sku: 'FLT-OIL-01', quantity: '1', hidden: true },
    ],
  })
  await catalogue.saveJob()
  const row = catalogue.row('Oil change')
  await expect(row).toBeVisible()
  await expect(row).toContainText('Maintenance')
  await expect(row).toContainText('200,000')
  await expect(row).toContainText('45 min')
  await expect(row).toContainText('Engine oil 5W-30 × 4 L')
  await expect(row).toContainText('Oil filter × 1 pc (hidden)')
  const saved = (await owner.api.listJobs(gid))[0]
  expect(saved?.parts?.[0]).toMatchObject({ partSku: 'OIL-5W30', partName: 'Engine oil 5W-30', unitAbbreviation: 'L', unitPrice: '90000' })
  expect(saved?.parts?.[1]?.nonBillable).toBe(true)

  // Step 2: the oil is suggested as 1 Jug, priced per Jug.
  await row.getByRole('button', { name: 'Edit: Oil change' }).click()
  await catalogue.setJobPart(1, { unit: 'jug', quantity: '1' })
  await catalogue.saveJob()
  await expect(catalogue.row('Oil change')).toContainText('Engine oil 5W-30 × 1 jug')
  const edited = await owner.api.getJob(gid, saved?.id ?? '')
  expect(edited.parts?.[0]).toMatchObject({ unitAbbreviation: 'jug', unitPrice: '450000', quantity: '1' })
  expect(edited.parts).toHaveLength(2)

  // Step 3: a second job named OIL CHANGE is refused on screen (the form stays open) and over the API.
  await catalogue.newJobButton.first().click()
  await catalogue.fillJob({ name: 'OIL CHANGE' })
  await catalogue.saveJob()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()
  await expectRefused(owner.api.createJob(gid, { name: 'OIL CHANGE' }), 409)
  const suggest = (partId: string, quantity: string) => ({ partId, quantity })
  const invalid: Array<[string, Parameters<typeof owner.api.createJob>[1], number]> = [
    ['a negative labor price', { name: 'Neg price', laborPrice: -1 }, 422],
    ['a negative duration', { name: 'Neg time', durationMinutes: -5 }, 422],
    ['the same part twice', { name: 'Twice', parts: [suggest(oil.id ?? '', '1'), suggest(oil.id ?? '', '2')] }, 422],
    ['a quantity of 0', { name: 'Zero', parts: [suggest(oil.id ?? '', '0')] }, 422],
    ['a quantity with too many decimals', { name: 'Decimals', parts: [suggest(oil.id ?? '', '1.0005')] }, 422],
    [
      'a unit the part does not have',
      { name: 'Bad unit', parts: [{ partId: filter.id ?? '', quantity: '1', unitId: edited.parts?.[0]?.unitId }] },
      422,
    ],
    ['31 parts', { name: 'Many', parts: Array.from({ length: 31 }, () => suggest(oil.id ?? '', '1')) }, 422],
  ]
  for (const [, job, status] of invalid) await expectRefused(owner.api.createJob(gid, job), status)
  expect(await owner.api.listJobs(gid)).toHaveLength(1)

  // Step 4: a part that is no longer active cannot be suggested.
  const retired = await owner.api.createSimplePart(gid, { sku: 'OLD-1', name: 'Retired part' })
  await owner.api.updatePart(gid, retired.id ?? '', { isActive: false })
  await expectRefused(owner.api.createJob(gid, { name: 'Inactive', parts: [suggest(retired.id ?? '', '1')] }), 409)

  // Step 5: the search narrows the list; the category filter does too, and an unknown category is empty.
  await owner.api.createJob(gid, { name: 'Brake service', category: 'Brakes', laborPrice: 300000 })
  await page.reload()
  await catalogue.openJobs()
  await expect(catalogue.row('Brake service')).toBeVisible()
  await page.getByPlaceholder('Search jobs by name or category…').fill('oil')
  await expect(catalogue.row('Oil change')).toBeVisible()
  await expect(catalogue.row('Brake service')).toBeHidden()
  await page.getByPlaceholder('Search jobs by name or category…').fill('Brakes')
  await expect(catalogue.row('Brake service')).toBeVisible()
  await expect(catalogue.row('Oil change')).toBeHidden()
  await page.getByPlaceholder('Search jobs by name or category…').fill('Nothing')
  await expect(page.getByText('No job matches your search.')).toBeVisible()
  expect((await owner.api.listJobs(gid, { category: 'maintenance' })).map((job) => job.name)).toEqual(['Oil change'])
  expect(await owner.api.listJobs(gid, { category: 'Nothing' })).toHaveLength(0)
})
