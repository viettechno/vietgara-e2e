import type { Locator, Page } from '@playwright/test'

export type RepairOrderLineInput = {
  itemType: 'Labor' | 'Part'
  description: string
  quantity: string
  unitPrice: string
  itemSku?: string
}

/** The repair order create page at /repair-orders/new (E2E-REP-001/002). */
export class RepairOrderCreateForm {
  readonly vehicleField: Locator
  readonly addLineButton: Locator
  readonly createButton: Locator

  constructor(readonly page: Page) {
    this.vehicleField = page.getByLabel('Vehicle', { exact: true })
    this.addLineButton = page.getByRole('button', { name: 'Add line item' })
    this.createButton = page.getByRole('button', { name: 'Create', exact: true })
  }

  async goto(): Promise<void> {
    await this.page.goto('/repair-orders/new')
  }

  async pickVehicle(query: string, optionText: string): Promise<void> {
    await this.vehicleField.fill(query)
    await this.page.getByRole('listbox').getByRole('button', { name: optionText }).first().click()
  }

  lineRow(index: number): Locator {
    return this.page.locator('.line-items-table tbody tr').nth(index)
  }

  async fillLine(index: number, line: RepairOrderLineInput): Promise<void> {
    const row = this.lineRow(index)
    await row.locator('select').selectOption(line.itemType === 'Part' ? 'REPAIR_ORDER_ITEM_TYPE_PART' : 'REPAIR_ORDER_ITEM_TYPE_LABOR')
    if (line.itemType === 'Part' && line.itemSku) {
      const itemField = row.locator('input[type="search"]')
      await itemField.fill(line.itemSku)
      await this.page.getByRole('listbox').getByRole('button', { name: line.itemSku }).first().click()
    }
    const inputs = row.locator('input:not([type="search"])')
    await inputs.nth(0).fill(line.description)
    await inputs.nth(1).fill(line.quantity)
    await inputs.nth(2).fill(line.unitPrice)
  }

  async addLine(line: RepairOrderLineInput): Promise<void> {
    const before = await this.page.locator('.line-items-table tbody tr').count()
    await this.addLineButton.click()
    await this.fillLine(before, line)
  }
}

/** The repair order detail/Kanban-card page at /repair-orders/:id (E2E-REP-003..012). */
export class RepairOrderDetailPage {
  readonly closeButton: Locator

  constructor(readonly page: Page) {
    this.closeButton = page.getByRole('button', { name: 'Close repair order' })
  }

  async goto(orderId: string): Promise<void> {
    await this.page.goto(`/repair-orders/${orderId}`)
  }

  lineRow(index: number): Locator {
    return this.page.locator('.line-items-table tbody tr').nth(index)
  }

  async setLineStatus(index: number, status: 'Not started' | 'In progress' | 'Completed'): Promise<void> {
    await this.lineRow(index).locator('select').selectOption({ label: status })
  }

  async assignTechnician(index: number, technicianName: string): Promise<void> {
    await this.lineRow(index).getByRole('checkbox', { name: technicianName }).check()
  }

  async saveLine(index: number): Promise<void> {
    await this.lineRow(index).getByRole('button', { name: 'Save', exact: true }).click()
  }
}
