import type { Locator, Page } from '@playwright/test'

/** The customer-facing approval link at /public/quotes/:token (E2E-QUO-006): no login, one decision per line. */
export class PublicQuotePage {
  readonly startButton: Locator
  readonly submitButton: Locator

  constructor(readonly page: Page) {
    this.startButton = page.getByRole('button', { name: 'Review and decide each line' })
    this.submitButton = page.getByRole('button', { name: 'Submit decision' })
  }

  async goto(token: string): Promise<void> {
    await this.page.goto(`/public/quotes/${token}`)
  }

  /** Toggles one line's decision. Each line renders its own Approve/Reject radio group labelled by the line description. */
  async decideLine(lineDescription: string, approved: boolean): Promise<void> {
    await this.page
      .getByRole('radiogroup', { name: lineDescription })
      .getByRole('radio', { name: approved ? 'Approve' : 'Reject' })
      .click()
  }
}
