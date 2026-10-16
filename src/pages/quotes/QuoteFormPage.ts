import type { Locator, Page } from '@playwright/test'

export type QuoteLineInput = {
  itemType: 'Labor' | 'Part'
  description: string
  quantity: string
  unitPrice: string
  /** Picks this catalogue part (by SKU) on a Part line: prefills the description and the price. */
  partSku?: string
  /** The abbreviation of the unit the quantity is typed in (a packaging unit of the picked part). */
  unit?: string
}

/** The quote create/detail page at /quotes/new and /quotes/:id (E2E-QUO-*). */
export class QuoteFormPage {
  readonly customerField: Locator
  readonly vehicleField: Locator
  readonly addLineButton: Locator
  readonly saveButton: Locator
  readonly sendButton: Locator
  readonly convertButton: Locator
  readonly deleteButton: Locator
  readonly exportPdfButton: Locator

  constructor(readonly page: Page) {
    // The Phase-5.1 CustomerPicker does not take the Field label's id, so
    // the input has no label association; locate it by its placeholder
    // (the suite pins the UI to English in fixtures). Vehicle still uses
    // the labelled SearchSelect. (Owner-web follow-up: pass the Field id
    // into CustomerPicker to restore the association.)
    this.customerField = page.getByPlaceholder('Search by name, phone, e-mail or plate…')
    this.vehicleField = page.getByLabel('Vehicle', { exact: true })
    this.addLineButton = page.getByRole('button', { name: 'Add line item' })
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true })
    this.sendButton = page.getByRole('button', { name: 'Send for approval' })
    this.convertButton = page.getByRole('button', { name: 'Convert to repair order' })
    this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true })
    this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/quotes/new')
  }

  async open(quoteId: string): Promise<void> {
    await this.page.goto(`/quotes/${quoteId}`)
  }

  /** Types into a SearchSelect field and picks the option whose visible text contains `optionText`. */
  async pickSearchSelect(field: Locator, query: string, optionText: string): Promise<void> {
    await field.fill(query)
    await this.page.getByRole('listbox').getByRole('option', { name: optionText }).first().click()
  }

  /** Picks a customer in the Phase-5.1 CustomerPicker: type, then press the
   * row's "Use this profile" button. Rows render without listbox/option
   * roles, so selection goes by row text, not by role. */
  async pickCustomer(query: string, optionText: string): Promise<void> {
    await this.customerField.fill(query)
    const row = this.page.locator('li', { hasText: optionText }).first()
    await row.getByRole('button', { name: 'Use this profile' }).click()
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  async fillLine(index: number, line: QuoteLineInput): Promise<void> {
    const row = this.lineRow(index)
    await row
      .locator('select')
      .first()
      .selectOption(line.itemType === 'Part' ? 'QUOTE_ITEM_TYPE_PART' : 'QUOTE_ITEM_TYPE_LABOR')
    if (line.itemType === 'Part' && line.partSku) {
      await row.locator('input[role="combobox"]').fill(line.partSku)
      await this.page.getByRole('listbox').getByRole('option', { name: line.partSku }).first().click()
    }
    // The part picker (a combobox, then a read-only field) is not a data input.
    const inputs = row.locator('input:not([role="combobox"]):not([readonly])')
    await inputs.nth(0).fill(line.description)
    if (line.unit) await row.locator('select').nth(1).selectOption({ label: line.unit })
    await inputs.nth(1).fill(line.quantity)
    await inputs.nth(2).fill(line.unitPrice)
  }

  async addLine(line: QuoteLineInput): Promise<void> {
    const before = await this.page.locator('table tbody tr').count()
    await this.addLineButton.click()
    await this.fillLine(before, line)
  }

  lineTotalText(index: number): Locator {
    return this.lineRow(index).locator('td').nth(4)
  }
}
