import type { Locator, Page } from '@playwright/test'

/** The settlement list at /settlements (E2E-BIL-*): status filter plus the outstanding-only toggle. */
export class SettlementsPage {
  readonly outstandingOnly: Locator

  constructor(readonly page: Page) {
    this.outstandingOnly = page.getByLabel('Outstanding only')
  }

  async goto(): Promise<void> {
    await this.page.goto('/settlements')
  }

  row(number: string): Locator {
    return this.page.locator('tbody tr', { hasText: number })
  }
}

/** One settlement at /settlements/:id (E2E-BIL-003): payments table, Record payment modal, receipt PDF. */
export class SettlementDetailPage {
  readonly recordPaymentButton: Locator
  readonly exportReceiptButton: Locator

  constructor(readonly page: Page) {
    this.recordPaymentButton = page.getByRole('button', { name: 'Record payment' })
    this.exportReceiptButton = page.getByRole('button', { name: 'Export receipt PDF' })
  }

  async goto(settlementId: string): Promise<void> {
    await this.page.goto(`/settlements/${settlementId}`)
  }

  /** Fills the Record payment modal (labels from RecordPaymentModal) and saves. */
  async recordPayment(input: { amount: string; method?: 'Cash' | 'Bank transfer' | 'Online'; note?: string }): Promise<void> {
    await this.recordPaymentButton.click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('Amount').fill(input.amount)
    if (input.method !== undefined) await dialog.getByLabel('Method').selectOption({ label: input.method })
    if (input.note !== undefined) await dialog.getByLabel('Note').fill(input.note)
    // The modal's own submit button shares the "Record payment" name with the
    // opener; scope it to the dialog so the opener is never re-clicked.
    await dialog.getByRole('button', { name: 'Record payment' }).click()
  }

  paymentRow(voucherOrAmount: string): Locator {
    return this.page.locator('tbody tr', { hasText: voucherOrAmount })
  }

  /** The per-voucher PDF button (label `Voucher PDF: <number>`). Exact match:
   * the number is a suffix of other rows' text, so a substring match flakes. */
  voucherButton(voucherNumber: string): Locator {
    return this.page.getByRole('button', { name: `Voucher PDF: ${voucherNumber}`, exact: true })
  }
}
