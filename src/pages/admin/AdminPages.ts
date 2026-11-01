import type { Locator, Page } from '@playwright/test'

/** Platform-admin plans at /plans on the admin origin (E2E-IAM-020): read-only in this suite. */
export class AdminPlansPage {
  readonly newPlanButton: Locator

  constructor(readonly page: Page) {
    this.newPlanButton = page.getByRole('button', { name: 'Add plan' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/plans')
  }

  row(code: string): Locator {
    return this.page.locator('tbody tr', { hasText: code })
  }
}

/** Platform-admin subscriptions at /subscriptions on the admin origin (E2E-IAM-020): read-only in this suite. */
export class AdminSubscriptionsPage {
  readonly searchField: Locator

  constructor(readonly page: Page) {
    this.searchField = page.getByPlaceholder('Owner e-mail or name')
  }

  async goto(): Promise<void> {
    await this.page.goto('/subscriptions')
  }

  async search(text: string): Promise<void> {
    await this.searchField.fill(text)
  }

  row(text: string): Locator {
    return this.page.locator('tbody tr', { hasText: text })
  }
}

/** The review queue at /payment-requests on the admin origin (E2E-LIC-002, E2E-LIC-016): FR-LIC-08. */
export class AdminPaymentRequestsPage {
  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/payment-requests')
  }

  /** The queue row of an owner, found by e-mail address. */
  row(ownerEmail: string): Locator {
    return this.page.locator('tbody tr', { hasText: ownerEmail })
  }

  /** Opens the request of an owner, then approves it (an optional note), and waits for the confirmation. */
  async approve(ownerEmail: string, note?: string): Promise<void> {
    await this.row(ownerEmail).getByRole('button', { name: 'Review' }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Approve', exact: true }).click()
    if (note !== undefined) await dialog.getByLabel('Note').fill(note)
    await dialog.getByRole('button', { name: 'Approve and apply the plan' }).click()
  }

  /** Opens the request of an owner and rejects it with a reason. */
  async reject(ownerEmail: string, reason: string): Promise<void> {
    await this.row(ownerEmail).getByRole('button', { name: 'Review' }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Reject', exact: true }).click()
    await dialog.getByLabel('Reason for rejecting').fill(reason)
    await dialog.getByRole('button', { name: 'Reject request' }).click()
  }
}
