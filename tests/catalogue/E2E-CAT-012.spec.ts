// E2E-CAT-012 · A part or packaging unit that a job suggests is protected
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
//
// API only (the scenario is marked Automated (API)): the screens show the same refusals.
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, draftQuote, oilChange } from '../../src/fixtures/jobs.js'

test('E2E-CAT-012 a part or packaging unit that a job suggests is protected', async ({ freshOwner }) => {
  const owner = await freshOwner('cat012', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT012' })
  const gid = garage.id ?? ''
  const { oil, filter, jug, job } = await oilChange(owner.api, gid)
  const jugSuggestion = await owner.api.createJob(gid, {
    name: 'Oil top-up',
    parts: [{ partId: oil.id ?? '', quantity: '1', unitId: jug.id ?? '' }],
  })

  // Step 1: deleting the part only deactivates it, because a job suggests it.
  expect((await owner.api.deletePart(gid, oil.id ?? '', true)).outcome).toBe('DELETE_OUTCOME_DEACTIVATED')
  expect((await owner.api.deletePart(gid, filter.id ?? '')).outcome).toBe('DELETE_OUTCOME_DEACTIVATED')
  expect((await owner.api.getPart(gid, filter.id ?? '')).isActive).toBe(false)

  // Step 2: the base unit of a part a job suggests cannot change (the part is in use).
  const other = await owner.api.createUnit(gid, 'Gallon', 'gal')
  await expectRefused(owner.api.updatePart(gid, oil.id ?? '', { baseUnitId: other.id ?? '' }), 409)

  // Step 3: the Jug a job uses cannot be removed; its factor can change.
  await expectRefused(owner.api.setPartUnits(gid, oil.id ?? '', []), 409, 'PACKAGING_UNIT_USED_BY_JOB')
  const refactored = await owner.api.setPartUnits(gid, oil.id ?? '', [{ unitId: jug.id ?? '', factor: '4' }])
  expect(refactored.packagingUnits?.[0]?.factor).toBe('4')

  // Step 4: deleting the job releases the unit.
  expect((await owner.api.deleteJob(gid, jugSuggestion.id ?? '')).outcome).toBe('DELETE_OUTCOME_DELETED')
  const released = await owner.api.setPartUnits(gid, oil.id ?? '', [])
  expect(released.packagingUnits ?? []).toHaveLength(0)

  // Step 5: a part deactivated since is skipped when the job is added to a quote.
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '012')
  const quote = await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  const added = await owner.api.addQuoteJob(gid, quote.id ?? '', job.id ?? '')
  const descriptions = (added.lines ?? []).map((line) => line.description)
  expect(descriptions).toContain('Oil change')
  expect(descriptions).not.toContain('Oil filter')
  expect((added.lines ?? []).filter((line) => line.jobId === job.id)).toHaveLength(2)
})
