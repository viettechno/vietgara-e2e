import type { Locator, Page } from '@playwright/test'

/** The garage switcher in the app header (E2E-TEN-005): a popover listing every garage of the user. */
export class GarageSwitcher {
  readonly switcherButton: Locator

  constructor(readonly page: Page) {
    this.switcherButton = page.getByRole('button', { name: 'Select garage' })
  }

  async switchTo(garageName: string): Promise<void> {
    await this.switcherButton.click()
    await this.page.getByRole('button', { name: new RegExp(escapeRegExp(garageName)) }).click()
    // The customer/quote lists keep the previous garage's rows while the new
    // garage's query is in flight (placeholderData): wait until the header
    // shows the new garage before returning, so callers read the new data.
    await this.page.locator('header').getByText(garageName).waitFor()
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
