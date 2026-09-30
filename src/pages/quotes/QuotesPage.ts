import type { Locator, Page } from '@playwright/test'

/** The quote list at /quotes (E2E-QUO-013). */
export class QuotesPage {
  readonly newQuoteLink: Locator

  constructor(readonly page: Page) {
    this.newQuoteLink = page.getByRole('link', { name: 'New quote' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/quotes')
  }

  row(number: string): Locator {
    return this.page.locator('tbody tr', { hasText: number })
  }
}
