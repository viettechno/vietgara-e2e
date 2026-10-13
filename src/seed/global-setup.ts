// Playwright global setup: idempotent baseline seed (owners, plans,
// garages, platform-admin user) from the pinned shared dataset. Never
// blocks the run: without `.testdata/` or without a reachable stack it
// logs why and lets the specs self-provision as before.
import { request } from '@playwright/test'
import type { FullConfig } from '@playwright/test'
import { env } from '../fixtures/env.js'
import { seedBaseline } from './seed.js'

async function globalSetup(_config: FullConfig): Promise<void> {
  if (process.env.SEED_BASELINE === 'false' || process.env.SEED_BASELINE === '0') {
    console.log('[seed] SEED_BASELINE=0: skipping the baseline seed')
    return
  }
  // Never seed a foreign environment implicitly (staging via web_base_url,
  // someone else's dev stack): the seed creates real users. Those runs set
  // EXISTING_ENV=true (see .github/workflows/e2e.yml) and provision — or
  // skip — the baseline explicitly instead.
  if (process.env.EXISTING_ENV === 'true') {
    console.log('[seed] EXISTING_ENV=true: skipping the baseline seed on a foreign environment')
    return
  }
  const context = await request.newContext({ baseURL: env.apiBaseUrl })
  try {
    const summary = await seedBaseline(context, {
      apiBaseUrl: env.apiBaseUrl,
      mailpitUrl: env.mailpitUrl,
      seedEnv: env.seedEnv,
      testUserPassword: env.testUserPassword,
    })
    if (summary.skipped) {
      console.log(`[seed] skipped: ${summary.skipped}`)
      return
    }
    const parts = [
      `users created [${summary.usersCreated.join(', ') || 'none'}]`,
      `existing [${summary.usersExisting.join(', ') || 'none'}]`,
      `plans changed [${summary.plansChanged.join(', ') || 'none'}]`,
      `garages created [${summary.garagesCreated.join(', ') || 'none'}]`,
      `existing [${summary.garagesExisting.join(', ') || 'none'}]`,
    ]
    console.log(`[seed] baseline: ${parts.join('; ')}`)
    if (summary.adminNeedsBackendRestart) {
      console.log(
        '[seed] NOTE: the backend grants PLATFORM_ADMIN_EMAILS only at startup — restart it before the admin-web specs (CI does this after the seed step)',
      )
    }
  } finally {
    await context.dispose()
  }
}

export default globalSetup
