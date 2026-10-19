import { type Locator, type Page } from '@playwright/test'

export type ImportKind = 'Parts' | 'Goods receipt' | 'Stock count'

/** Import from Excel at /inventory/import (E2E-INV-033). */
export class ImportPage {
  readonly fileInput: Locator
  readonly downloadTemplateButton: Locator
  readonly problems: Locator
  readonly summary: Locator
  readonly doneMessage: Locator

  constructor(readonly page: Page) {
    this.fileInput = page.getByLabel('Excel file (.xlsx)')
    this.downloadTemplateButton = page.getByRole('button', { name: 'Download template' })
    this.problems = page.getByRole('table', { name: 'Problems found' })
    this.summary = page.getByLabel('Result of the check')
    this.doneMessage = page.getByText(/rows imported\.$/)
  }

  async goto(kind: ImportKind = 'Parts'): Promise<void> {
    await this.page.goto('/inventory/import')
    if (kind !== 'Parts') await this.page.getByRole('tab', { name: kind }).click()
  }

  /** Chooses a workbook; the file is checked at once and nothing is saved. */
  async choose(name: string, buffer: Buffer): Promise<void> {
    await this.fileInput.setInputFiles({
      name,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer,
    })
  }

  confirmButton(rows: number): Locator {
    return this.page.getByRole('button', { name: `Import ${rows} rows` })
  }

  /** The "row:column" of every problem in the table. */
  async listedProblems(): Promise<string[]> {
    const rows = this.problems.locator('tbody tr')
    const count = await rows.count()
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td')
      out.push(`${(await cells.nth(0).innerText()).trim()}:${(await cells.nth(1).innerText()).trim()}`)
    }
    return out
  }
}
