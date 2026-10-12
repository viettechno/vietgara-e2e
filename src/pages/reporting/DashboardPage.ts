import type { Page } from '@playwright/test'

/** The garage dashboard at /dashboard (E2E-BIL-008): revenue and attention cards. Read-only in this suite. */
export class DashboardPage {
  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/dashboard')
  }
}
