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

Automated end-to-end tests for VietGara: [Playwright](https://playwright.dev) + TypeScript, driving the real `vietgara-owner-web` against a running `vietgara-backend`.

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

## Prerequisites

- Node.js 22+
- A running VietGara stack: `vietgara-backend` (+ Postgres, Mailpit; Redis/Kafka optional in dev, see its own README) and `vietgara-owner-web`, reachable from wherever this suite runs.
- Google Chrome installed (the `chromium` project launches it via `channel: 'chrome'` rather than a Playwright-managed download — see `playwright.config.ts` for why, and how to switch back).

## Setup

```bash
npm install
cp .env.example .env   # then edit WEB_BASE_URL / API_BASE_URL / MAILPIT_URL for your environment
```

See `.env.example` for what each variable means and its default. The two shapes in practice:

| Environment                                                    | WEB_BASE_URL            | API_BASE_URL                                                   |
| -------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------- |
| Docker Compose (Kong)                                          | `http://localhost:8000` | `http://localhost:8000/api`                                    |
| Backend run natively (`make run`), web admin via `npm run dev` | `http://localhost:5173` | `http://localhost:5173/api` (vite's dev proxy forwards `/api`) |

## Running the suite

```bash
npm test              # headless, every project
npm run test:headed   # watch the browser
npm run test:ui       # Playwright's UI mode -- best for writing/debugging a spec
npm run test:debug    # step through with the inspector
npx playwright test tests/quote/                    # one module
npx playwright test -g "E2E-QUO-010"                 # one scenario by ID
npm run report         # reopen the last HTML report
```

A failed run's HTML report links each failure to its trace (`npx playwright show-trace <path>`, or open the report and click through) — a full timeline with DOM snapshots, network requests and console output at the moment it failed.

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

The **E2E** GitHub workflow does exactly this on every pull request touching the suite, and can be started by hand with chosen image tags (`backend_tag`, `owner_web_tag`, `admin_web_tag`) or pointed at a running environment (`web_base_url`).

## Writing a new spec

1. Find the scenario in `vietgara-docs` (or write it there first if it doesn't exist yet — see "Scenarios are written... first" above).
2. One spec file per scenario: `tests/<module>/E2E-<MODULE>-<NNN>.spec.ts`, `test()` title starting with the same ID and copying the scenario's own title.
3. Set up everything the scenario's Preconditions describe via `freshOwner(...)` and `owner.api.*` (add methods to `src/api/client.ts` as needed), `signIn(...)` to land already authenticated, then drive only the screens the scenario itself is about through a page object (add one under `src/pages/` if it doesn't exist yet, following the existing ones' shape: locators as readonly fields built from accessible roles/labels, action methods that compose them).
4. Assert what the scenario's Expected results say, in the same terms (visible text, not implementation details).
5. Run it, watch it fail once for a real reason before making it pass — a spec that has never failed hasn't proven it can catch anything.

Locators prefer `getByRole` / `getByLabel` / `getByText` over CSS selectors, matching Playwright's own guidance and the web admin's semantic HTML (labelled inputs, accessible button names, `role="dialog"` modals) — see any file under `src/pages/` for the pattern. Every test starts pinned to English (see the `page` fixture in `src/fixtures/index.ts`) so locator text stays stable regardless of a previous test's language choice; scenarios specifically about the language switcher override this deliberately in their own spec.

## Test data

Single-use users follow `00_Test_Data.md`'s own convention, `signup.<scenario id>.<unique>@vietgara.test` (the `freshOwner` fixture adds the uniqueness suffix, since this suite may run repeatedly against one long-lived environment where the doc's bare form would collide on a second run). Never a real e-mail address or phone number — `vietgara.test` is reserved (RFC 2606) and can never belong to a real person.

## What's automated so far

Per [`01_Test_Strategy.md` §5](https://github.com/viettechno/vietgara-docs/blob/master/docs/05-Testing/01_Test_Strategy.md#5-end-to-end-testing), P1 scenarios come first, starting with the flows every release depends on:

- **E2E-IAM-001** — sign up and verify by e-mail, through the real form.
- **E2E-TEN-001** — create the first garage.
- **E2E-QUO-001** — create a draft quote with labor and part lines.
- **E2E-REP-001** — create an ad-hoc repair order.
- **E2E-INV-001** — add a part code and record a goods receipt.
- **E2E-INV-008** — closing a repair order with part lines automatically deducts stock (the suite's flagship cross-module test: Repair Order and Inventory meet through an async outbox event, `repair_order.closed`, and the assertion polls the real UI for it rather than reaching for the API to confirm).

The rest of `01`–`07`'s P1s (License plan changes, staff invitations, the public quote approval link, closing/permission edge cases, and so on) follow the same pattern above and are the natural next additions — `src/api/client.ts` already has most of the REST calls they'll need; extend it the same way for what's missing.
