// API-only setup for the Inventory specs (E2E-INV-*): the documented suppliers
// (00_Test_Data.md §3.3) and the stock-issue wait the repair-order specs share.
import { expect } from '@playwright/test'
import type { ApiClient } from '../api/client.js'
import { ApiError } from '../api/http.js'
import type { Part, RepairOrder, StockCount, StockCountLine, StockIssue, Supplier } from '../api/types.js'

/** supplier1-1-1 and supplier1-1-2 of the test data. */
export const SUPPLIER_1 = 'QA Supplier Phu Tung Sai Gon'
export const SUPPLIER_2 = 'QA Supplier Lop Xe Viet'

export async function createSuppliers(api: ApiClient, garageId: string): Promise<{ first: Supplier; second: Supplier }> {
  const first = await api.createSupplier(garageId, { name: SUPPLIER_1, taxCode: '0301234567' })
  const second = await api.createSupplier(garageId, { name: SUPPLIER_2 })
  return { first, second }
}

/** The stock issue of a repair order: created by an event a moment after the order, so poll for it. */
export async function waitForStockIssue(api: ApiClient, garageId: string, repairOrderId: string): Promise<StockIssue> {
  let issue: StockIssue | undefined
  await expect
    .poll(
      async () => {
        issue = await api.getStockIssue(garageId, repairOrderId).catch(() => undefined)
        return issue?.id
      },
      { timeout: 60_000 },
    )
    .toBeTruthy()
  return issue as StockIssue
}

/** A part with `quantity` on hand at `unitCost` per base unit, received through a completed goods receipt. */
export async function stockedPart(
  api: ApiClient,
  garageId: string,
  input: {
    sku: string
    name: string
    quantity: string
    unitCost: number
    supplierId?: string
    unit?: { name: string; abbreviation: string }
  },
): Promise<Part> {
  const part = await api.createSimplePart(garageId, { sku: input.sku, name: input.name, unit: input.unit })
  await api.receiveStock(garageId, part.id ?? '', { quantity: input.quantity, unitCost: input.unitCost, supplierId: input.supplierId })
  return part
}

/** The quantity of a part on hand now. */
export async function onHand(api: ApiClient, garageId: string, part: Part): Promise<string | undefined> {
  return (await api.getStockLevel(garageId, part.id ?? '')).quantityOnHand
}

/** A line of a stock count by part SKU. */
export function countLine(count: StockCount, sku: string): StockCountLine {
  const line = (count.lines ?? []).find((candidate) => candidate.partSku === sku)
  if (!line) throw new Error(`stock count ${count.number} has no line for ${sku}`)
  return line
}

/** Expects an API call to be refused with an HTTP status and (when given) an error code. */
export async function expectRefused(call: Promise<unknown>, status: number, code?: string): Promise<void> {
  const error = await call.then(
    () => undefined,
    (e: unknown) => e,
  )
  expect(error, 'the call should have been refused').toBeInstanceOf(ApiError)
  expect((error as ApiError).status).toBe(status)
  if (code) expect((error as ApiError).code).toBe(code)
}

export const PIECE = { name: 'Piece', abbreviation: 'pc' }

/** Completes every line of a repair order and closes it; the close posts the order's stock issue. */
export async function completeAndClose(api: ApiClient, garageId: string, order: RepairOrder): Promise<void> {
  for (const line of order.lines ?? []) {
    await api.updateRepairOrderLine(garageId, order.id ?? '', line.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
      assignedTechnicianIds: [],
    })
  }
  await api.closeRepairOrder(garageId, order.id ?? '')
}
