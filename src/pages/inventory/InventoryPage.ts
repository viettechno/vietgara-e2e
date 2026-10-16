import { expect, type Locator, type Page } from '@playwright/test'

/** Stock on Hand / Stock Movements at /inventory (E2E-INV-*, E2E-CAT-002). */
export class InventoryPage {
  readonly stockOnHandTab: Locator
  readonly stockMovementsTab: Locator
  readonly lowStockOnly: Locator
  readonly categoryFilter: Locator
  readonly brandFilter: Locator
  readonly exportExcelButton: Locator

  constructor(readonly page: Page) {
    this.stockOnHandTab = page.getByRole('tab', { name: 'Stock on Hand' })
    this.stockMovementsTab = page.getByRole('tab', { name: 'Stock Movements' })
    this.lowStockOnly = page.getByRole('switch', { name: 'Low stock only' })
    this.categoryFilter = page.getByRole('combobox', { name: 'Category' })
    this.brandFilter = page.getByRole('searchbox', { name: 'Brand' }).or(page.getByLabel('Brand', { exact: true }))
    this.exportExcelButton = page.getByRole('button', { name: 'Export Excel' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory')
  }

  /** The stock row of a part (by SKU). */
  itemRow(sku: string): Locator {
    return this.page.locator('tbody tr', { hasText: sku })
  }

  /** Receives stock; `unit` is the visible text of a packaging unit (e.g. "Case (case)"), default the base unit. */
  async receiveStock(sku: string, input: { quantity: string; unit?: string | RegExp; unitCost?: string }): Promise<void> {
    await this.itemRow(sku)
      .getByRole('button', { name: new RegExp(`^Receive stock: ${sku}$`) })
      .click()
    const dialog = this.page.getByRole('dialog')
    if (input.unit) {
      // The packaging units arrive with the part; wait for them before choosing.
      const unitSelect = dialog.getByRole('combobox')
      const wanted = input.unit instanceof RegExp ? input.unit : new RegExp(`^${input.unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
      await expect.poll(async () => (await unitSelect.locator('option').allTextContents()).some((label) => wanted.test(label))).toBe(true)
      await unitSelect.selectOption({ label: input.unit instanceof RegExp ? await matchOption(unitSelect, input.unit) : input.unit })
    }
    await dialog.getByLabel('Quantity received').fill(input.quantity)
    if (input.unitCost) await dialog.getByLabel(/^Unit cost per/).fill(input.unitCost)
    await dialog.getByRole('button', { name: 'Receive stock' }).click()
  }
}

async function matchOption(select: Locator, pattern: RegExp): Promise<string> {
  const labels = await select.locator('option').allTextContents()
  const found = labels.find((label) => pattern.test(label))
  if (!found) throw new Error(`no option matches ${pattern}: ${labels.join(' | ')}`)
  return found
}
