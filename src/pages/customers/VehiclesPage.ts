import type { Locator, Page } from '@playwright/test'

/** Garage-wide vehicle lookup at /vehicles (read-only list; registration happens on the owner's page). */
export class VehiclesPage {
  readonly searchField: Locator

  constructor(readonly page: Page) {
    // Placeholder: the label is shared with the clear button. Pinned
    // English copy (fixtures force `en`).
    this.searchField = page.getByPlaceholder('Search plate, make, model…')
  }

  async goto(): Promise<void> {
    await this.page.goto('/vehicles')
  }

  async search(text: string): Promise<void> {
    await this.searchField.fill(text)
  }

  row(plate: string): Locator {
    return this.page.locator('tbody tr', { hasText: plate })
  }
}
