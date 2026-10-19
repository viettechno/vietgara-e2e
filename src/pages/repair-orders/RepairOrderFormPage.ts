import type { Locator, Page } from '@playwright/test'

/** The stock issue card of a repair order (E2E-INV-015): the draft that reserves its parts. */
export class StockIssueCard {
  readonly title: Locator
  readonly status: Locator
  readonly lines: Locator
  readonly issueNowButton: Locator
  readonly returnPartsButton: Locator
  /** The card's table of parts already returned to stock (Release 7.1). */
  readonly returnedParts: Locator

  constructor(page: Page) {
    this.title = page.getByRole('heading', { name: /^Stock issue \S+$/ })
    // The card's panel: the nearest ancestor of its title that holds both the PDF button and the lines table.
    const card = this.title.locator('xpath=ancestor::*[.//button[normalize-space()="Export PDF"] and .//table][1]')
    this.status = card.getByText(/^(Draft|Posted|Cancelled)$/)
    this.lines = card.getByRole('table', { name: 'Stock issue lines' }).locator('tbody tr')
    this.issueNowButton = card.getByRole('button', { name: 'Issue now' })
    this.returnPartsButton = card.getByRole('button', { name: 'Return parts' })
    this.returnedParts = card.getByRole('table', { name: 'Returned parts' }).locator('tbody tr')
  }
}

export type RepairOrderLineInput = {
  itemType: 'Labor' | 'Part'
  description: string
  quantity: string
  unitPrice: string
  partSku?: string
  /** The abbreviation of the unit the quantity is typed in (a packaging unit of the picked part). */
  unit?: string
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
    await this.page.getByRole('listbox').getByRole('option', { name: optionText }).first().click()
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  async fillLine(index: number, line: RepairOrderLineInput): Promise<void> {
    const row = this.lineRow(index)
    await row
      .locator('select')
      .first()
      .selectOption(line.itemType === 'Part' ? 'REPAIR_ORDER_ITEM_TYPE_PART' : 'REPAIR_ORDER_ITEM_TYPE_LABOR')
    if (line.itemType === 'Part' && line.partSku) {
      const partField = row.locator('input[role="combobox"]')
      await partField.fill(line.partSku)
      await this.page.getByRole('listbox').getByRole('option', { name: line.partSku }).first().click()
    }
    const inputs = row.locator('input:not([role="combobox"]):not([readonly])')
    await inputs.nth(0).fill(line.description)
    if (line.unit) await row.locator('select').nth(1).selectOption({ label: line.unit })
    await inputs.nth(1).fill(line.quantity)
    await inputs.nth(2).fill(line.unitPrice)
  }

  async addLine(line: RepairOrderLineInput): Promise<void> {
    const before = await this.page.locator('table tbody tr').count()
    await this.addLineButton.click()
    await this.fillLine(before, line)
  }
}

/** The repair order detail/Kanban-card page at /repair-orders/:id (E2E-REP-003..012). */
export class RepairOrderDetailPage {
  readonly closeButton: Locator
  readonly addLineButton: Locator
  readonly cancelButton: Locator
  readonly createSettlementButton: Locator
  readonly viewSettlementLink: Locator
  readonly stockIssue: StockIssueCard

  constructor(readonly page: Page) {
    this.stockIssue = new StockIssueCard(page)
    this.closeButton = page.getByRole('button', { name: 'Close repair order' })
    this.addLineButton = page.getByRole('button', { name: 'Add line item' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel repair order', exact: true })
    // A closed order offers settlement creation (E2E-BIL-001); the link to
    // the new settlement appears once it exists.
    this.createSettlementButton = page.getByRole('button', { name: 'Create settlement' })
    this.viewSettlementLink = page.getByRole('link', { name: 'View settlement' })
  }

  async goto(orderId: string): Promise<void> {
    await this.page.goto(`/repair-orders/${orderId}`)
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  async setLineStatus(index: number, status: 'Not started' | 'In progress' | 'Completed'): Promise<void> {
    // Scope to the Status select: the row also holds the item-type select.
    await this.lineRow(index).getByLabel('Status').selectOption({ label: status })
  }

  async assignTechnician(index: number, technicianName: string): Promise<void> {
    await this.lineRow(index).getByRole('checkbox', { name: technicianName }).check()
  }

  async unassignTechnician(index: number, technicianName: string): Promise<void> {
    await this.lineRow(index).getByRole('checkbox', { name: technicianName }).uncheck()
  }

  async saveLine(index: number): Promise<void> {
    // Wait for the PATCH to land: a test that navigates straight after the click
    // would otherwise cancel the save.
    const saved = this.page.waitForResponse((r) => r.request().method() === 'PATCH' && /\/lines\//.test(r.url()))
    await this.lineRow(index).getByRole('button', { name: 'Save', exact: true }).click()
    await saved
  }

  // ---- Line changes on an open order (E2E-REP-013) ------------------------

  editLineButton(description: string): Locator {
    return this.page.getByRole('button', { name: `Edit line: ${description}` })
  }

  removeLineButton(description: string): Locator {
    return this.page.getByRole('button', { name: `Remove line: ${description}` })
  }

  /** Fills the add/edit line dialog that is open and saves it. A part is picked by SKU. */
  async saveLineDialog(input: {
    itemType?: 'Labor' | 'Part'
    partSku?: string
    description?: string
    quantity?: string
    unit?: string
    unitPrice?: string
  }): Promise<void> {
    const dialog = this.page.getByRole('dialog')
    if (input.itemType) {
      await dialog
        .getByLabel('Type', { exact: true })
        .selectOption(input.itemType === 'Part' ? 'REPAIR_ORDER_ITEM_TYPE_PART' : 'REPAIR_ORDER_ITEM_TYPE_LABOR')
    }
    if (input.partSku) {
      await dialog.locator('input[role="combobox"]').fill(input.partSku)
      await this.page.getByRole('listbox').getByRole('option', { name: input.partSku }).first().click()
    }
    if (input.description !== undefined) await dialog.getByRole('textbox').fill(input.description)
    if (input.unit) await dialog.getByLabel('Quantity (Unit)').selectOption({ label: input.unit })
    if (input.quantity !== undefined) await dialog.getByRole('spinbutton').first().fill(input.quantity)
    if (input.unitPrice !== undefined) await dialog.getByRole('spinbutton').last().fill(input.unitPrice)
    const saved = this.page.waitForResponse((r) => r.request().method() !== 'GET' && /\/repair-orders\/[^/]+\/lines/.test(r.url()))
    await dialog.getByRole('button', { name: 'Save', exact: true }).click()
    await saved
  }

  /** Removes a line through the confirmation. */
  async removeLine(description: string): Promise<void> {
    await this.removeLineButton(description).click()
    const removed = this.page.waitForResponse((r) => r.request().method() === 'DELETE' && /\/lines\//.test(r.url()))
    await this.page.getByRole('dialog').getByRole('button', { name: 'Remove line', exact: true }).click()
    await removed
  }

  /** Cancels the order through the confirmation. */
  async cancelOrder(): Promise<void> {
    await this.cancelButton.click()
    await this.page.getByRole('dialog').getByRole('button', { name: 'Cancel the order' }).click()
  }
}
