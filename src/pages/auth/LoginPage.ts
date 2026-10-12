import type { Locator, Page } from '@playwright/test'

/** Sign-in form at /login (E2E-IAM-008/009/011) and the header user menu. */
export class LoginPage {
  readonly email: Locator
  readonly password: Locator
  readonly submit: Locator
  readonly forgotPassword: Locator

  constructor(readonly page: Page) {
    this.email = page.getByLabel('Email', { exact: true })
    this.password = page.getByLabel('Password', { exact: true })
    this.submit = page.getByRole('button', { name: 'Sign in' })
    this.forgotPassword = page.getByRole('link', { name: 'Forgot password?' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/login')
  }

  async signInAs(email: string, password: string): Promise<void> {
    await this.email.fill(email)
    await this.password.fill(password)
    await this.submit.click()
  }
}

/** The header account menu (AppShell): user menu button, then Sign out. */
export class AccountMenu {
  readonly menuButton: Locator
  readonly signOutItem: Locator

  constructor(readonly page: Page) {
    this.menuButton = page.getByRole('button', { name: 'User menu' })
    this.signOutItem = page.getByRole('menuitem', { name: 'Sign out' })
  }

  async signOut(): Promise<void> {
    await this.menuButton.click()
    await this.signOutItem.click()
  }
}
