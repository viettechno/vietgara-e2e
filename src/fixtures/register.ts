import type { ApiClient } from '../api/client.js'
import type { MailpitClient } from '../api/mailpit.js'
import type { Session } from '../api/types.js'
import { env } from './env.js'

export type RegisteredOwner = {
  email: string
  password: string
  fullName: string
  session: Session
  /** Bound to this user's access token -- ready to create garages etc. */
  api: ApiClient
}

/**
 * Registers, reads the OTP from Mailpit and verifies a brand-new user,
 * entirely over the API (00_Test_Data.md §4: "When the suite is automated,
 * this becomes an API fixture"). Fast and independent of the web admin's
 * own sign-up form, which 01_Identity_Access.md's specs test directly.
 */
export async function registerAndVerify(
  api: ApiClient,
  mailpit: MailpitClient,
  localPart: string,
  options: { fullName?: string; phone?: string; locale?: string } = {},
): Promise<RegisteredOwner> {
  // A unique suffix rather than the doc's bare `signup.<scenario id>@...`:
  // this fixture may run many times against one long-lived environment
  // (repeated local debugging, a shared staging DB) where the bare form
  // would collide on the second run. CI against a freshly seeded DB does
  // not need it, but it is harmless there too.
  const email = `signup.${localPart}.${Date.now()}@${env.testEmailDomain}`
  const password = env.testUserPassword
  const fullName = options.fullName ?? `QA Owner ${localPart.toUpperCase()}`

  // Register already e-mails the first OTP (AuthService.Register); asking
  // for a second one immediately would hit the 30-second resend cooldown.
  // The locale pins the language of the user's e-mails and of the default
  // role/group names, which snapshot it at verification: every spec reads
  // English text (the `page` fixture pins `vietgara.language` to `en`), and
  // the app applies the user's locale on sign-in (SessionContext), so the
  // default here is English. Pass an explicit locale only for the language
  // scenarios themselves (E2E-IAM-018).
  const initial = await api.register({ email, password, fullName, phone: options.phone, locale: options.locale ?? 'LOCALE_EN' })
  const asOwner = api.withToken(initial.accessToken)

  const message = await mailpit.waitForMessage(email, { subjectContains: 'VietGara' })
  const otpCode = mailpit.extractOtp(message)

  const verified = await asOwner.verifyEmail(otpCode, initial.refreshToken ?? '')

  return { email, password, fullName, session: verified, api: api.withToken(verified.accessToken) }
}
