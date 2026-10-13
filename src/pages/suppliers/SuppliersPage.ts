import type { Locator, Page } from '@playwright/test'

/** The supplier list at /suppliers (E2E-CUS-010, E2E-CUS-011): search plus the New supplier modal. */
export class SuppliersPage {
  readonly newSupplierButton: Locator
  readonly searchField: Locator

  constructor(readonly page: Page) {
    this.newSupplierButton = page.getByRole('button', { name: 'New supplier' })
    this.searchField = page.getByPlaceholder('Search suppliers…')
  }

  async goto(): Promise<void> {
    await this.page.goto('/suppliers')
  }

  async search(text: string): Promise<void> {
    await this.searchField.fill(text)
  }

  row(name: string): Locator {
    return this.page.locator('tbody tr', { hasText: name })
  }

  /** Fills the New supplier modal (labels from SupplierFormModal) and saves. */
  async createSupplier(input: { name: string; taxCode?: string; contactPerson?: string; phone?: string; email?: string }): Promise<void> {
    await this.newSupplierButton.click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Name', { exact: true }).fill(input.name)
    if (input.taxCode !== undefined) await dialog.getByLabel('Tax ID').fill(input.taxCode)
    if (input.contactPerson !== undefined) await dialog.getByLabel('Contact person').fill(input.contactPerson)
    if (input.phone !== undefined) await dialog.getByLabel('Phone').fill(input.phone)
    if (input.email !== undefined) await dialog.getByLabel('Email').fill(input.email)
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  async editContactPerson(supplierName: string, contactPerson: string): Promise<void> {
    await this.page.getByRole('button', { name: `Edit: ${supplierName}` }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Contact person').fill(contactPerson)
    await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  }
}
