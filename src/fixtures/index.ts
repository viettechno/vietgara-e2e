// The project's Playwright test object, extended with fixtures every spec
// needs: an unauthenticated API client for setup/teardown, a Mailpit
// client for OTPs and links, and `signIn` to drop a page straight into an
// authenticated app state without going through the login form (the login
// form itself is what 01_Identity_Access.md's own specs exercise).
//
// Naming follows 00_Test_Data.md: single-use users this suite creates
// are `signup.<scenario id>@vietgara.test`, password `Qa@123456` (env.testUserPassword).
import { test as base } from '@playwright/test'
import { ApiClient } from '../api/client.js'
import { MailpitClient } from '../api/mailpit.js'
import type { Session } from '../api/types.js'
import { env } from './env.js'
import { registerAndVerify, type RegisteredOwner } from './register.js'

type Fixtures = {
  api: ApiClient
  mailpit: MailpitClient
  signIn: (session: Session, garageId?: string) => Promise<void>
  freshOwner: (localPart: string, options?: { fullName?: string; phone?: string; locale?: string }) => Promise<RegisteredOwner>
  /**
   * A client signed in as the baseline platform admin (seeded by the
   * global setup). The test is skipped when that login is not a platform
   * admin, so a stack without the baseline shows as skipped, never red.
   */
  adminApi: ApiClient
  /** The same baseline platform admin's session, for `signIn` in the admin web. */
  adminSession: Session
}

export const test = base.extend<Fixtures>({
  // Every spec's locators read English text (see pages/*), so every page
  // -- authenticated or not -- starts pinned to English rather than the
  // Vietnamese default (NFR-US-01). 01_Identity_Access.md's own
  // language-switch scenarios exercise the real switcher directly and
  // assert on Vietnamese text there, overriding this in their own body.
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem('vietgara.language', 'en'))
    await use(page)
  },

  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: env.apiBaseUrl })
    await use(new ApiClient(context))
    await context.dispose()
  },

  mailpit: async ({ playwright }, use) => {
    const context = await playwright.request.newContext()
    await use(new MailpitClient(context, env.mailpitUrl))
    await context.dispose()
  },

  // Seeds the session before the app's first script runs, so no login
  // form round-trip is needed for tests that aren't about login itself.
  // Call it, then page.goto() wherever the test actually wants to land.
  // NOTE: the seed re-runs on EVERY full page load (addInitScript). After
  // the test changes auth state in the UI — signing out, switching the
  // active garage — re-pin with signIn (new garage) or stop using it:
  // otherwise the next goto reloads the old session/garage (E2E-IAM-009,
  // E2E-TEN-005, E2E-BIL-004). Tests about login itself sign in through
  // the real form instead.
  signIn: async ({ page }, use) => {
    await use(async (session: Session, garageId?: string) => {
      await page.addInitScript(
        ({ session, garageId }: { session: Session; garageId?: string }) => {
          localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
          localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
          if (session.user) localStorage.setItem('vietgara.user', JSON.stringify(session.user))
          if (garageId) localStorage.setItem('vietgara.garageId', garageId)
        },
        { session, garageId },
      )
    })
  },

  adminSession: async ({ api }, use, testInfo) => {
    const session = await api.login(env.platformAdminEmail, env.platformAdminPassword).catch(() => undefined)
    if (session?.user?.platformAdmin !== true) {
      testInfo.skip(true, 'platform admin not provisioned: seed the baseline (global setup) first')
      return
    }
    await use(session)
  },

  adminApi: async ({ api, adminSession }, use) => {
    await use(api.withToken(adminSession.accessToken))
  },

  // A brand-new, verified owner user with no garage yet -- the
  // starting point for most module tests. `localPart` becomes
  // `signup.<localPart>@vietgara.test` (00_Test_Data.md's convention);
  // pass the scenario ID, e.g. freshOwner('quo001').
  freshOwner: async ({ api, mailpit }, use) => {
    await use((localPart, options) => registerAndVerify(api, mailpit, localPart, options))
  },
})

export { expect } from '@playwright/test'
export { env } from './env.js'
