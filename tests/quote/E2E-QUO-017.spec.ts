// E2E-QUO-017 · A hidden consumable follows its job when the quote converts
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
//
// API only (the scenario is marked Automated (API)).
import { expect, test } from '../../src/fixtures/index.js'
import { customerWithVehicle, draftQuote, oilChange } from '../../src/fixtures/jobs.js'
import type { ApiClient } from '../../src/api/client.js'
import type { Quote } from '../../src/api/types.js'

/** A sent quote with the job Oil change (labor, oil, a hidden filter) and one free-form line. */
async function sentQuoteWithJob(api: ApiClient, gid: string, customerId: string, vehicleId: string, jobId: string): Promise<Quote> {
  const quote = await draftQuote(api, gid, customerId, vehicleId)
  const withJob = await api.addQuoteJob(gid, quote.id ?? '', jobId)
  return (await api.sendQuote(gid, withJob.id ?? '')).quote
}

test('E2E-QUO-017 a hidden consumable follows its job when the quote converts', async ({ freshOwner }) => {
  const owner = await freshOwner('quo017', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO017' })
  const gid = garage.id ?? ''
  const { job } = await oilChange(owner.api, gid)
  const { customer, vehicle } = await customerWithVehicle(owner.api, gid, '017')

  // Step 1: approve the job's labor line, reject its oil line and the free-form line: the filter comes along.
  const first = await sentQuoteWithJob(owner.api, gid, customer.id ?? '', vehicle.id ?? '', job.id ?? '')
  const billable = (first.lines ?? []).filter((line) => !line.nonBillable)
  expect(billable.map((line) => line.description).sort()).toEqual(['Engine oil 5W-30', 'Inspection', 'Oil change'])
  await owner.api.recordQuoteDecision(
    gid,
    first.id ?? '',
    billable.map((line) => ({ lineId: line.id ?? '', approved: line.description === 'Oil change' })),
  )
  const firstOrder = await owner.api.getRepairOrder(gid, (await owner.api.convertQuote(gid, first.id ?? '')).repairOrderId ?? '')
  const firstLines = (firstOrder.lines ?? []).map((line) => `${line.description}${line.nonBillable ? ' (hidden)' : ''}`).sort()
  expect(firstLines).toEqual(['Oil change', 'Oil filter (hidden)'])
  expect(firstOrder.totalAmount).toBe('200000')

  // Step 2: reject every line of the job and approve the free-form one: the filter is dropped.
  const second = await sentQuoteWithJob(owner.api, gid, customer.id ?? '', vehicle.id ?? '', job.id ?? '')
  await owner.api.recordQuoteDecision(
    gid,
    second.id ?? '',
    (second.lines ?? [])
      .filter((line) => !line.nonBillable)
      .map((line) => ({ lineId: line.id ?? '', approved: line.description === 'Inspection' })),
  )
  const secondOrder = await owner.api.getRepairOrder(gid, (await owner.api.convertQuote(gid, second.id ?? '')).repairOrderId ?? '')
  expect((secondOrder.lines ?? []).map((line) => line.description)).toEqual(['Inspection'])
  expect(secondOrder.totalAmount).toBe('100000')
})
