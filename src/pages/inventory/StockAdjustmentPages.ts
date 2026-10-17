import { expect, type Locator, type Page } from '@playwright/test'

// Release 7.1 screens of the Inventory area: stock counts, write-offs and supplier
// returns (E2E-INV-020 to 029). Each document has a list tab on /inventory and a page
// of its own; the page objects here drive the page, and `InventoryPage` the tabs.

/** Picks a part by SKU in the "Add a part" search field. */
async function pickPart(page: Page, field: Locator, sku: string): Promise<void> {
  await field.fill(sku)
  await page.getByRole('listbox').getByRole('option', { name: sku }).first().click()
}

/** The id at the end of a document's URL, once the page has moved off /new. */
async function savedId(page: Page, path: string): Promise<string> {
  await expect(page).toHaveURL(new RegExp(`/inventory/${path}/(?!new)[^/?]+$`))
  return new URL(page.url()).pathname.split('/').pop() ?? ''
}

/** A row of a document list tab, found by the document number. */
export function documentRow(page: Page, number: string): Locator {
  return page.locator('tbody tr', { hasText: number })
}

/** The stock count page at /inventory/stock-counts/:id. */
export class StockCountPage {
  readonly addPart: Locator
  readonly completeButton: Locator
  readonly cancelButton: Locator
  readonly downloadExcelButton: Locator
  readonly status: Locator
  readonly summary: Locator

  constructor(readonly page: Page) {
    this.addPart = page.getByLabel('Add a part', { exact: true })
    this.completeButton = page.getByRole('button', { name: 'Complete count' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel count' })
    this.downloadExcelButton = page.getByRole('button', { name: 'Download Excel' })
    this.status = page
      .getByRole('heading', { level: 1 })
      .locator('..')
      .getByText(/^(Draft|Completed|Cancelled)$/)
    this.summary = page.getByLabel('Count summary')
  }

  async goto(countId: string): Promise<void> {
    await this.page.goto(`/inventory/stock-counts/${countId}`)
  }

  /** The count's number, from the page title. */
  async number(): Promise<string> {
    return (await this.page.getByRole('heading', { level: 1 }).innerText()).trim()
  }

  /** The row of a part (by SKU) in the count lines. */
  lineRow(sku: string): Locator {
    return this.page.getByRole('table', { name: 'Count lines' }).locator('tbody tr', { hasText: sku })
  }

  countedInput(sku: string): Locator {
    return this.page.getByLabel(new RegExp(`^Counted \\d+: ${sku}$`))
  }

  async addPartBySku(sku: string): Promise<void> {
    const added = this.page.waitForResponse((r) => r.request().method() === 'POST' && r.url().endsWith('/lines') && r.ok())
    await pickPart(this.page, this.addPart, sku)
    await added
    await expect(this.lineRow(sku)).toBeVisible()
  }

  /** Types the counted quantity of a line; it is saved when the field is left. */
  async count(sku: string, quantity: string): Promise<void> {
    const saved = this.page.waitForResponse((r) => r.request().method() === 'PATCH' && /\/lines\/[^/]+$/.test(r.url()) && r.ok())
    const input = this.countedInput(sku)
    await input.fill(quantity)
    await input.press('Enter')
    await saved
  }

  /** Chooses Complete count and confirms in the dialog (the label there depends on uncounted lines). */
  async complete(): Promise<void> {
    await this.completeButton.click()
    const done = this.page.waitForResponse((r) => r.url().endsWith(':complete') && r.ok())
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /^(Complete count|Skip uncounted and complete)$/ })
      .click()
    await done
  }

  /** Cancels a draft count and confirms; the app returns to the list. */
  async cancelDraft(): Promise<void> {
    await this.cancelButton.click()
    const done = this.page.waitForResponse((r) => r.url().endsWith(':cancel') && r.ok())
    await this.page.getByRole('dialog').getByRole('button', { name: 'Cancel count' }).click()
    await done
  }
}

/** The "New stock count" dialog on the Stock counts tab. */
export class NewStockCountDialog {
  readonly dialog: Locator

  constructor(readonly page: Page) {
    this.dialog = page.getByRole('dialog')
  }

  /** Creates the count and returns its id once the app has opened it. */
  async create(input: { name: string; notes?: string }): Promise<string> {
    await this.dialog.getByLabel('Name').fill(input.name)
    if (input.notes) await this.dialog.getByLabel('Note').fill(input.notes)
    await this.dialog.getByRole('button', { name: 'Create count' }).click()
    return savedId(this.page, 'stock-counts')
  }
}

/** The write-off form (/inventory/write-offs/new) and view (/inventory/write-offs/:id). */
export class WriteOffPage {
  readonly reason: Locator
  readonly notes: Locator
  readonly addPart: Locator
  readonly postButton: Locator
  readonly cancelButton: Locator
  readonly cancelledNotice: Locator

  constructor(readonly page: Page) {
    this.reason = page.getByLabel('Reason', { exact: true })
    this.notes = page.getByLabel('Note', { exact: true })
    this.addPart = page.getByLabel('Add a part', { exact: true })
    this.postButton = page.getByRole('button', { name: 'Post write-off' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel write-off' })
    this.cancelledNotice = page.getByText('This write-off was cancelled; its stock was put back.')
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/inventory/write-offs/new')
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  async addLine(sku: string, quantity: string): Promise<void> {
    const index = await this.page.locator('table tbody tr').count()
    await pickPart(this.page, this.addPart, sku)
    await expect(this.lineRow(index)).toContainText(sku)
    await this.lineRow(index)
      .getByLabel(`Quantity ${index + 1}`, { exact: true })
      .fill(quantity)
  }

  /** Posts the write-off; resolves with the id of the saved document. */
  async post(): Promise<string> {
    await this.postButton.click()
    return savedId(this.page, 'write-offs')
  }

  /** Cancels a posted write-off and confirms; the app returns to the list. */
  async cancel(): Promise<void> {
    await this.cancelButton.click()
    const done = this.page.waitForResponse((r) => r.url().endsWith(':cancel') && r.ok())
    await this.page.getByRole('dialog').getByRole('button', { name: 'Cancel write-off' }).click()
    await done
  }
}

/** The supplier return form (/inventory/supplier-returns/new) and view (/inventory/supplier-returns/:id). */
export class SupplierReturnPage {
  readonly supplier: Locator
  readonly goodsReceipt: Locator
  readonly creditNote: Locator
  readonly addPart: Locator
  readonly postButton: Locator
  readonly cancelButton: Locator
  readonly cancelledNotice: Locator

  constructor(readonly page: Page) {
    this.supplier = page.getByLabel('Supplier', { exact: true })
    this.goodsReceipt = page.getByLabel('Goods receipt', { exact: true })
    this.creditNote = page.getByLabel('Supplier credit note no.')
    this.addPart = page.getByLabel('Add a part', { exact: true })
    this.postButton = page.getByRole('button', { name: 'Post return' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel return' })
    this.cancelledNotice = page.getByText('This return was cancelled; its stock was put back.')
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/inventory/supplier-returns/new')
  }

  lineRow(index: number): Locator {
    return this.page.locator('table tbody tr').nth(index)
  }

  async chooseSupplier(name: string): Promise<void> {
    await this.supplier.fill(name)
    await this.page.getByRole('listbox').getByRole('option', { name }).first().click()
  }

  /** Links a completed receipt of the chosen supplier, by its number. */
  async chooseReceipt(number: string): Promise<void> {
    await this.goodsReceipt.fill(number)
    await this.page.getByRole('listbox').getByRole('option', { name: number }).first().click()
  }

  /** Adds a part line; `credit` is the credit per unit, left out for "Automatic". */
  async addLine(sku: string, quantity: string, credit?: string): Promise<void> {
    const index = await this.page.locator('table tbody tr').count()
    await pickPart(this.page, this.addPart, sku)
    await expect(this.lineRow(index)).toContainText(sku)
    await this.lineRow(index)
      .getByLabel(`Quantity ${index + 1}`, { exact: true })
      .fill(quantity)
    if (credit)
      await this.lineRow(index)
        .getByLabel(`Credit per unit (VND) ${index + 1}`)
        .fill(credit)
  }

  /** Posts the return; resolves with the id of the saved document. */
  async post(): Promise<string> {
    await this.postButton.click()
    return savedId(this.page, 'supplier-returns')
  }

  /** Cancels a posted return and confirms; the app returns to the list. */
  async cancel(): Promise<void> {
    await this.cancelButton.click()
    const done = this.page.waitForResponse((r) => r.url().endsWith(':cancel') && r.ok())
    await this.page.getByRole('dialog').getByRole('button', { name: 'Cancel return' }).click()
    await done
  }
}
