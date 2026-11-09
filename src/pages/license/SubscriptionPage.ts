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
    // Choosing a plan quotes manual payment (credit is applied to the amount
    // due, and the owner may declare a transfer or cash), so the dialog
    // confirms with "Get the payment details", not "Confirm".
    await dialog.getByRole('button', { name: 'Get the payment details' }).click()
  }

  /** The payment declaration form: payer, amount due, and optional bank evidence; sends it for review. */
  async declareTransfer(input: { payerName: string; evidence?: { name: string; mimeType: string; buffer: Buffer } }): Promise<void> {
    await this.page.getByRole('button', { name: 'Declare payment' }).click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Payer name').fill(input.payerName)
    if (input.evidence) await dialog.getByLabel('Evidence (screenshot or PDF)').setInputFiles(input.evidence)
    await dialog.getByRole('button', { name: 'Send for review' }).click()
  }
}
