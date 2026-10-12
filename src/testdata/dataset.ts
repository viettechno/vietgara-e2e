// The pinned shared dataset behind every dataset name a spec uses.
//
// `npm run testdata` clones the tag named in `testdata.version` into
// `.testdata/`; `loadDataset()` reads `.testdata/data` through the vendored
// loader (`src/testdata/loader.ts`, synced with the same tag). No spec may
// hardcode a dataset persona (owner1, gara1-1, 51A-111.11, …) without going
// through these helpers: a rename in the dataset must break the lookup
// here, loudly, instead of silently testing the wrong record.
//
// Seed coverage (honest form): the e2e stack has no full seeder yet. The
// global setup (`global-setup.ts` → `src/seed/seed.ts`) seeds owners,
// garages and the platform-admin user through the public API — the backend
// `make seed` scope — while staff, customers, suppliers and the catalogue
// still wait for the backend seeder (Release 4.0 gap, see README). Specs
// therefore self-provision scenario data with `freshOwner` as before, and
// use the dataset for the values that must match the seeded baseline
// (e-mails, names, plates, passwords, plan codes).
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load, SYNCED_WITH_TESTDATA, type Customer, type Dataset, type Garage, type User } from './loader.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pinnedVersionFile = join(repoRoot, 'testdata.version')

/** Where `npm run testdata` puts the pinned checkout (`TESTDATA_DIR` overrides). */
export function testdataDataDir(): string {
  return resolve(repoRoot, process.env.TESTDATA_DIR ?? '.testdata/data')
}

let cached: { dir: string; dataset: Dataset } | undefined

async function pinnedVersion(): Promise<string> {
  return (await readFile(pinnedVersionFile, 'utf8')).trim()
}

/** Loads the pinned dataset, checking the vendored loader matches the pin. */
export async function loadDataset(dataDir: string = testdataDataDir()): Promise<Dataset> {
  if (cached && cached.dir === dataDir) return cached.dataset
  const pinned = await pinnedVersion()
  if (SYNCED_WITH_TESTDATA !== pinned) {
    throw new Error(
      `vendored testdata loader is synced with ${SYNCED_WITH_TESTDATA} but testdata.version pins ${pinned}: re-sync src/testdata/loader.ts`,
    )
  }
  const dataset = await load(dataDir)
  cached = { dir: dataDir, dataset }
  return dataset
}

/** False when `.testdata/` was never fetched: callers skip, they never fake. Never uses the cache. */
export async function datasetAvailable(dataDir: string = testdataDataDir()): Promise<boolean> {
  try {
    if ((await pinnedVersion()) !== SYNCED_WITH_TESTDATA) return false
    await load(dataDir)
    return true
  } catch {
    return false
  }
}

function required<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`dataset has no ${what} (pinned tag moved?)`)
  return value
}

/** `owner1` → the full `User` record. */
export function user(dataset: Dataset, key: string): User {
  const found = dataset.users.find((u) => u.key === key)
  return required(found, `user ${key}`)
}

/** `gara1-1` → the full `Garage` record. */
export function garage(dataset: Dataset, key: string): Garage {
  const found = dataset.garages.find((g) => g.key === key)
  return required(found, `garage ${key}`)
}

/** `customer1-1-1` → the full `Customer` record. */
export function customer(dataset: Dataset, key: string): Customer {
  const found = dataset.customers.find((c) => c.key === key)
  return required(found, `customer ${key}`)
}

/** `owner1` + `vietgara.test` → `owner1@vietgara.test`. */
export function email(dataset: Dataset, key: string): string {
  return `${key}@${dataset.emailDomain}`
}

/**
 * Password for a baseline user on the stubbed stack (`environments.stubbed`).
 * Staging holds only `passwordRef` (a CI secret) — resolving it here would
 * commit the very indirection the dataset keeps out of the repo, so staging
 * runs take `TEST_USER_PASSWORD` from the environment instead (see
 * `src/fixtures/env.ts`). The platform admin has its own password.
 */
export function stubbedPassword(dataset: Dataset, key: string): string {
  const stubbed = required(dataset.environments['stubbed'], 'environment "stubbed"')
  if (user(dataset, key).platformAdmin) {
    return required(stubbed.adminPassword, 'stubbed adminPassword')
  }
  return required(stubbed.password, 'stubbed password')
}
