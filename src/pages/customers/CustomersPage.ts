import type { Locator, Page } from '@playwright/test'

/** The customer list at /customers (E2E-CUS-*): search plus the New customer modal. */
export class CustomersPage {
  readonly newCustomerButton: Locator
  readonly searchField: Locator

  constructor(readonly page: Page) {
    this.newCustomerButton = page.getByRole('button', { name: 'New customer' })
    this.searchField = page.getByLabel('Search')
  }

  async goto(): Promise<void> {
    await this.page.goto('/customers')
  }

  async search(text: string): Promise<void> {
    await this.searchField.fill(text)
  }

  row(name: string): Locator {
    return this.page.locator('tbody tr', { hasText: name })
  }

  /** Fills the New customer modal (labels from CustomerFormModal) and saves. */
  async createCustomer(input: { fullName: string; phone?: string; email?: string; consent?: boolean }): Promise<void> {
    await this.newCustomerButton.click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Full name').fill(input.fullName)
    if (input.phone !== undefined) await dialog.getByLabel('Phone').fill(input.phone)
    if (input.email !== undefined) await dialog.getByLabel('Email').fill(input.email)
    const consent = dialog.getByLabel(/consents to personal data processing/)
    if (input.consent === true) await consent.check()
    if (input.consent === false) await consent.uncheck()
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }
}

/** One customer with their vehicles at /customers/:id (E2E-CUS-005). Vehicles register here, not on /vehicles. */
export class CustomerDetailPage {
  readonly newVehicleButton: Locator

  constructor(readonly page: Page) {
    this.newVehicleButton = page.getByRole('button', { name: 'New vehicle' })
  }

  async goto(customerId: string): Promise<void> {
    await this.page.goto(`/customers/${customerId}`)
  }

  vehicleRow(plate: string): Locator {
    return this.page.locator('tbody tr', { hasText: plate })
  }

  /** Fills the New vehicle modal (labels from VehicleFormModal) and saves. */
  async registerVehicle(input: {
    plate: string
    make?: string
    model?: string
    year?: number
    vin?: string
    engine?: string
  }): Promise<void> {
    await this.newVehicleButton.first().click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('License plate').fill(input.plate)
    if (input.make !== undefined) await dialog.getByLabel('Make').fill(input.make)
    if (input.model !== undefined) await dialog.getByLabel('Model').fill(input.model)
    if (input.year !== undefined) await dialog.getByLabel('Year').fill(String(input.year))
    if (input.vin !== undefined) await dialog.getByLabel('VIN').fill(input.vin)
    if (input.engine !== undefined) await dialog.getByLabel('Engine number').fill(input.engine)
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }
}
