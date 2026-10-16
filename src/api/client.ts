// Drives the backend directly for test setup and teardown (00_Test_Data.md
// §4: "When the suite is automated, this becomes an API fixture"). Never
// used to assert UI behaviour -- that stays in the page objects and specs.
// One instance is bound to at most one bearer token; `withToken` returns a
// new instance for a different actor, so a test can hold several signed-in
// identities (e.g. an advisor and, separately, an owner) without them
// clobbering each other's session.
import type { APIRequestContext } from '@playwright/test'
import { jsonRequest, query } from './http.js'
import type {
  PlanPaymentRequest,
  SubscriptionSummary,
  Supplier,
  ConvertQuoteResponse,
  Customer,
  Entitlements,
  Garage,
  Invitation,
  ListResponse,
  PackagingUnit,
  Part,
  PartCategory,
  PaymentMethod,
  Plan,
  PublicQuote,
  Quote,
  QuoteApprovalMode,
  QuoteItemType,
  QuoteLineDecisionInput,
  QuoteStatus,
  RepairOrder,
  RepairOrderItemType,
  RepairOrderLineStatus,
  RepairOrderStatus,
  Session,
  Settlement,
  SettlementStatus,
  StaffGroup,
  StockLevel,
  StockTransaction,
  UploadedFile,
  Unit,
  Subscription,
  Vehicle,
} from './types.js'

export type RegisterInput = { email: string; password: string; fullName: string; phone?: string; locale?: string }
export type GarageInput = { name: string; address?: string; timezone?: string; defaultQuoteApprovalMode?: QuoteApprovalMode }
export type CustomerInput = { fullName: string; phone?: string; email?: string; address?: string; personalDataConsent?: boolean }
export type VehicleInput = {
  customerId: string
  licensePlate: string
  make?: string
  model?: string
  year?: number
  vin?: string
  engineNumber?: string
}
export type QuoteLineInput = { itemType: QuoteItemType; description: string; quantity: string; unitPrice: string }
export type QuoteInput = {
  customerId: string
  vehicleId: string
  approvalMode?: QuoteApprovalMode
  notes?: string
  lines: QuoteLineInput[]
}
export type SendQuoteResult = { quote: Quote; publicUrl?: string; emailed?: boolean }
export type RepairOrderLineInput = {
  itemType: RepairOrderItemType
  itemRefId?: string
  description: string
  quantity: string
  unitPrice: string
}
export type CreateRepairOrderInput = { vehicleId: string; lines: RepairOrderLineInput[] }
export type UpdateLineInput = { status: RepairOrderLineStatus; assignedTechnicianIds: string[] }
export type PartInput = {
  sku: string
  name: string
  baseUnitId: string
  salePrice?: number
  categoryId?: string
  brand?: string
  reorderThreshold?: string
}
export type StockReceiptInput = { quantity: string; unitId?: string; unitCost?: number }
export type StockReceiptResult = { transaction?: StockTransaction; stockLevel?: StockLevel }

// A valid 1x1 PNG: the transfer screenshot the plan payment flow requires.
const TRANSFER_EVIDENCE_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

export class ApiClient {
  private readonly unitCache = new Map<string, Unit>()

  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  /** A new client bound to a different actor's token (or none, for public endpoints). */
  withToken(token: string | undefined): ApiClient {
    return new ApiClient(this.request, token)
  }

  private get<T>(path: string): Promise<T> {
    return jsonRequest(this.request, 'GET', path, { token: this.token })
  }

  post<T>(path: string, body: unknown = {}): Promise<T> {
    return jsonRequest(this.request, 'POST', path, { token: this.token, body })
  }

  /**
   * A creation with financial impact (settlement, payment): the API
   * requires an Idempotency-Key and answers a repeated key with the first
   * answer, so retrying one user action with the same key records it once.
   * Make one key per user action (see `newIdempotencyKey`).
   */
  private postIdempotent<T>(path: string, body: unknown, idempotencyKey: string): Promise<T> {
    return jsonRequest(this.request, 'POST', path, {
      token: this.token,
      body,
      headers: { 'Idempotency-Key': idempotencyKey },
    })
  }

  private patch<T>(path: string, body: unknown): Promise<T> {
    return jsonRequest(this.request, 'PATCH', path, { token: this.token, body })
  }

  private put<T>(path: string, body: unknown): Promise<T> {
    return jsonRequest(this.request, 'PUT', path, { token: this.token, body })
  }

  private delete<T = void>(path: string): Promise<T> {
    return jsonRequest(this.request, 'DELETE', path, { token: this.token })
  }

  // ---- Auth (FRD 3.1) ----------------------------------------------------

  register(input: RegisterInput): Promise<Session> {
    return this.post('/v1/auth/register', input)
  }

  login(email: string, password: string): Promise<Session> {
    return this.post('/v1/auth/login', { email, password })
  }

  sendEmailVerificationOtp(): Promise<{ expiresAt: string; resendAvailableAt: string }> {
    return this.post('/v1/auth/email-verification/otp')
  }

  verifyEmail(otpCode: string, refreshToken: string): Promise<Session> {
    return this.post('/v1/auth/email-verification', { otpCode, refreshToken })
  }

  // ---- Tenant / Garage (FRD 3.2/3.3) -------------------------------------

  createGarage(input: GarageInput): Promise<Garage> {
    return this.post('/v1/garages', input)
  }

  listGarages(): Promise<ListResponse<Garage>> {
    return this.get('/v1/garages')
  }

  updateGarage(garageId: string, input: Partial<GarageInput>): Promise<Garage> {
    return this.patch(`/v1/garages/${garageId}`, input)
  }

  inviteStaff(garageId: string, userId: string, groupIds: string[]): Promise<Invitation> {
    return this.post(`/v1/garages/${garageId}/invitations`, { userId, groupIds })
  }

  lookupStaffCandidate(garageId: string, text: string): Promise<{ userId?: string; candidateType?: string }> {
    return this.get(`/v1/garages/${garageId}/staff-candidates${query({ query: text })}`)
  }

  listMyInvitations(pending = true): Promise<ListResponse<Invitation>> {
    return this.get(`/v1/me/invitations${query({ pending })}`)
  }

  acceptInvitation(invitationId: string): Promise<Invitation> {
    return this.post(`/v1/me/invitations/${invitationId}/accept`)
  }

  // ---- License (FRD 3.4) -------------------------------------------------

  listPlans(): Promise<ListResponse<Plan>> {
    return this.get('/v1/plans')
  }

  getMySubscription(): Promise<Subscription> {
    return this.get('/v1/me/subscription')
  }

  /**
   * Moves the owner onto a plan the way Release 5.2 does it: a plan-change
   * payment request, the transfer declared with evidence, and a platform
   * admin approving it (`admin` is a client signed in as a platform admin).
   * Returns the subscription with the new plan.
   */
  async changeMyPlan(planId: string, admin: ApiClient): Promise<Subscription> {
    const request = await this.post<PlanPaymentRequest>('/v1/me/subscription/payment-requests', {
      planId,
      kind: 'PLAN_PAYMENT_KIND_CHANGE',
    })
    const id = request.id ?? ''
    await this.post<PlanPaymentRequest>(`/v1/me/subscription/payment-requests/${id}:submit`, {
      payerName: 'QA Payer',
      transferredAmount: request.amountDue ?? '0',
      paidAt: new Date().toISOString(),
      evidence: { content: TRANSFER_EVIDENCE_PNG, contentType: 'image/png' },
    })
    return admin.post<Subscription>(`/v1/admin/plan-payment-requests/${id}:approve`, {})
  }

  getEntitlements(garageId: string): Promise<Entitlements> {
    return this.get(`/v1/garages/${garageId}/entitlements`)
  }

  createPlan(input: {
    code: string
    name: string
    price: string
    currency?: string
    billingCycle: 'BILLING_CYCLE_MONTHLY' | 'BILLING_CYCLE_YEARLY'
    maxGarages: number
    maxStaff: number
    maxTransactionsPerDay: number
    features?: string[]
    isPublic?: boolean
    isActive?: boolean
  }): Promise<Plan> {
    const { maxGarages, maxStaff, maxTransactionsPerDay, currency, ...rest } = input
    return this.post('/v1/admin/plans', {
      ...rest,
      currency: currency ?? 'VND',
      limits: { maxGarages, maxStaff, maxTransactionsPerDay },
    })
  }

  // ---- Platform admin (FRD 3.4) --------------------------------------------

  listSubscriptions(query: string): Promise<ListResponse<SubscriptionSummary>> {
    return this.get(`/v1/admin/subscriptions?query=${encodeURIComponent(query)}`)
  }

  extendSubscription(subscriptionId: string, days: number): Promise<Subscription> {
    return this.post(`/v1/admin/subscriptions/${subscriptionId}/extensions`, { days })
  }

  // ---- Supplier (FRD 3.23) ------------------------------------------------

  createSupplier(garageId: string, input: { name: string; taxCode?: string }): Promise<Supplier> {
    return this.post(`/v1/garages/${garageId}/suppliers`, input)
  }

  // ---- Customer & Vehicle (FRD 3.5) --------------------------------------

  createCustomer(garageId: string, input: CustomerInput): Promise<Customer> {
    return this.post(`/v1/garages/${garageId}/customers`, input)
  }

  createVehicle(garageId: string, input: VehicleInput): Promise<Vehicle> {
    return this.post(`/v1/garages/${garageId}/vehicles`, input)
  }

  vehicleHistory(garageId: string, vehicleId: string) {
    return this.get(`/v1/garages/${garageId}/vehicles/${vehicleId}/history`)
  }

  // ---- Quote & Pricing (FRD 3.6, Release 1.2) ----------------------------

  createQuote(garageId: string, input: QuoteInput): Promise<Quote> {
    return this.post(`/v1/garages/${garageId}/quotes`, input)
  }

  listQuotes(garageId: string, params: { status?: QuoteStatus; page?: number } = {}): Promise<ListResponse<Quote>> {
    return this.get(`/v1/garages/${garageId}/quotes${query({ page: 1, pageSize: 20, ...params })}`)
  }

  sendQuote(garageId: string, quoteId: string): Promise<SendQuoteResult> {
    return this.post(`/v1/garages/${garageId}/quotes/${quoteId}/sending`)
  }

  recordQuoteDecision(garageId: string, quoteId: string, decisions: QuoteLineDecisionInput[]): Promise<Quote> {
    return this.post(`/v1/garages/${garageId}/quotes/${quoteId}/decision`, { decisions })
  }

  convertQuote(garageId: string, quoteId: string): Promise<ConvertQuoteResponse> {
    return this.post(`/v1/garages/${garageId}/quotes/${quoteId}/conversion`)
  }

  // Public link: no bearer token (see withToken(undefined)). The gateway
  // unwraps the single-message responses, so these answer bare quotes.
  getPublicQuote(token: string): Promise<PublicQuote> {
    return this.get(`/v1/public/quotes/${token}`)
  }

  decidePublicQuote(token: string, decisions: QuoteLineDecisionInput[]): Promise<PublicQuote> {
    return this.post(`/v1/public/quotes/${token}/decision`, { decisions })
  }

  // ---- Repair Order (FRD 3.7, Release 1.3) -------------------------------

  createRepairOrder(garageId: string, input: CreateRepairOrderInput): Promise<RepairOrder> {
    return this.post(`/v1/garages/${garageId}/repair-orders`, input)
  }

  listRepairOrders(
    garageId: string,
    params: { status?: RepairOrderStatus; technicianId?: string; page?: number } = {},
  ): Promise<ListResponse<RepairOrder>> {
    return this.get(`/v1/garages/${garageId}/repair-orders${query({ page: 1, pageSize: 100, ...params })}`)
  }

  updateRepairOrderLine(garageId: string, orderId: string, lineId: string, input: UpdateLineInput): Promise<RepairOrder> {
    return this.patch(`/v1/garages/${garageId}/repair-orders/${orderId}/lines/${lineId}`, input)
  }

  getRepairOrder(garageId: string, orderId: string): Promise<RepairOrder> {
    return this.get(`/v1/garages/${garageId}/repair-orders/${orderId}`)
  }

  closeRepairOrder(garageId: string, orderId: string): Promise<RepairOrder> {
    return this.post(`/v1/garages/${garageId}/repair-orders/${orderId}/closing`)
  }

  // ---- Catalogue (FRD 3.21, Release 6.0) ----------------------------------

  createUnit(garageId: string, name: string, abbreviation: string): Promise<Unit> {
    return this.post(`/v1/garages/${garageId}/units`, { name, abbreviation })
  }

  createCategory(garageId: string, name: string, parentId?: string): Promise<PartCategory> {
    return this.post(`/v1/garages/${garageId}/part-categories`, { name, parentId })
  }

  createPart(garageId: string, input: PartInput): Promise<Part> {
    return this.post(`/v1/garages/${garageId}/parts`, input)
  }

  updatePart(garageId: string, partId: string, input: Partial<PartInput>): Promise<Part> {
    const mask = Object.keys(input).map((k) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`))
    return this.patch(`/v1/garages/${garageId}/parts/${partId}?updateMask=${mask.join(',')}`, input)
  }

  createRole(name: string, permissions: string[]): Promise<{ id?: string }> {
    return this.post('/v1/roles', { name, permissions })
  }

  createStaffGroup(garageId: string, name: string, roleId: string): Promise<StaffGroup> {
    return this.post(`/v1/garages/${garageId}/staff-groups`, { name, roleId })
  }

  getPart(garageId: string, partId: string): Promise<Part> {
    return this.get(`/v1/garages/${garageId}/parts/${partId}`)
  }

  setPartUnits(
    garageId: string,
    partId: string,
    packagingUnits: Array<Pick<PackagingUnit, 'unitId' | 'factor'> & { salePrice?: number }>,
  ): Promise<Part> {
    return this.put(`/v1/garages/${garageId}/parts/${partId}/units`, { packagingUnits })
  }

  deletePart(garageId: string, partId: string): Promise<{ outcome?: string }> {
    return this.delete(`/v1/garages/${garageId}/parts/${partId}`)
  }

  /** Uploads an image for a part and attaches it. */
  async addPartImage(garageId: string, partId: string, png: Buffer): Promise<Part> {
    const file: UploadedFile = await this.post(`/v1/garages/${garageId}/files`, {
      kind: 'FILE_KIND_PART_IMAGE',
      entityType: 'part',
      entityId: partId,
      content: png.toString('base64'),
      contentType: 'image/png',
    })
    return this.post(`/v1/garages/${garageId}/parts/${partId}/images`, { fileId: file.id })
  }

  /**
   * A part with its own base unit, for tests that only need "a part": the unit is
   * created on first use in the garage (units are unique by name).
   */
  async createSimplePart(
    garageId: string,
    input: {
      sku: string
      name: string
      unit?: { name: string; abbreviation: string }
      salePrice?: number
      brand?: string
      reorderThreshold?: string
    },
  ): Promise<Part> {
    const unit = input.unit ?? { name: 'Litre', abbreviation: 'L' }
    const key = `${garageId}:${unit.name.toLowerCase()}`
    let created = this.unitCache.get(key)
    if (!created) {
      created = await this.createUnit(garageId, unit.name, unit.abbreviation)
      this.unitCache.set(key, created)
    }
    return this.createPart(garageId, {
      sku: input.sku,
      name: input.name,
      baseUnitId: created.id ?? '',
      salePrice: input.salePrice,
      brand: input.brand,
      reorderThreshold: input.reorderThreshold,
    })
  }

  // ---- Inventory (FRD 3.8, Release 1.3) ----------------------------------

  getStockLevel(garageId: string, partId: string): Promise<StockLevel> {
    return this.get(`/v1/garages/${garageId}/inventory-items/${partId}`)
  }

  receiveStock(garageId: string, partId: string, input: StockReceiptInput): Promise<StockReceiptResult> {
    return this.post(`/v1/garages/${garageId}/stock-receipts`, { itemId: partId, ...input })
  }

  listStockMovements(garageId: string, params: { itemId?: string; page?: number } = {}): Promise<ListResponse<StockTransaction>> {
    return this.get(`/v1/garages/${garageId}/reports/stock-movements${query({ page: 1, pageSize: 20, ...params })}`)
  }

  // ---- Staff groups (FRD 3.3) --------------------------------------------

  listStaffGroups(garageId: string): Promise<ListResponse<StaffGroup>> {
    return this.get(`/v1/garages/${garageId}/staff-groups`)
  }

  // ---- Settlement (FRD 3.9, Release 1.4) -----------------------------------
  //
  // The gateway unwraps the single-message proto responses, so these answer
  // bare settlements — the same shape `vietgara-owner-web` reads.

  createSettlement(garageId: string, repairOrderId: string, idempotencyKey: string): Promise<Settlement> {
    return this.postIdempotent(`/v1/garages/${garageId}/settlements`, { repairOrderId }, idempotencyKey)
  }

  listSettlements(garageId: string, params: { status?: SettlementStatus; page?: number } = {}): Promise<ListResponse<Settlement>> {
    return this.get(`/v1/garages/${garageId}/settlements${query({ page: 1, pageSize: 20, ...params })}`)
  }

  getSettlement(garageId: string, settlementId: string): Promise<Settlement> {
    return this.get(`/v1/garages/${garageId}/settlements/${settlementId}`)
  }

  recordSettlementPayment(
    garageId: string,
    settlementId: string,
    input: { amount: string; method: PaymentMethod; note?: string },
    idempotencyKey: string,
  ): Promise<Settlement> {
    return this.postIdempotent(`/v1/garages/${garageId}/settlements/${settlementId}/payments`, input, idempotencyKey)
  }
}

/** One Idempotency-Key per user action, reused for its retries. */
export function newIdempotencyKey(): string {
  return crypto.randomUUID()
}
