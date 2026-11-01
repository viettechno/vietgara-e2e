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

/** One vehicle at /vehicles/:id: the identity lock and its correction (E2E-CUS-019, E2E-CUS-020). */
export class VehicleDetailPage {
  readonly lockedBanner: Locator
  readonly correctButton: Locator
  readonly dialog: Locator

  constructor(readonly page: Page) {
    this.lockedBanner = page.getByText('Identity locked: a live quote, repair order or settlement uses this vehicle.')
    this.correctButton = page.getByRole('button', { name: 'Correct data' })
    this.dialog = page.getByRole('dialog')
  }

  async goto(vehicleId: string): Promise<void> {
    await this.page.goto(`/vehicles/${vehicleId}`)
  }

  /** Corrects one identity field through the "Correct data" dialog. `reason` may be left out to see it refused. */
  async correct(input: { field: string; value: string; reason?: string }): Promise<void> {
    await this.correctButton.click()
    await this.dialog.getByLabel('Field to correct').selectOption({ label: input.field })
    await this.dialog.getByLabel('Corrected value').fill(input.value)
    if (input.reason !== undefined) await this.dialog.getByLabel('Why is the correction needed?').fill(input.reason)
    await this.dialog.getByRole('button', { name: 'Correct', exact: true }).click()
  }
}
