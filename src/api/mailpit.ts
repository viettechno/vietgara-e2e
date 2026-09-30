// Reads e-mails Mailpit caught for a test account: OTP codes and
// invitation links. Local-only (README §3.1) -- staging swaps the domain
// for plus-addresses of a mailbox QA owns and reads them by hand instead.
import type { APIRequestContext } from '@playwright/test'

type MailpitMessageSummary = { ID: string; Created: string }
type MailpitSearchResponse = { messages: MailpitMessageSummary[] }
type MailpitMessage = { Text: string; HTML: string }

export class MailpitClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  /** The newest message sent to `email`, waiting for it to arrive if needed. */
  async waitForMessage(email: string, options: { timeoutMs?: number; subjectContains?: string } = {}): Promise<MailpitMessage> {
    const timeoutMs = options.timeoutMs ?? 15_000
    const deadline = Date.now() + timeoutMs

    for (;;) {
      const search = await this.request.fetch(`${this.baseUrl}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`)
      const body = (await search.json()) as MailpitSearchResponse
      const candidates = options.subjectContains ? await this.filterBySubject(body.messages, options.subjectContains) : body.messages

      if (candidates.length > 0) {
        const newest = [...candidates].sort((a, b) => Date.parse(b.Created) - Date.parse(a.Created))[0]
        if (!newest) throw new Error(`unreachable: candidates non-empty but sort produced nothing for ${email}`)
        const detail = await this.request.fetch(`${this.baseUrl}/api/v1/message/${newest.ID}`)
        return (await detail.json()) as MailpitMessage
      }

      if (Date.now() > deadline) throw new Error(`no e-mail arrived for ${email} within ${timeoutMs}ms`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  private async filterBySubject(messages: MailpitMessageSummary[], subjectContains: string): Promise<MailpitMessageSummary[]> {
    // The search API doesn't filter by subject text reliably across
    // locales, so re-check each candidate's subject via its own summary.
    const withSubjects = await Promise.all(
      messages.map(async (m) => {
        const detail = await this.request.fetch(`${this.baseUrl}/api/v1/message/${m.ID}`)
        const full = (await detail.json()) as { Subject?: string }
        return { ...m, subject: full.Subject ?? '' }
      }),
    )
    return withSubjects.filter((m) => m.subject.includes(subjectContains))
  }

  /** A 6-digit OTP found anywhere in the message body. */
  extractOtp(message: MailpitMessage): string {
    const match = /\b(\d{6})\b/.exec(message.Text)
    if (!match?.[1]) throw new Error('no 6-digit OTP found in message body')
    return match[1]
  }

  /** The first http(s) link found in the message body (invitation, public quote). */
  extractLink(message: MailpitMessage): string {
    const match = /https?:\/\/[^\s"<>]+/.exec(message.Text)
    if (!match) throw new Error('no link found in message body')
    return match[0]
  }
}
