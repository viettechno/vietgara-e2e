// API-only setup for the job and reservation specs (E2E-CAT-010..013,
// E2E-QUO-015..017, E2E-REP-013..018): the documented "Oil change" job
// (00_Test_Data.md §3.5) in a fresh garage, so each scenario starts from the
// same parts without repeating the setup.
import { expect } from '@playwright/test'
import type { ApiClient } from '../api/client.js'
import type { Customer, Job, Part, Quote, RepairOrder, RepairOrderStatus, StockIssue, Unit, Vehicle } from '../api/types.js'
import { waitForStockIssue } from './inventory.js'
import { PIECE } from './inventory.js'

export type OilChangeFixture = { oil: Part; filter: Part; jug: Unit; job: Job }

/** OIL-5W30: litre, 90,000 per litre, a Jug of 5 L. FLT-OIL-01: piece, 60,000. */
export async function oilParts(api: ApiClient, garageId: string): Promise<{ oil: Part; filter: Part; jug: Unit }> {
  const created = await api.createSimplePart(garageId, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', salePrice: 90000 })
  const jug = await api.createUnit(garageId, 'Jug', 'jug')
  const oil = await api.setPartUnits(garageId, created.id ?? '', [{ unitId: jug.id ?? '', factor: '5' }])
  const filter = await api.createSimplePart(garageId, { sku: 'FLT-OIL-01', name: 'Oil filter', unit: PIECE, salePrice: 60000 })
  return { oil, filter, jug }
}

/**
 * The job Oil change: labor 200,000, 45 minutes, `OIL-5W30` × 4 L and the
 * oil filter × 1 as a hidden consumable.
 */
export async function oilChange(api: ApiClient, garageId: string): Promise<OilChangeFixture> {
  const { oil, filter, jug } = await oilParts(api, garageId)
  const job = await api.createJob(garageId, {
    name: 'Oil change',
    category: 'Maintenance',
    laborPrice: 200000,
    durationMinutes: 45,
    parts: [
      { partId: oil.id ?? '', quantity: '4' },
      { partId: filter.id ?? '', quantity: '1', nonBillable: true },
    ],
  })
  return { oil, filter, jug, job }
}

/** The customer and vehicle every quote and order in a spec belongs to. */
export async function customerWithVehicle(
  api: ApiClient,
  garageId: string,
  tag: string,
): Promise<{ customer: Customer; vehicle: Vehicle }> {
  const customer = await api.createCustomer(garageId, { fullName: `An Nguyen ${tag}`, phone: '0911000730' })
  const vehicle = await api.createVehicle(garageId, { customerId: customer.id ?? '', licensePlate: `51A-73.${tag}` })
  return { customer, vehicle }
}

/** A draft quote with one free-form labor line of 100,000. */
export async function draftQuote(api: ApiClient, garageId: string, customerId: string, vehicleId: string): Promise<Quote> {
  return api.createQuote(garageId, {
    customerId,
    vehicleId,
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Inspection', quantity: '1', unitPrice: '100000' }],
  })
}

/** An open repair order with one labor line `Oil change` at 250,000, plus any extra lines. */
export async function openOrder(
  api: ApiClient,
  garageId: string,
  vehicleId: string,
  extra: Array<Parameters<ApiClient['addRepairOrderLine']>[2]> = [],
): Promise<RepairOrder> {
  return api.createRepairOrder(garageId, {
    vehicleId,
    lines: [{ itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'Oil change', quantity: '1', unitPrice: '250000' }, ...extra],
  })
}

/** An order line by description. */
export function lineOf(order: RepairOrder, description: string) {
  const line = (order.lines ?? []).find((candidate) => candidate.description === description)
  if (!line) throw new Error(`repair order ${order.number} has no line "${description}"`)
  return line
}

/** The quantity of a part the draft stock issues of open orders hold back now. */
export async function reserved(api: ApiClient, garageId: string, part: Part): Promise<string | undefined> {
  return (await api.getStockLevel(garageId, part.id ?? '')).quantityReserved
}

/** Waits for the stock reservation of a part to reach `quantity` (the draft issues follow the orders by events). */
export async function waitForReserved(api: ApiClient, garageId: string, part: Part, quantity: string): Promise<void> {
  await expect.poll(() => reserved(api, garageId, part), { timeout: 60_000 }).toBe(quantity)
}

/** Waits for a repair order to reach a status (waiting on parts follows stock changes by events). */
export async function waitForStatus(api: ApiClient, garageId: string, orderId: string, status: RepairOrderStatus): Promise<void> {
  await expect.poll(async () => (await api.getRepairOrder(garageId, orderId)).status, { timeout: 60_000 }).toBe(status)
}

/** The order's stock issue once `ready` holds (it is short, no longer short, cancelled...). */
export async function waitForIssue(
  api: ApiClient,
  garageId: string,
  orderId: string,
  ready: (issue: StockIssue) => boolean = () => true,
): Promise<StockIssue> {
  await waitForStockIssue(api, garageId, orderId)
  let issue: StockIssue | undefined
  await expect
    .poll(
      async () => {
        issue = await api.getStockIssue(garageId, orderId)
        return ready(issue)
      },
      { timeout: 60_000 },
    )
    .toBe(true)
  return issue as StockIssue
}

/** Completes the billable lines of an order (a hidden consumable needs no progress). */
export async function completeBillable(api: ApiClient, garageId: string, order: RepairOrder): Promise<RepairOrder> {
  let latest = order
  for (const line of order.lines ?? []) {
    if (line.nonBillable) continue
    latest = await api.updateRepairOrderLine(garageId, order.id ?? '', line.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
      assignedTechnicianIds: [],
    })
  }
  return latest
}
