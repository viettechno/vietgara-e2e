// A second browser context signed in as the platform admin on the admin
// origin, for scenarios that cross both consoles (the owner asks in the owner
// web, the admin decides in the admin web, the owner sees the result).
import type { Browser, Page } from '@playwright/test'
import type { Session } from '../api/types.js'
import { env } from './env.js'

export async function openAdminPage(browser: Browser, session: Session): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({ baseURL: env.adminWebBaseUrl })
  const page = await context.newPage()
  await page.addInitScript((s: Session) => {
    localStorage.setItem('vietgara.language', 'en')
    localStorage.setItem('vietgara.accessToken', s.accessToken ?? '')
    localStorage.setItem('vietgara.refreshToken', s.refreshToken ?? '')
    if (s.user) localStorage.setItem('vietgara.user', JSON.stringify(s.user))
  }, session)

  return { page, close: () => context.close() }
}
