// API-only setup chain for the settlement specs (E2E-BIL-*): a closed
// repair order, then its settlement. The UI under test starts at the closed
// order (E2E-BIL-001) or the pending settlement (E2E-BIL-003/008); the chain
// itself is E2E-QUO-010 + E2E-REP-008's path, not these specs' subject.
//
// Lines mirror the suite's flagship numbers: 250,000 + 4 × 180,000 = 970,000.
import type { ApiClient } from '../api/client.js'
import { newIdempotencyKey } from '../api/client.js'
import type { RepairOrder, Settlement } from '../api/types.js'

export const CHAIN_TOTAL = '970,000'

export async function closedRepairOrder(
  api: ApiClient,
  garageId: string,
  customerId: string,
  vehicleId: string,
): Promise<RepairOrder> {
  const order = await api.createRepairOrder(garageId, {
    vehicleId,
    lines: [
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' },
      { itemType: 'REPAIR_ORDER_ITEM_TYPE_PART', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000' },
    ],
  })
  for (const line of order.lines ?? []) {
    await api.updateRepairOrderLine(garageId, order.id ?? '', line.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
      assignedTechnicianIds: [],
    })
  }
  return api.closeRepairOrder(garageId, order.id ?? '')
}

export async function pendingSettlement(api: ApiClient, garageId: string, orderId: string): Promise<Settlement> {
  return api.createSettlement(garageId, orderId, newIdempotencyKey())
}
