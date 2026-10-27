import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const webBaseUrl = process.env.WEB_BASE_URL ?? 'http://localhost:8000'
// The platform-admin SPA shares Kong with the owner web but on its own host
// (ci/kong.yml matches `admin.localhost`), so it gets its own origin — and
// its own project below, so owner specs never accidentally run against it.
const adminWebBaseUrl = process.env.ADMIN_WEB_BASE_URL || 'http://admin.localhost:8000'

// See README.md "Running the suite" and .env.example. Scenario source of
// truth: vietgara-docs/docs/05-Testing/E2E_Scenarios -- every spec title
// should read `E2E-<MODULE>-<NNN> · <same title as the doc>`.
export default defineConfig({
  testDir: './tests',
  // The idempotent baseline seed (owners, plans, garages, platform-admin
  // user from the pinned dataset). Skips with a warning when `.testdata/`
  // or the stack is absent; SEED_BASELINE=0 disables it outright.
  globalSetup: './src/seed/global-setup.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Two workers on CI: four Chromium instances plus video encoding alongside
  // the whole stack starved the shared runners into 10s-timeout flakes.
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  // Generous assertions on CI: page loads share the runner with the stack.
  expect: { timeout: process.env.CI ? 20_000 : 10_000 },

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
      testIgnore: /tests\/admin\/.*/,
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
    // The admin-web suite (E2E-IAM-020 and the FR-LIC-05 reads): same
    // browser, the admin origin. Specs live under tests/admin/ and are
    // picked up only here, so the owner project never runs them.
    {
      name: 'admin-chromium',
      testMatch: /tests\/admin\/.*/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: adminWebBaseUrl,
      },
    },
    // Firefox and WebKit matter far less for an internal B2B admin tool
    // than cross-browser consumer software; add them here the same way
    // (device preset, no `channel`) once that changes.
  ],
})
