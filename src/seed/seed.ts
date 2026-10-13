// Baseline seed: owners, plans and garages from the pinned shared dataset,
// plus the platform-admin user the admin-web suite signs in as.
//
// Scope mirrors `make seed` in vietgara-backend (owners referenced by the
// dataset garages, their plans, the garages themselves) with one deliberate
// extension: the platform-admin user (`admin`), which the backend seeder
// does not create but E2E-IAM-020 needs. Staff, customers, suppliers and the
// catalogue still wait for the backend seeder (Release 4.0 gap) — specs keep
// self-provisioning those with `freshOwner` / `owner.api.*`.
//
// Idempotent: an existing user logs in instead of registering; an existing
// garage (matched by name) is kept, and a same-name garage with different
// dataset values fails loudly rather than silently diverging. Runs from the
// Playwright global setup; when the stack or `.testdata/` is absent it
// warns and skips (specs still run, self-provisioned), so a bare
// `npx playwright test` against a foreign environment never breaks on seed.
//
// The platform-admin grant is the one thing this seed cannot do itself:
// the backend grants `PLATFORM_ADMIN_EMAILS` only at startup
// (GrantPlatformAdmins). CI therefore restarts the backend after the seed
// step — see `.github/workflows/e2e.yml` — and admin specs skip when the
// admin login is not actually a platform admin.
import type { APIRequestContext } from '@playwright/test'
import { ApiClient } from '../api/client.js'
import { MailpitClient } from '../api/mailpit.js'
import type { Session } from '../api/types.js'
import { email, garage as datasetGarage, loadDataset, stubbedPassword, user } from '../testdata/dataset.js'
import type { Dataset } from '../testdata/loader.js'

export type SeedSummary = {
  skipped?: string
  usersCreated: string[]
  usersExisting: string[]
  plansChanged: string[]
  garagesCreated: string[]
  garagesExisting: string[]
  /** Reminder for the runner: the backend grants admins only at startup. */
  adminNeedsBackendRestart: boolean
}

type SeedEnv = {
  apiBaseUrl: string
  mailpitUrl: string
  /** Dataset `environments` section to read passwords from (`stubbed`, or staging via CI secret). */
  seedEnv: string
  /** Staging fallback: the dataset holds only a `passwordRef` there, so the value comes from the environment. */
  testUserPassword: string
}

/** Password for a baseline user: the dataset value where it has one, else the CI secret. */
export function baselinePassword(dataset: Dataset, env: SeedEnv, key: string): string {
  const target = env.seedEnv
  const entry = dataset.environments[target]
  const direct = user(dataset, key).platformAdmin ? entry?.adminPassword : entry?.password
  if (direct) return direct
  // Staging keeps only `passwordRef` in the dataset: same secret for every
  // persona, platform admin included (its own ADMIN_PASSWORD secret is
  // wired by using TEST_USER_PASSWORD=... per actor in CI).
  return target === 'stubbed' ? stubbedPassword(dataset, key) : seedEnvPassword(target, seedEnvPasswordName(dataset, key))
}

function seedEnvPasswordName(dataset: Dataset, key: string): string {
  const entry = dataset.environments['staging']
  const ref = user(dataset, key).platformAdmin ? entry?.adminPasswordRef : entry?.passwordRef
  return ref ?? 'TEST_USER_PASSWORD'
}

function seedEnvPassword(seedEnv: string, ref: string): string {
  const value = process.env[ref]
  if (!value) throw new Error(`seed target "${seedEnv}" needs the ${ref} secret in the environment`)
  return value
}

export async function seedBaseline(request: APIRequestContext, seedEnv: SeedEnv): Promise<SeedSummary> {
  const summary: SeedSummary = {
    usersCreated: [],
    usersExisting: [],
    plansChanged: [],
    garagesCreated: [],
    garagesExisting: [],
    adminNeedsBackendRestart: false,
  }

  let dataset: Dataset
  try {
    dataset = await loadDataset()
  } catch {
    return { ...summary, skipped: 'no pinned dataset (.testdata/): run `npm run testdata` to seed the baseline' }
  }

  const api = new ApiClient(request)
  const mailpit = new MailpitClient(request, seedEnv.mailpitUrl)

  // The API must answer at all: a login attempt with bogus credentials that
  // gets any HTTP answer proves reachability; a network-level throw means
  // there is no stack to seed (foreign --web-base-url runs, offline lint).
  try {
    await api.login('seed.probe@vietgara.test', 'Seed#probe0')
  } catch (error) {
    if (!isHttpAnswer(error)) {
      return { ...summary, skipped: `API at ${seedEnv.apiBaseUrl} is unreachable; skipping the baseline seed` }
    }
  }

  // Owners referenced by the dataset garages, plus the platform admin.
  const ownerKeys = [...new Set(dataset.garages.map((g) => g.owner))]
  const adminKeys = dataset.users.filter((u) => u.platformAdmin).map((u) => u.key)
  const sessions = new Map<string, Session>()

  for (const key of [...ownerKeys, ...adminKeys]) {
    const record = user(dataset, key)
    const address = email(dataset, key)
    const password = baselinePassword(dataset, seedEnv, key)
    const session = await loginOrRegister(api, mailpit, summary, address, password, record.name, record.phone, key)
    sessions.set(key, session)
    if (record.platformAdmin) summary.adminNeedsBackendRestart = true
  }

  // Plans: owners whose dataset plan differs from the current one get
  // the public match. The current subscription is read first so owners
  // already on the right plan — including trial, which is hidden from the
  // public list — never need a match. Plan listing needs a signed-in user
  // (401 anonymous); every failure here is loud, because silently skipping
  // plans leaves multi-garage owners on trial and breaks garage seeding
  // with a confusing plan-limit error far from the cause.
  const ownedByKey = new Map<string, ApiClient>()
  const needingChange: string[] = []
  for (const key of ownerKeys) {
    const record = user(dataset, key)
    if (!record.plan) continue
    const owned = api.withToken(sessions.get(key)?.accessToken)
    const current = await owned.getMySubscription()
    if (!equalFold(current.plan?.code, record.plan) && !equalFold(current.plan?.name, record.plan)) {
      needingChange.push(key)
      ownedByKey.set(key, owned)
    }
  }
  if (needingChange.length > 0) {
    const firstKey = needingChange[0]
    if (!firstKey) throw new Error('dataset has no garage owners')
    const firstSession = sessions.get(firstKey)
    if (!firstSession?.accessToken) throw new Error('seed owners have no sessions')
    const plans = await api.withToken(firstSession.accessToken).listPlans()
    for (const key of needingChange) {
      const record = user(dataset, key)
      const match = plans.data?.filter((p) => equalFold(p.code, record.plan) || equalFold(p.name, record.plan)) ?? []
      if (match.length > 1) throw new Error(`multiple public plans match dataset plan "${record.plan}" for ${key}`)
      const plan = match[0]
      if (!plan?.id) throw new Error(`no public plan matches dataset plan "${record.plan}" for ${key}`)
      const owned = ownedByKey.get(key)
      if (!owned) throw new Error(`seed owner ${key} has no session`)
      const adminKey = adminKeys[0]
      const adminSession = adminKey ? sessions.get(adminKey) : undefined
      if (!adminSession?.accessToken) {
        throw new Error(`plan "${record.plan}" for ${key} needs the dataset's platform admin to approve the plan payment (Release 5.2)`)
      }
      await owned.changeMyPlan(plan.id ?? '', api.withToken(adminSession.accessToken))
      const updated = await owned.getMySubscription()
      if (updated.plan?.id !== plan.id) {
        throw new Error(`plan change for ${key} did not take effect (still ${updated.plan?.code})`)
      }
      summary.plansChanged.push(`${key} -> ${plan.name ?? plan.code}`)
    }
  }

  for (const record of dataset.garages) {
    const ownerSession = sessions.get(record.owner)
    if (!ownerSession) throw new Error(`garage ${record.key} has no seeded owner ${record.owner}`)
    const owned = api.withToken(ownerSession.accessToken)
    const existing = await owned.listGarages()
    const sameName = (existing.data ?? []).filter((g) => g.name === record.name)
    if (sameName.length > 1) throw new Error(`multiple garages are named "${record.name}"`)
    const found = sameName[0]
    if (found) {
      if (found.address !== undefined && record.address !== undefined && found.address !== record.address) {
        throw new Error(`existing garage "${record.name}" differs from the dataset (address)`)
      }
      summary.garagesExisting.push(record.key)
    } else {
      await owned.createGarage({ name: record.name, address: datasetGarage(dataset, record.key).address })
      summary.garagesCreated.push(record.key)
    }
  }

  return summary
}

async function loginOrRegister(
  api: ApiClient,
  mailpit: MailpitClient,
  summary: SeedSummary,
  address: string,
  password: string,
  fullName: string,
  phone: string | undefined,
  key: string,
): Promise<Session> {
  try {
    const session = await api.login(address, password)
    summary.usersExisting.push(key)
    return session
  } catch (error) {
    if (!isHttpAnswer(error)) throw error
  }
  // Not registered (or unverified half of a crashed seed): register, then
  // verify with the OTP from Mailpit — the same flow as `make seed`.
  const initial = await api.register({ email: address, password, fullName, phone })
  const message = await mailpit.waitForMessage(address, { subjectContains: 'VietGara' })
  const verified = await api.withToken(initial.accessToken).verifyEmail(mailpit.extractOtp(message), initial.refreshToken ?? '')
  summary.usersCreated.push(key)
  return verified
}

/** True when the backend answered over HTTP (even with an error status). */
function isHttpAnswer(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && typeof (error as { status?: unknown }).status === 'number'
}

function equalFold(left: string | undefined, right: string | undefined): boolean {
  return (left ?? '').toLowerCase() === (right ?? '').toLowerCase()
}
