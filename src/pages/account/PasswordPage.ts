import type { Locator, Page } from '@playwright/test'

/** My account → Change password (E2E-IAM-037). */
export class PasswordPage {
  readonly current: Locator
  readonly newPassword: Locator
  readonly repeat: Locator
  readonly submit: Locator

  constructor(readonly page: Page) {
    // The labels are exact: the show/hide buttons are named "Show password".
    this.current = page.getByLabel('Current password', { exact: true })
    this.newPassword = page.getByLabel('New password', { exact: true })
    this.repeat = page.getByLabel('Repeat password', { exact: true })
    this.submit = page.getByRole('button', { name: 'Change password' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/account')
  }

  async fill(current: string, newPassword: string, repeat: string): Promise<void> {
    await this.current.fill(current)
    await this.newPassword.fill(newPassword)
    await this.repeat.fill(repeat)
  }
}
