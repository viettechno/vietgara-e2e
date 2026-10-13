import type { Locator, Page } from '@playwright/test'

/** The garage list and "Add garage" modal at /garages (E2E-TEN-001, 004-006). */
export class GaragesPage {
  readonly addGarageButton: Locator
  readonly nameField: Locator
  readonly saveButton: Locator

  constructor(readonly page: Page) {
    this.addGarageButton = page.getByRole('button', { name: 'Add garage' })
    this.nameField = page.getByLabel('Garage name')
    this.saveButton = page.getByRole('button', { name: 'Create', exact: true })
  }

  async goto(): Promise<void> {
    await this.page.goto('/garages')
  }

  async createGarage(input: { name: string; address?: string }): Promise<void> {
    await this.addGarageButton.click()
    await this.nameField.fill(input.name)
    if (input.address) await this.page.getByLabel('Address').fill(input.address)
    await this.saveButton.click()
    // Wait for the creation to land before returning: callers list garages
    // over the API immediately after, and without this the read races the
    // `Saving…` mutation (seen as "Garage not found" on slow CI runners).
    await this.page.getByRole('dialog').waitFor({ state: 'hidden' })
  }

  garageRow(name: string): Locator {
    return this.page.locator('main li', { hasText: name })
  }
}
