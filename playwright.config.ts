import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const webBaseUrl = process.env.WEB_BASE_URL ?? 'http://localhost:8000'

// See README.md "Running the suite" and .env.example. Scenario source of
// truth: vietgara-docs/docs/05-Testing/E2E_Scenarios -- every spec title
// should read `E2E-<MODULE>-<NNN> · <same title as the doc>`.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: webBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Video for failures only: `npx playwright install chromium` also
    // fetches Playwright's ffmpeg helper from the same CDN (verified via
    // `npx playwright install --dry-run chromium` on @playwright/test
    // 1.63.0: it lists "FFmpeg (playwright ffmpeg v1011)" alongside the
    // browser), so recording works wherever the browser install can reach
    // the network -- CI included. No extra install step needed.
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Uses the machine's installed Google Chrome rather than a
        // Playwright-managed download -- convenient where outbound
        // downloads of browser binaries are restricted (sandboxes, some
        // CI images). Swap to the default Chromium build by removing
        // `channel` once `npx playwright install chromium` can succeed.
        channel: 'chrome',
      },
    },
    // Firefox and WebKit matter far less for an internal B2B admin tool
    // than cross-browser consumer software; add them here the same way
    // (device preset, no `channel`) once that changes.
  ],
})
