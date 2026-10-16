import type { Locator, Page } from '@playwright/test'

/** My account → Security (E2E-IAM-022 to 025): optional two-step verification. */
export class SecurityPage {
  readonly turnOn: Locator
  readonly turnOff: Locator
  readonly newCodes: Locator
  readonly on: Locator
  readonly off: Locator
  readonly dialog: Locator

  constructor(readonly page: Page) {
    // The account page has one Security panel; the badge reads exactly On or Off.
    const panel = page.getByRole('main')
    this.turnOn = panel.getByRole('button', { name: 'Turn on' })
    this.turnOff = panel.getByRole('button', { name: 'Turn off' })
    this.newCodes = panel.getByRole('button', { name: 'New recovery codes' })
    this.on = panel.getByText('On', { exact: true })
    this.off = panel.getByText('Off', { exact: true })
    this.dialog = page.getByRole('dialog')
  }

  async goto(): Promise<void> {
    await this.page.goto('/account')
  }

  /** The recovery codes of the open dialog, then closes it. */
  async takeRecoveryCodes(): Promise<string[]> {
    const list = this.dialog.getByRole('list', { name: 'Your recovery codes' })
    await list.waitFor()
    const codes = await list.getByRole('listitem').allTextContents()
    await this.dialog.getByRole('checkbox', { name: 'I saved my recovery codes' }).check()
    await this.dialog.getByRole('button', { name: 'Done' }).click()
    return codes
  }
}
