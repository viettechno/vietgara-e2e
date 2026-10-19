// E2E-CAT-013 · Job permissions follow the quote permissions; jobs are per garage
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
//
// API only (the scenario is marked Automated (API)).
import { expect, test } from '../../src/fixtures/index.js'
import { expectRefused } from '../../src/fixtures/inventory.js'
import { customerWithVehicle, draftQuote, oilChange } from '../../src/fixtures/jobs.js'
import { joinWith } from '../../src/fixtures/members.js'

test('E2E-CAT-013 job permissions follow the quote permissions; jobs are per garage', async ({ api, freshOwner }) => {
  const owner = await freshOwner('cat013', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT013' })
  const gid = garage.id ?? ''
  const { job } = await oilChange(owner.api, gid)
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '013')
  const quote = await draftQuote(owner.api, gid, customer.id ?? '', vehicle.id ?? '')

  // Step 1: Quote → View lists and reads, and nothing more.
  const reader = await joinWith(owner, gid, await freshOwner('cat013reader'), 'Quote Reader', ['PERMISSION_QUOTE_READ'])
  expect((await reader.api.listJobs(gid)).map((j) => j.name)).toEqual(['Oil change'])
  expect((await reader.api.getJob(gid, job.id ?? '')).parts).toHaveLength(2)
  await expectRefused(reader.api.createJob(gid, { name: 'QA Reader job' }), 403)
  await expectRefused(reader.api.updateJob(gid, job.id ?? '', { category: 'Other' }), 403)
  await expectRefused(reader.api.deleteJob(gid, job.id ?? ''), 403)
  await expectRefused(reader.api.addQuoteJob(gid, quote.id ?? '', job.id ?? ''), 403)

  // Step 2: Quote → Edit does everything.
  const advisor = await joinWith(owner, gid, await freshOwner('cat013advisor'), 'Quote Writer', [
    'PERMISSION_QUOTE_READ',
    'PERMISSION_QUOTE_WRITE',
  ])
  const created = await advisor.api.createJob(gid, { name: 'QA Advisor job', laborPrice: 1000 })
  expect(created.name).toBe('QA Advisor job')
  expect((await advisor.api.addQuoteJob(gid, quote.id ?? '', job.id ?? '')).lines).toHaveLength(4)
  expect((await advisor.api.deleteJob(gid, created.id ?? '')).outcome).toBe('DELETE_OUTCOME_DELETED')

  // Step 3: a member without quote access is refused.
  const technician = await joinWith(owner, gid, await freshOwner('cat013tech'), 'Repair Only', ['PERMISSION_REPAIR_ORDER_READ'])
  await expectRefused(technician.api.listJobs(gid), 403)
  await expectRefused(technician.api.getJob(gid, job.id ?? ''), 403)

  // Step 4: a job is never visible through another garage's address, and a call without a token is refused.
  const outsider = await freshOwner('cat013other')
  const second = await outsider.api.createGarage({ name: 'QA Gara CAT013 B' })
  await expectRefused(outsider.api.getJob(second.id ?? '', job.id ?? ''), 404)
  await expectRefused(outsider.api.getJob(gid, job.id ?? ''), 403)
  expect(await outsider.api.listJobs(second.id ?? '')).toHaveLength(0)
  await expectRefused(api.getJob(gid, job.id ?? ''), 401)
})
