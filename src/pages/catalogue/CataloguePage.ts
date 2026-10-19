import type { Locator, Page } from '@playwright/test'

/** The Catalogue at /catalogue: parts, units and categories (E2E-CAT-*). */
export class CataloguePage {
  readonly partsTab: Locator
  readonly unitsTab: Locator
  readonly categoriesTab: Locator
  readonly jobsTab: Locator
  readonly newPartButton: Locator
  readonly newUnitButton: Locator
  readonly newCategoryButton: Locator
  readonly newJobButton: Locator
  readonly showInactive: Locator

  constructor(readonly page: Page) {
    this.partsTab = page.getByRole('tab', { name: 'Parts' })
    this.unitsTab = page.getByRole('tab', { name: 'Units' })
    this.categoriesTab = page.getByRole('tab', { name: 'Categories' })
    this.jobsTab = page.getByRole('tab', { name: 'Jobs' })
    this.newPartButton = page.getByRole('button', { name: 'New part' })
    this.newUnitButton = page.getByRole('button', { name: 'New unit' })
    this.newCategoryButton = page.getByRole('button', { name: 'New category' })
    this.newJobButton = page.getByRole('button', { name: 'New job' })
    this.showInactive = page.getByRole('switch', { name: 'Show inactive items' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/catalogue')
  }

  row(text: string): Locator {
    return this.page.locator('tbody tr', { hasText: text })
  }

  async createUnit(name: string, abbreviation: string): Promise<void> {
    await this.unitsTab.click()
    await this.newUnitButton.first().click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Name', { exact: true }).fill(name)
    await dialog.getByLabel('Abbreviation').fill(abbreviation)
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  async createCategory(name: string, parent?: string): Promise<void> {
    await this.categoriesTab.click()
    await this.newCategoryButton.first().click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Name', { exact: true }).fill(name)
    if (parent) {
      // The options are indented by depth, so match on the name inside the label.
      const select = dialog.getByLabel('Parent category')
      const labels = await select.locator('option').allTextContents()
      await select.selectOption({ label: labels.find((label) => label.trim().endsWith(parent)) ?? parent })
    }
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  async createPart(input: {
    sku: string
    name: string
    baseUnit?: string
    salePrice?: string
    category?: string
    brand?: string
    reorderThreshold?: string
  }): Promise<void> {
    await this.partsTab.click()
    await this.newPartButton.first().click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('SKU', { exact: true }).fill(input.sku)
    await dialog.getByLabel('Name', { exact: true }).fill(input.name)
    if (input.baseUnit) await dialog.getByLabel('Base unit', { exact: true }).selectOption({ label: input.baseUnit })
    if (input.salePrice) await dialog.getByLabel('Selling price per base unit (VND)').fill(input.salePrice)
    if (input.category) await dialog.getByLabel('Category', { exact: true }).selectOption({ label: input.category })
    if (input.brand) await dialog.getByLabel('Brand', { exact: true }).fill(input.brand)
    if (input.reorderThreshold) await dialog.getByLabel('Reorder threshold').fill(input.reorderThreshold)
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  async openPackaging(sku: string): Promise<Locator> {
    await this.row(sku)
      .getByRole('button', { name: `Packaging: ${sku}` })
      .click()
    return this.page.getByRole('dialog')
  }

  async openImages(sku: string): Promise<Locator> {
    await this.row(sku)
      .getByRole('button', { name: `Images: ${sku}` })
      .click()
    return this.page.getByRole('dialog')
  }

  // ---- Jobs (E2E-CAT-010/011) ---------------------------------------------

  async openJobs(): Promise<void> {
    await this.jobsTab.click()
  }

  /** Fills the job form that is open; `parts` are added in order, each picked by SKU. */
  async fillJob(input: {
    name?: string
    category?: string
    laborPrice?: string
    duration?: string
    parts?: Array<{ sku: string; quantity: string; unit?: string; hidden?: boolean }>
  }): Promise<void> {
    const dialog = this.page.getByRole('dialog')
    if (input.name !== undefined) await dialog.getByLabel('Job', { exact: true }).fill(input.name)
    if (input.category !== undefined) await dialog.getByLabel('Category', { exact: true }).fill(input.category)
    if (input.laborPrice !== undefined) await dialog.getByLabel('Labor price').fill(input.laborPrice)
    if (input.duration !== undefined) await dialog.getByLabel('Duration').fill(input.duration)
    for (const part of input.parts ?? []) {
      const index = (await dialog.getByRole('button', { name: /^Remove part \d+$/ }).count()) + 1
      await dialog.getByRole('button', { name: 'Add a part' }).click()
      // A part that is picked turns its search box into a read-only field, so the new row has the only one.
      await dialog.locator('input[role="combobox"]').fill(part.sku)
      await this.page.getByRole('listbox').getByRole('option', { name: part.sku }).first().click()
      await this.setJobPart(index, part)
    }
  }

  /** Sets the quantity, unit and hidden mark of the suggested part number `index` (from 1). */
  async setJobPart(index: number, part: { quantity?: string; unit?: string; hidden?: boolean }): Promise<void> {
    const dialog = this.page.getByRole('dialog')
    if (part.unit) await dialog.getByLabel(`Quantity ${index} (Unit)`).selectOption({ label: part.unit })
    if (part.quantity !== undefined) await dialog.getByRole('spinbutton', { name: `Quantity ${index}` }).fill(part.quantity)
    if (part.hidden !== undefined) await dialog.getByRole('checkbox', { name: `Do not bill the customer ${index}` }).setChecked(part.hidden)
  }

  async saveJob(): Promise<void> {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click()
  }
}
