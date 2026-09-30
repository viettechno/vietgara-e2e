import type { Locator, Page } from '@playwright/test'

/** Stock on Hand / Stock Movements at /inventory (E2E-INV-*). */
export class InventoryPage {
  readonly newItemButton: Locator
  readonly stockOnHandTab: Locator
  readonly stockMovementsTab: Locator

  constructor(readonly page: Page) {
    this.newItemButton = page.getByRole('button', { name: 'New item' })
    this.stockOnHandTab = page.getByRole('tab', { name: 'Stock on Hand' })
    this.stockMovementsTab = page.getByRole('tab', { name: 'Stock Movements' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory')
  }

  async createItem(input: { sku: string; name: string; unit?: string; reorderThreshold?: number }): Promise<void> {
    await this.newItemButton.click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('SKU', { exact: true }).fill(input.sku)
    await dialog.getByLabel('Name', { exact: true }).fill(input.name)
    if (input.unit) await dialog.getByLabel('Unit', { exact: true }).fill(input.unit)
    if (input.reorderThreshold !== undefined) await dialog.getByLabel('Reorder threshold').fill(String(input.reorderThreshold))
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  itemRow(sku: string): Locator {
    return this.page.locator('tbody tr', { hasText: sku })
  }

  async receiveStock(sku: string, input: { quantity: string; unitCost?: string }): Promise<void> {
    await this.itemRow(sku).getByRole('button', { name: 'Receive stock' }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Quantity received').fill(input.quantity)
    if (input.unitCost) await dialog.getByLabel('Unit cost (VND)').fill(input.unitCost)
    await dialog.getByRole('button', { name: 'Receive stock' }).click()
  }
}
