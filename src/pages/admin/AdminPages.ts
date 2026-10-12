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
