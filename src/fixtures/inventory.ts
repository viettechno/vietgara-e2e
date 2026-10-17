// API-only setup for the Inventory specs (E2E-INV-*): the documented suppliers
// (00_Test_Data.md §3.3) and the stock-issue wait the repair-order specs share.
import { expect } from '@playwright/test'
import type { ApiClient } from '../api/client.js'
import type { StockIssue, Supplier } from '../api/types.js'

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
