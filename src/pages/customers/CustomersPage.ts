import type { Locator, Page } from '@playwright/test'

/** The customer list at /customers (E2E-CUS-*): search plus the New customer modal. */
export class CustomersPage {
  readonly newCustomerButton: Locator
  readonly searchField: Locator

  constructor(readonly page: Page) {
    this.newCustomerButton = page.getByRole('button', { name: 'New customer' })
    // Placeholder, not label: the label text is shared with the clear
    // button. Pinned English copy (fixtures force `en`).
    this.searchField = page.getByPlaceholder('Search customers…')
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

/** The "Tax profiles" section of the customer page (E2E-CUS-017): FR-CUS-07. */
export class TaxProfilesSection {
  readonly newButton: Locator
  readonly dialog: Locator

  constructor(readonly page: Page) {
    this.newButton = page.getByRole('button', { name: 'New tax profile' })
    this.dialog = page.getByRole('dialog')
  }

  row(legalName: string): Locator {
    return this.page.locator('tbody tr', { hasText: legalName })
  }

  /** Opens the New tax profile modal, fills it and presses Create (it may stay open on an error). */
  async create(input: {
    kind?: 'Personal' | 'Company'
    legalName: string
    taxId?: string
    address?: string
    invoiceEmail?: string
    isDefault?: boolean
  }): Promise<void> {
    await this.newButton.click()
    if (input.kind !== undefined) await this.dialog.getByLabel('Type').selectOption({ label: input.kind })
    await this.dialog.getByLabel('Legal name').fill(input.legalName)
    if (input.taxId !== undefined) await this.dialog.getByLabel('Tax ID').fill(input.taxId)
    if (input.address !== undefined) await this.dialog.getByLabel('Address').fill(input.address)
    if (input.invoiceEmail !== undefined) await this.dialog.getByLabel('E-invoice e-mail').fill(input.invoiceEmail)
    if (input.isDefault === true) await this.dialog.getByLabel(/Bill to this profile/).check()
    await this.dialog.getByRole('button', { name: 'Create', exact: true }).click()
  }

  /** Edits a row's profile: the modal opens filled, `change` fills it, Save presses it. */
  async edit(legalName: string, change: (dialog: Locator) => Promise<void>): Promise<void> {
    await this.page.getByRole('button', { name: `Edit: ${legalName}` }).click()
    await change(this.dialog)
    await this.dialog.getByRole('button', { name: 'Save', exact: true }).click()
  }
}
