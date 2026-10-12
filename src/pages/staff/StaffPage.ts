import type { Locator, Page } from '@playwright/test'

/** Staff at /staff (E2E-TEN-007): the Invite staff modal looks a user up, then sends the invitation. */
export class StaffPage {
  readonly inviteButton: Locator

  constructor(readonly page: Page) {
    this.inviteButton = page.getByRole('button', { name: 'Invite staff' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/staff')
  }

  /** Looks `lookup` up and sends the invitation with `groups` ticked. */
  async inviteByLookup(lookup: string, groups: string[]): Promise<void> {
    await this.inviteButton.click()
    const dialog = this.page.getByRole('dialog')
    await dialog.getByLabel('E-mail or phone').fill(lookup)
    await dialog.getByRole('button', { name: 'Find' }).click()
    for (const group of groups) {
      await dialog.getByRole('checkbox', { name: group }).check()
    }
    await dialog.getByRole('button', { name: 'Send invitation' }).click()
  }

  invitationRow(email: string): Locator {
    return this.page.locator('li, tbody tr', { hasText: email }).first()
  }
}

/** The invitee's own invitations at /invitations and /invitations/:id (E2E-TEN-007). */
export class MyInvitationsPage {
  readonly acceptButton: Locator
  readonly declineButton: Locator

  constructor(readonly page: Page) {
    this.acceptButton = page.getByRole('button', { name: 'Accept' })
    this.declineButton = page.getByRole('button', { name: 'Decline' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/invitations')
  }

  async open(invitationId: string): Promise<void> {
    await this.page.goto(`/invitations/${invitationId}`)
  }
}
