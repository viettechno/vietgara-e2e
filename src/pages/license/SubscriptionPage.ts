import type { Locator, Page } from '@playwright/test'

/** The owner's subscription at /subscription (E2E-LIC-001/002): current plan, usage, plan cards. */
export class SubscriptionPage {
  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/subscription')
  }

  /** The plan card article for a plan name (its heading plus button live inside). */
  planCard(planName: string): Locator {
    return this.page.locator('article', { hasText: planName })
  }

  async choosePlan(planName: string): Promise<void> {
    await this.planCard(planName).getByRole('button', { name: 'Choose this plan' }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Confirm', exact: true }).click()
  }
}
