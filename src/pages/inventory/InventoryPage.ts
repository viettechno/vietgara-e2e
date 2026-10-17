import { expect, type Locator, type Page } from '@playwright/test'
import { GoodsReceiptPage } from './GoodsReceiptPage.js'

/** Inventory at /inventory: Stock on Hand, Goods receipts, Stock Movements, Purchases, Stock valuation (E2E-INV-*, E2E-CAT-002). */
export class InventoryPage {
  readonly stockOnHandTab: Locator
  readonly goodsReceiptsTab: Locator
  readonly stockMovementsTab: Locator
  readonly purchasesTab: Locator
  readonly valuationTab: Locator
  readonly lowStockOnly: Locator
  readonly categoryFilter: Locator
  readonly brandFilter: Locator
  readonly exportExcelButton: Locator

  constructor(readonly page: Page) {
    this.stockOnHandTab = page.getByRole('tab', { name: 'Stock on Hand' })
    this.goodsReceiptsTab = page.getByRole('tab', { name: 'Goods receipts' })
    this.stockMovementsTab = page.getByRole('tab', { name: 'Stock Movements' })
    this.purchasesTab = page.getByRole('tab', { name: 'Purchases' })
    this.valuationTab = page.getByRole('tab', { name: 'Stock valuation' })
    this.lowStockOnly = page.getByRole('switch', { name: 'Low stock only' })
    this.categoryFilter = page.getByRole('combobox', { name: 'Category' })
    this.brandFilter = page.getByRole('searchbox', { name: 'Brand' }).or(page.getByLabel('Brand', { exact: true }))
    this.exportExcelButton = page.getByRole('button', { name: 'Export Excel' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory')
  }

  /** The stock row of a part (by SKU). */
  partRow(sku: string): Locator {
    return this.page.locator('tbody tr', { hasText: sku })
  }

  /**
   * Receives stock the Release 7.0 way: the row action opens a new goods receipt with the
   * part on it; every line needs a supplier (here the receipt's, by name), then it is completed.
   * `unit` is the abbreviation of a packaging unit (e.g. "case"), default the base unit.
   */
  async receiveStock(sku: string, input: { quantity: string; supplier: string; unit?: string; unitCost?: string }): Promise<void> {
    await this.partRow(sku)
      .getByRole('button', { name: new RegExp(`^Receive stock: ${sku}$`) })
      .click()
    const receipt = new GoodsReceiptPage(this.page)
    await expect(receipt.lineRow(0)).toContainText(sku)
    await receipt.chooseDefaultSupplier(input.supplier)
    await receipt.fillLine(0, { quantity: input.quantity, unit: input.unit, unitCost: input.unitCost })
    await receipt.complete()
    // Back on the receipt list after completing; return to the stock list.
    await this.goto()
  }
}
