import { expect, type Locator, type Page } from '@playwright/test'

export type GoodsReceiptLineInput = {
  /** The part's SKU, picked from the "Add a part" search. */
  sku: string
  quantity?: string
  /** The abbreviation of a packaging unit (e.g. "case"); default the base unit. */
  unit?: string
  unitCost?: string
  /** The line's own supplier (name); left out it takes the receipt's. */
  supplier?: string
}

/** The goods receipt editor at /inventory/receipts/new and /inventory/receipts/:id (E2E-INV-011..015). */
export class GoodsReceiptPage {
  readonly defaultSupplier: Locator
  readonly addPart: Locator
  readonly deliveryNote: Locator
  readonly saveDraftButton: Locator
  readonly completeButton: Locator
  readonly reverseButton: Locator
  readonly cancelButton: Locator
  readonly supplierNeededHint: Locator
  readonly status: Locator

  constructor(readonly page: Page) {
    this.defaultSupplier = page.getByLabel('Supplier', { exact: true })
    this.addPart = page.getByLabel('Add a part', { exact: true })
    this.deliveryNote = page.getByLabel('Delivery note no.')
    this.saveDraftButton = page.getByRole('button', { name: 'Save draft' })
    this.completeButton = page.getByRole('button', { name: 'Complete receipt' })
    this.reverseButton = page.getByRole('button', { name: 'Reverse receipt' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel receipt' })
    this.supplierNeededHint = page.getByText('Every line needs a supplier before the receipt can be completed.')
    this.status = page
      .getByRole('heading', { level: 1 })
      .locator('..')
      .getByText(/^(Draft|Completed|Cancelled)$/)
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/inventory/receipts/new')
  }

  async goto(receiptId: string): Promise<void> {
    await this.page.goto(`/inventory/receipts/${receiptId}`)
  }

  /** The id of the saved receipt, read from the URL once the editor has moved off /new. */
  async savedId(): Promise<string> {
    await expect(this.page).toHaveURL(/\/inventory\/receipts\/(?!new)[^/?]+$/)
    return new URL(this.page.url()).pathname.split('/').pop() ?? ''
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  /** Picks a supplier by name in a search-select field. */
  private async pickSupplier(field: Locator, name: string): Promise<void> {
    await field.fill(name)
    await this.page.getByRole('listbox').getByRole('option', { name }).first().click()
  }

  async chooseDefaultSupplier(name: string): Promise<void> {
    await this.pickSupplier(this.defaultSupplier, name)
  }

  async chooseLineSupplier(index: number, name: string): Promise<void> {
    await this.pickSupplier(this.lineRow(index).locator('input[role="combobox"]'), name)
  }

  /** Adds a part by SKU and fills the new line (the next free row). */
  async addLine(line: GoodsReceiptLineInput): Promise<void> {
    const index = await this.page.locator('table tbody tr').count()
    await this.addPart.fill(line.sku)
    await this.page.getByRole('listbox').getByRole('option', { name: line.sku }).first().click()
    await expect(this.lineRow(index)).toContainText(line.sku)
    await this.fillLine(index, line)
  }

  async fillLine(index: number, line: Omit<GoodsReceiptLineInput, 'sku'>): Promise<void> {
    const row = this.lineRow(index)
    // aria-labels carry the 1-based line number.
    if (line.unit) await row.getByLabel(`Quantity ${index + 1} (Unit)`).selectOption({ label: line.unit })
    if (line.quantity) await row.getByLabel(`Quantity ${index + 1}`, { exact: true }).fill(line.quantity)
    if (line.unitCost) await row.getByLabel(`Unit cost (VND) ${index + 1}`).fill(line.unitCost)
    if (line.supplier) await this.chooseLineSupplier(index, line.supplier)
  }

  async saveDraft(): Promise<void> {
    const saved = this.page.waitForResponse(
      (r) => ['POST', 'PATCH'].includes(r.request().method()) && /\/goods-receipts(\/[^/:]+)?$/.test(new URL(r.url()).pathname) && r.ok(),
    )
    await this.saveDraftButton.click()
    await saved
  }

  async complete(): Promise<void> {
    const done = this.page.waitForResponse((r) => r.url().endsWith(':complete') && r.ok())
    await this.completeButton.click()
    await done
  }

  /** Reverses a completed receipt (or cancels a draft) and confirms the dialog. */
  async confirmReverse(button: Locator = this.reverseButton): Promise<void> {
    await button.click()
    const dialog = this.page.getByRole('dialog')
    const done = this.page.waitForResponse((r) => r.url().endsWith(':cancel') && r.ok())
    await dialog.getByRole('button', { name: /^(Reverse|Cancel) receipt$/ }).click()
    await done
  }
}
