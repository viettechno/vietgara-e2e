// Viewport check (Release 4.2): the UI audit's viewport script as a test.
// Home, customers and quotes render with no horizontal overflow and their
// main content visible at desktop (1440), tablet (820) and phone (390) px.
//
// NON-smoke by default: 9 page loads keep it slower than the gate wants,
// and it joins @smoke only after a green nightly proves its timing. Uses
// the existing page objects; overflow is measured, not eyeballed.
import type { Page } from '@playwright/test'
import { expect, test } from '../../src/fixtures/index.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { QuotesPage } from '../../src/pages/quotes/QuotesPage.js'

const viewports = [
  { name: 'desktop 1440px', width: 1440, height: 900 },
  { name: 'tablet 820px', width: 820, height: 1180 },
  { name: 'phone 390px', width: 390, height: 844 },
]

for (const viewport of viewports) {
  test(`viewport at ${viewport.name}: home, customers and quotes have no horizontal overflow`, async ({ page, signIn, freshOwner }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    const owner = await freshOwner('viewport')
    const garage = await owner.api.createGarage({ name: 'QA Gara Viewport' })
    await signIn(owner.session, garage.id)

    const garages = new GaragesPage(page)
    await garages.goto()
    await expect(page.locator('main')).toBeVisible()
    await expectNoOverflow(page)

    const customers = new CustomersPage(page)
    await customers.goto()
    await expect(page.locator('main')).toBeVisible()
    await expectNoOverflow(page)

    const quotes = new QuotesPage(page)
    await quotes.goto()
    await expect(page.locator('main')).toBeVisible()
    await expectNoOverflow(page)
  })
}

/** At most 1px of horizontal overflow (sub-pixel rounding), on the real document — not a screenshot. */
async function expectNoOverflow(page: Page): Promise<void> {
  // String form: tsconfig has no DOM lib (Node-only), so `document` cannot
  // be named in a callback — the browser still evaluates the same expression.
  const overflow = await page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(1)
}
