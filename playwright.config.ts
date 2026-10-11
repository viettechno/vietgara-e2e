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
    // Off by default: video capture needs Playwright's ffmpeg helper,
    // which (like the bundled browsers) is fetched from Microsoft's CDN --
    // unavailable in network-restricted sandboxes. Set to
    // 'retain-on-failure' wherever `npx playwright install ffmpeg` can
    // actually reach the network (most CI runners can).
    video: 'off',
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
