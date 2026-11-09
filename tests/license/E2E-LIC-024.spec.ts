// E2E-LIC-024 · Credit is used oldest first and lapses one year after it was earned
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { waitForStatus } from '../../src/fixtures/expiry-setup.js'
import { ageCreditEntry, endPeriod, expireCreditEntry, timeshiftAvailable } from '../../src/fixtures/timeshift.js'
import type { PlanPaymentRequest } from '../../src/api/types.js'

const TRANSFER_EVIDENCE_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

test('E2E-LIC-024 credit is used oldest first and lapses one year after it was earned', async ({ adminApi, freshOwner }) => {
  test.skip(!timeshiftAvailable(), 'needs DATABASE_URL to age credit and trigger the expiry job')

  const owner = await freshOwner('lic024')
  const plan = await adminApi.createPlan({
    code: `qa-credit-${Date.now()}`,
    name: 'QA Credit',
    price: '600000',
    billingCycle: 'BILLING_CYCLE_YEARLY',
    maxGarages: 1,
    maxStaff: 5,
    maxTransactionsPerDay: 50,
  })
  const subscription = await owner.api.changeMyPlan(plan.id ?? '', adminApi)
  const subscriptionId = subscription.id ?? ''
  if (!subscriptionId) throw new Error('QA Credit subscription not found')

  const stamp = Date.now()
  const lotA = `LIC024 A ${stamp}`
  const lotB = `LIC024 B ${stamp}`
  const freshLot = `LIC024 fresh A ${stamp}`
  const adjust = (amount: number, note: string) =>
    adminApi.post(`/v1/admin/subscriptions/${subscriptionId}/credit-adjustments`, { amount, note })
  const ledger = () => owner.api.listMyCreditLedger()
  const quote = (planId: string, kind: 'PLAN_PAYMENT_KIND_CHANGE' | 'PLAN_PAYMENT_KIND_RENEW') =>
    owner.api.post<PlanPaymentRequest>('/v1/me/subscription/payment-requests', { planId, kind })
  const submitWithoutEvidence = (request: PlanPaymentRequest) =>
    owner.api.post<PlanPaymentRequest>(`/v1/me/subscription/payment-requests/${request.id}:submit`, {
      paymentMethod: 'PAYMENT_METHOD_BANK_TRANSFER',
      payerName: 'QA Payer',
      transferredAmount: request.amountDue ?? '0',
      paidAt: new Date().toISOString(),
    })
  const approve = (request: PlanPaymentRequest) => adminApi.post(`/v1/admin/plan-payment-requests/${request.id}:approve`, {})

  await adjust(500000, lotA)
  await adjust(300000, lotB)
  await ageCreditEntry(owner.email, lotA, 11)
  await ageCreditEntry(owner.email, lotB, 2)

  const creditSnapshot = (await owner.api.getMySubscription()) as typeof subscription & { nextCreditExpiry?: string }
  const initialLedger = (await ledger()).data ?? []
  const entryA = initialLedger.find((entry) => entry.note === lotA)
  const entryB = initialLedger.find((entry) => entry.note === lotB)
  expect(Number(creditSnapshot.creditBalance)).toBe(800000)
  expect(entryA?.remaining).toBe('500000')
  expect(entryB?.remaining).toBe('300000')
  expect(new Date(entryA?.expiresAt ?? '').getTime()).toBeLessThan(new Date(entryB?.expiresAt ?? '').getTime())
  const earnedAt = new Date(entryA?.createdAt ?? '')
  const oneYearLater = new Date(earnedAt)
  oneYearLater.setUTCFullYear(oneYearLater.getUTCFullYear() + 1)
  expect(Math.abs(new Date(entryA?.expiresAt ?? '').getTime() - oneYearLater.getTime())).toBeLessThan(60_000)
  expect(creditSnapshot.nextCreditExpiry).toBe(entryA?.expiresAt)

  const renewal = await quote(plan.id ?? '', 'PLAN_PAYMENT_KIND_RENEW')
  expect(renewal.creditApplied).toBe('600000')
  expect(renewal.amountDue).toBe('0')
  await submitWithoutEvidence(renewal)
  await approve(renewal)

  const entries = (await ledger()).data ?? []
  expect(entries.find((entry) => entry.note === lotA)?.remaining).toBe('0')
  expect(entries.find((entry) => entry.note === lotB)?.remaining).toBe('200000')
  expect(Number((await owner.api.getMySubscription()).creditBalance)).toBe(200000)

  await adjust(500000, freshLot)
  await ageCreditEntry(owner.email, freshLot, 11)
  await expireCreditEntry(owner.email, freshLot)
  await expect
    .poll(async () => (await ledger()).data?.some((entry) => entry.kind === 'CREDIT_ENTRY_KIND_EXPIRED' && entry.amount === '-500000'), {
      timeout: 90_000,
    })
    .toBe(true)
  expect(Number((await owner.api.getMySubscription()).creditBalance)).toBe(200000)

  await endPeriod(owner.email)
  await waitForStatus(owner.api, 'SUBSCRIPTION_STATUS_PAST_DUE')
  const cheaperPlan = await adminApi.createPlan({
    code: `qa-credit-lower-${Date.now()}`,
    name: 'QA Credit Lower',
    price: '400000',
    billingCycle: 'BILLING_CYCLE_YEARLY',
    maxGarages: 1,
    maxStaff: 5,
    maxTransactionsPerDay: 50,
  })
  const availableCreditQuote = await quote(cheaperPlan.id ?? '', 'PLAN_PAYMENT_KIND_CHANGE')
  expect(availableCreditQuote.creditApplied).toBe('200000')
  expect(availableCreditQuote.amountDue).toBe('200000')

  const expiringQuote = await quote(cheaperPlan.id ?? '', 'PLAN_PAYMENT_KIND_CHANGE')
  expect(expiringQuote.creditApplied).toBe('200000')
  await owner.api.post(`/v1/me/subscription/payment-requests/${expiringQuote.id}:submit`, {
    paymentMethod: 'PAYMENT_METHOD_BANK_TRANSFER',
    payerName: 'QA Payer',
    transferredAmount: expiringQuote.amountDue ?? '0',
    paidAt: new Date().toISOString(),
    evidence: { content: TRANSFER_EVIDENCE_PNG, contentType: 'image/png' },
  })
  await expireCreditEntry(owner.email, lotB)
  await expect
    .poll(async () => (await ledger()).data?.some((entry) => entry.kind === 'CREDIT_ENTRY_KIND_EXPIRED' && entry.amount === '-200000'), {
      timeout: 90_000,
    })
    .toBe(true)
  await expect(approve(expiringQuote)).rejects.toMatchObject({ code: 'CREDIT_EXPIRED' })
  const stillWaiting = await owner.api.getMyPlanPaymentRequest(expiringQuote.id ?? '')
  expect(stillWaiting.status).toBe('PLAN_PAYMENT_STATUS_SUBMITTED')

  await owner.api.post(`/v1/me/subscription/payment-requests/${expiringQuote.id}:cancel`, {})
  const noCreditQuote = await quote(cheaperPlan.id ?? '', 'PLAN_PAYMENT_KIND_CHANGE')
  expect(noCreditQuote.creditApplied).toBe('0')
  expect(noCreditQuote.amountDue).toBe('400000')
})
