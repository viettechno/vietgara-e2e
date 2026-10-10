import type { Locator, Page } from '@playwright/test'

/** Sign-up form at /register (E2E-IAM-001..007). */
export class RegisterPage {
  readonly fullName: Locator
  readonly email: Locator
  readonly password: Locator
  readonly submit: Locator

  constructor(readonly page: Page) {
    this.fullName = page.getByLabel('Full name')
    this.email = page.getByLabel('Email', { exact: true })
    this.password = page.getByLabel('Password', { exact: true })
    this.submit = page.getByRole('button', { name: 'Create account' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/register')
  }

  async submitWith(input: { fullName: string; email: string; password: string }): Promise<void> {
    await this.fullName.fill(input.fullName)
    await this.email.fill(input.email)
    await this.password.fill(input.password)
    await this.submit.click()
  }
}

/** The 6-digit OTP form at /verify-email (E2E-IAM-001, 003-006). */
export class VerifyEmailPage {
  readonly code: Locator
  readonly submit: Locator
  readonly resend: Locator

  constructor(readonly page: Page) {
    this.code = page.getByLabel('Verification code')
    this.submit = page.getByRole('button', { name: 'Verify', exact: true })
    this.resend = page.getByRole('button', { name: /resend code/i })
  }

  async enterCode(code: string): Promise<void> {
    await this.code.fill(code)
  }

  async submitCode(code: string): Promise<void> {
    await this.enterCode(code)
    await this.submit.click()
  }
}
