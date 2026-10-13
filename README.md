# vietgara-e2e

> **Purpose:** This repo is the **automated end-to-end test suite** for VietGara — Playwright + TypeScript tests that drive the real web app against a running backend. It contains no product code.

|                |                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| **Type**       | Test suite                                                                                                 |
| **Used by**    | QA and CI, before every release                                                                            |
| **Does**       | Automates the scenarios documented in `vietgara-docs` (`docs/05-Testing/E2E_Scenarios`) under the same IDs |
| **Built with** | Playwright, TypeScript, a typed API client for test setup, Mailpit for OTP e-mails                         |
| **Tests**      | `vietgara-owner-web` through `vietgara-backend` (Kong, Postgres, Mailpit)                                  |
| **Related**    | `vietgara-docs` (scenarios), `vietgara-backend/testing/blackbox` (API-level tests)                         |

Automated end-to-end tests for VietGara: [Playwright](https://playwright.dev) + TypeScript, driving the real `vietgara-owner-web` (and, from Release 4.2, `vietgara-admin-web`) against a running `vietgara-backend`.

**Scenarios are written in [`vietgara-docs`](https://github.com/viettechno/vietgara-docs) first** ([`docs/05-Testing/E2E_Scenarios/`](https://github.com/viettechno/vietgara-docs/tree/master/docs/05-Testing/E2E_Scenarios)), with a stable ID, named test data and exact expected results. This repo automates them under the same ID — a spec here should always be traceable to one scenario there, never the other way around. A behaviour with no documented scenario gets one before it gets a test.

## Why Playwright, why a separate repo

Playwright is the framework [`01_Test_Strategy.md`](https://github.com/viettechno/vietgara-docs/blob/master/docs/05-Testing/01_Test_Strategy.md) already named: auto-waiting locators (no manual `sleep`/polling for most UI state), first-class TypeScript, a trace viewer that records the whole run for a failing test (DOM snapshots, network, console — usually enough to diagnose a CI failure without reproducing it locally), real multi-browser engines, and a test runner with built-in parallelism and retries.

A dedicated repo (rather than `vietgara-owner-web/e2e/`, the original plan) keeps the suite's own dependencies, CI cadence and — later — mobile E2E (Customer App, Technician App, via Maestro or Detox, added as sibling top-level directories the same way `tests/` and `src/` sit here) independent of any one frontend's toolchain and release cycle.

## Project layout

```
src/
  api/        Generated OpenAPI types + a typed REST client (ApiClient) and a
              Mailpit client, used only for test setup/teardown -- never for
              assertions. See "Why an API client" below.
  fixtures/   The extended Playwright `test`: api, mailpit, signIn, freshOwner.
  pages/      Page objects, one class per screen/form, grouped by feature.
tests/
  <module>/   One directory per vietgara-docs module (iam, tenant, license,
              customer, quote, repair-order, inventory). One spec file per
              scenario, named after its ID: E2E-QUO-001.spec.ts.
```

### Why an API client (`src/api/`)

[`00_Test_Data.md §4`](https://github.com/viettechno/vietgara-docs/blob/master/docs/05-Testing/E2E_Scenarios/00_Test_Data.md#4-baseline-setup) says it directly: _"It uses only features that have their own scenarios [...] When the suite is automated, this becomes an API fixture."_ Every spec should exercise the UI only for what its own scenario is actually about; everything else it needs first (a user, a garage, a customer, a stocked item) is created over the API via `freshOwner` / `owner.api.*`, the same way a human tester would rely on the baseline instead of clicking through unrelated screens. This keeps specs fast, and keeps a failure pointing at the one thing under test.

The types in `src/api/` are generated from the same `vietgara-proto` OpenAPI document `vietgara-owner-web` uses (`npm run generate:api`, requires the sibling `../vietgara-proto` checkout) — one source of truth for both.

## Roadmap: Phase 4, Quality Foundation

Per the [Release Plan](https://github.com/viettechno/vietgara-docs/blob/master/docs/01-Product/Release_Plan/Release_Plan_Phase4.md) in `vietgara-docs`. The suite automates the P1 scenarios of the stable modules (plus the viewport check), currently 29 specs: 6 smoke on every pull request, the rest nightly. Phase 4 changes how it is fed and how far it goes:

- **Shared test data (Release 4.0).** The public repository `vietgara-testdata` holds the YAML dataset (users, garages, staff, customers, vehicles, suppliers, parts, plans) with short names (`owner1`, `gara1-1`, `gara1-2`, `advisor1-1`, `customer1-1-1`) and a Go and a TypeScript loader. This suite pins a tag of it in `testdata.version` (`npm run testdata` clones it into `.testdata/`, gitignored) and reads it through the vendored loader in `src/testdata/` — no spec hardcodes a dataset persona without the loader and the pin behind it. Fixed names are for the read-mostly baseline; scenario-owned data (sign-up, password reset, destructive scenarios) is still created with a unique suffix and deleted in teardown.
- **Passwords.** One shared test password for the baseline users on the stubbed stack; on staging it comes from a CI secret (`passwordRef` in the dataset), never from the repository. The platform admin has its own secret and, once MFA ships, a fixed TOTP secret.
- **Seed and purge.** The Playwright global setup seeds the dataset's owners, plans and garages plus the platform-admin user through the public API (the backend `make seed` scope, extended with the admin the admin-web suite needs); staff, customers, suppliers and the catalogue still wait for the backend seeder. A privileged, test-only purge removes every user under the test domain after the run (the API cannot remove used records because of the delete-or-deactivate rule). It is off in production and refuses anything outside the test domain.
- **Scope (Release 4.2).** All P1 and selected P2 scenarios for `vietgara-owner-web` and `vietgara-admin-web`, a `@smoke` set on every pull request, the full set nightly against the stubbed stack and weekly against staging. Mobile device tests are deliberately left for later.
- **Every later release** adds its own scenarios as part of its Definition of Done.

## Prerequisites

- Node.js 22+
- A running VietGara stack: `vietgara-backend` (+ Postgres, Mailpit; Redis/Kafka optional in dev, see its own README) and `vietgara-owner-web`, reachable from wherever this suite runs.
- Google Chrome installed (the `chromium` project launches it via `channel: 'chrome'` rather than a Playwright-managed download — see `playwright.config.ts` for why, and how to switch back).

## Setup

```bash
npm install
npm run testdata   # clone the pinned vietgara-testdata tag into .testdata/ (needed for the baseline seed)
cp .env.example .env   # then edit WEB_BASE_URL / API_BASE_URL / MAILPIT_URL for your environment
```

See `.env.example` for what each variable means and its default. The two shapes in practice:

| Environment                                                    | WEB_BASE_URL            | API_BASE_URL                                                   |
| -------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------- |
| Docker Compose (Kong)                                          | `http://localhost:8000` | `http://localhost:8000/api`                                    |
| Backend run natively (`make run`), owner web via `npm run dev` | `http://localhost:5173` | `http://localhost:5173/api` (vite's dev proxy forwards `/api`) |

## Running the suite

```bash
npm test              # headless, every project
npm run test:smoke    # @smoke-tagged subset only (the pull-request gate)
npm run test:headed   # watch the browser
npm run test:ui       # Playwright's UI mode -- best for writing/debugging a spec
npm run test:debug    # step through with the inspector
npx playwright test tests/quote/                    # one module
npx playwright test -g "E2E-QUO-010"                 # one scenario by ID
npm run report         # reopen the last HTML report
```

A failed run's HTML report links each failure to its trace (`npx playwright show-trace <path>`, or open the report and click through) — a full timeline with DOM snapshots, network requests and console output at the moment it failed. Failures also keep their video (`video: 'retain-on-failure'` in `playwright.config.ts`, stored under `test-results/` and uploaded as CI artifacts); passing runs discard theirs.

### The baseline seed (owners, garages, platform admin)

Every run starts with the Playwright global setup (`src/seed/global-setup.ts` → `src/seed/seed.ts`), which seeds the pinned dataset's garage owners, their plans and garages, plus the platform-admin user — through the public API and Mailpit, idempotently (login-or-register, same-name garages kept). It needs `.testdata/` (`npm run testdata`) and a reachable stack; otherwise it logs why and skips, and the specs self-provision as before. `SEED_BASELINE=0` disables it; `EXISTING_ENV=true` (set by CI for `--web-base-url` runs) never seeds a foreign environment implicitly.

The one step the seed cannot do itself: the backend grants `PLATFORM_ADMIN_EMAILS` only at startup, so CI restarts the backend after the seed (see `.github/workflows/e2e.yml`) before the admin-web specs run. Admin specs skip — instead of failing — when the admin login is not actually a platform admin, so a forgotten restart shows as skipped, never green.

### The admin web

`vietgara-admin-web` shares Kong with the owner web but on its own host (`admin.localhost`, see `ci/kong.yml`), so it gets its own origin (`ADMIN_WEB_BASE_URL`, default `http://admin.localhost:8000`) and its own Playwright project (`admin-chromium`, serving only `tests/admin/`). The sign-in session storage is identical to the owner web, so the same `signIn` fixture works on both origins. Locally, `admin.localhost` must resolve to 127.0.0.1 (systemd-resolved does this; otherwise add it to `/etc/hosts`).

### Schedules

- **Nightly (stubbed stack):** the **E2E** workflow runs the full non-quarantined suite on schedule (`0 18 * * *` UTC, 01:00 ICT) with the newest release images — this is where the NON-smoke P1 batch earns `@smoke`.
- **Weekly (staging):** BLOCKED — this repo has no staging endpoint or secrets (`STAGING_WEB_BASE_URL`, `TEST_PASSWORD`, `ADMIN_PASSWORD`), and the staging baseline still needs an explicit seed → run → purge flow (the suite never seeds a foreign environment implicitly). Until then, staging runs go through the **E2E (manual)** workflow's `web_base_url` input by hand.

### Quarantine (flaky tests)

A test that fails then passes on retry is flaky: retag it `@quarantine` with a ticket link in a comment, so the `test` / `test:smoke` gates skip it (`--grep-invert @quarantine`). It must be fixed within one sprint (the Release 4.2 flaky-test rule).

```bash
npm run test:quarantine                       # @quarantine-tagged subset only (CI reports, never blocks)
npx playwright test --list --grep @quarantine # what is currently quarantined
```

## The stack from published images (what CI uses)

No source checkout is needed: `ci/compose.yml` runs Postgres, Redis, Kafka, Mailpit, the backend, both web apps and Kong from the **public** images in `ghcr.io/viettechno/*`. The gateway config `ci/kong.yml` is a copy of `vietgara-backend/kong/kong.yml` (that repository is private); keep it in step when the gateway changes there.

```bash
export BACKEND_TAG=$(ci/resolve-tag.sh vietgara-backend)        # newest release tag, or pass a tag: ci/resolve-tag.sh vietgara-backend v1.5.0
export OWNER_WEB_TAG=$(ci/resolve-tag.sh vietgara-owner-web)
export ADMIN_WEB_TAG=$(ci/resolve-tag.sh vietgara-admin-web)
docker compose -f ci/compose.yml up -d --wait                    # http://localhost:8000 and Mailpit on :8025
npm test
docker compose -f ci/compose.yml down -v
```

Images are tagged with `git describe` (`v1.5.0`, `v1.5.0-4-g0c94831`) and published when a change merges to `master` or a `v*` tag is pushed, so the suite tests what ships, not an unmerged branch. The backend image is `linux/amd64` only: on Apple silicon set `DOCKER_DEFAULT_PLATFORM=linux/amd64`. To try an unpublished web build, build the image locally (`docker build --platform linux/amd64 -t ghcr.io/viettechno/vietgara-owner-web:local ../vietgara-owner-web`) and set `OWNER_WEB_TAG=local`. Use `KONG_PROXY_PORT` / `MAILPIT_UI_PORT` to avoid clashing with a dev stack already on 8000 / 8025.

### Run it by hand against chosen versions (GitHub Actions)

The **E2E** workflow (`.github/workflows/e2e.yml`) is the test job. It runs on every pull request that touches the suite, with the newest release images. To test **specific versions**, use the **E2E (manual)** workflow (`.github/workflows/e2e-manual.yml`): _Actions → E2E (manual) → Run workflow_, or from a terminal:

```bash
gh workflow run "E2E (manual)" \
  -f backend_tag=v1.5.0-5-g2f65e37 \
  -f owner_web_tag=v1.2.0 \
  -f admin_web_tag=v1.2.0 \
  -f grep=E2E-QUO            # optional: a scenario ID or module prefix
```

| Input                                           | Meaning                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend_tag`, `owner_web_tag`, `admin_web_tag` | Image tag of `ghcr.io/viettechno/vietgara-backend`, `-owner-web`, `-admin-web` (a `git describe` string such as `v1.5.0` or `v1.5.0-5-g2f65e37`). Empty means the newest release tag of that app. A tag that does not exist fails at once and the log lists the newest ones (`ci/check-tag.sh`) |
| `grep`                                          | Only run scenarios whose title matches, for example `E2E-QUO`, `E2E-INV-008` or `repair`. Empty runs everything                                                                                                                                                                                 |
| `web_base_url`                                  | Test an environment that is already running (for example staging) instead of starting the stack. The tags are ignored                                                                                                                                                                           |

The run is named after the versions it tests. Its **summary** lists each image tag with its digest, the pass/fail/flaky/skipped counts and the failed scenarios; the Playwright HTML report (with traces) and `results.json` are attached as the `playwright-report` artifact for 14 days. Find the published tags of an app with `ci/resolve-tag.sh <package>` (newest release) or on the package page of the app's GitHub repository.

## Writing a new spec

1. Find the scenario in `vietgara-docs` (or write it there first if it doesn't exist yet — see "Scenarios are written... first" above).
2. One spec file per scenario: `tests/<module>/E2E-<MODULE>-<NNN>.spec.ts`, `test()` title starting with the same ID and copying the scenario's own title.
3. Set up everything the scenario's Preconditions describe via `freshOwner(...)` and `owner.api.*` (add methods to `src/api/client.ts` as needed), `signIn(...)` to land already authenticated, then drive only the screens the scenario itself is about through a page object (add one under `src/pages/` if it doesn't exist yet, following the existing ones' shape: locators as readonly fields built from accessible roles/labels, action methods that compose them).
4. Assert what the scenario's Expected results say, in the same terms (visible text, not implementation details).
5. Run it, watch it fail once for a real reason before making it pass — a spec that has never failed hasn't proven it can catch anything.

Locators prefer `getByRole` / `getByLabel` / `getByText` over CSS selectors, matching Playwright's own guidance and the owner web's semantic HTML (labelled inputs, accessible button names, `role="dialog"` modals) — see any file under `src/pages/` for the pattern. Every test starts pinned to English (see the `page` fixture in `src/fixtures/index.ts`) so locator text stays stable regardless of a previous test's language choice; scenarios specifically about the language switcher override this deliberately in their own spec.

## Test data

Single-use users follow `00_Test_Data.md`'s own convention, `signup.<scenario id>.<unique>@vietgara.test` (the `freshOwner` fixture adds the uniqueness suffix, since this suite may run repeatedly against one long-lived environment where the doc's bare form would collide on a second run). Never a real e-mail address or phone number — `vietgara.test` is reserved (RFC 2606) and can never belong to a real person.

Baseline personas (`owner1`, `gara1-1`, `51A-111.11`, …) always come from the pinned dataset through `src/testdata/dataset.ts` — never hardcoded. Bump the dataset with `npm run testdata` after moving `testdata.version`, and re-sync the vendored loader (`SYNCED_WITH_TESTDATA`) in the same change.

## What's automated so far

Per [`01_Test_Strategy.md` §5](https://github.com/viettechno/vietgara-docs/blob/master/docs/05-Testing/01_Test_Strategy.md#5-end-to-end-testing), P1 scenarios come first, starting with the flows every release depends on. `@smoke` runs on every pull request (under 10 minutes); everything else runs nightly:

- **Smoke (PR gate):** E2E-IAM-001, E2E-TEN-001, E2E-QUO-001, E2E-REP-001, E2E-INV-001, E2E-INV-008. No new spec joins `@smoke` until a green nightly proves it fast and deterministic.
- **Identity:** E2E-IAM-008 (sign in, wrong credentials, case-insensitive e-mail), E2E-IAM-009 (sign out ends the session), E2E-IAM-011 (password reset; cross-browser revocation stays manual), E2E-IAM-020 (platform admin in the admin web, owner denied).
- **Tenant:** E2E-TEN-004 (trial garage limit), E2E-TEN-005 (switch active garage), E2E-TEN-007 (invite by e-mail, second-actor accept from the Mailpit link).
- **License:** E2E-LIC-001 (trial reads), E2E-LIC-002 (switch to a paid plan).
- **Customer:** E2E-CUS-001 (create with consent + search), E2E-CUS-005 (register a vehicle from the owner's page + lookup).
- **Quote:** E2E-QUO-004 (LINK send + customer e-mail + quote PDF download), E2E-QUO-006 (public-link mixed and rejected decisions), E2E-QUO-008 (MANUAL record), E2E-QUO-010 (convert approved lines only).
- **Repair order:** E2E-REP-008 (close requires completed lines).
- **Inventory:** E2E-INV-003 (goods receipts accumulate), E2E-INV-010 (Technician view-only, outsider sidebar).
- **Settlement:** E2E-BIL-001 (create from a closed order + receipt PDF download), E2E-BIL-003 (partial then full payment, third refused), E2E-BIL-008 (outstanding filter + dashboard revenue).
- **Viewport:** no horizontal overflow and visible main content on home/customers/quotes at 1440/820/390 px (NON-smoke: 9 page loads).
- **Testdata proof:** the seeded baseline users own the dataset garages (`tests/testdata/baseline.spec.ts`).

Deliberately deferred, with reasons (review before automating):

- E2E-LIC-010/011/012, E2E-TEN-012 — need the SQL time helpers (H1/H2/H4): no UI or API moves the clock.
- E2E-CUS-010/011 — the Partners screen is now Suppliers (Release 5.0 rename): the scenarios predate it; automate after the docs catch up.
- E2E-BIL-004/005 — payment vouchers have no API field yet (Phase 5 scope).
- E2E-BIL-006 — API-level idempotency: blackbox territory, not browser.
- E2E-BIL-007 — visual PDF check: manual only.
- E2E-BIL-010, E2E-QUO-012 — need the transaction-limit plan plus faked clocks.
- E2E-REP-004/005/007, E2E-TEN-014/015/017 — Kanban board and role-editor widget structures are unverified without a running browser; next after the first green nightly.
- E2E-IAM-014..017, E2E-IAM-021, E2E-QUO-007/009/011/013, E2E-CUS rest — manual-only, P2/P3, or covered by the same page objects later.
