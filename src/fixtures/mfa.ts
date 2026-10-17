import type { ApiClient } from '../api/client.js'
import { Authenticator } from './totp.js'

/**
 * Turns MFA on for the user of `api` over the API (the setup of scenarios
 * that are not about enrolment). The confirming code spends the current TOTP
 * step; the returned authenticator hands out the following ones.
 */
export async function enableMfa(api: ApiClient): Promise<{ app: Authenticator; recoveryCodes: string[] }> {
  const enrollment = await api.enrollMfa()
  const app = new Authenticator(enrollment.secret ?? '')
  const confirmed = await api.confirmMfa(await app.code())
  return { app, recoveryCodes: confirmed.recoveryCodes ?? [] }
}
