// Types of the VietGara REST API, generated from vietgara-proto's OpenAPI
// document (`npm run generate:api`). Only aliases live here -- mirrors the
// same pattern as vietgara-owner-web/src/api/types.ts so the two stay easy
// to cross-reference.
import type { components } from './schema.js'

type Schemas = components['schemas']

export type Account = Schemas['v1Account']
export type Session = Schemas['v1Session']
export type OtpChallenge = Schemas['v1OtpChallenge']
export type Garage = Schemas['v1Garage']
export type GarageStatus = Schemas['v1GarageStatus']
export type Staff = Schemas['v1Staff']
export type StaffStatus = Schemas['v1StaffStatus']
export type Invitation = Schemas['v1Invitation']
export type InvitationStatus = Schemas['v1InvitationStatus']
export type Role = Schemas['v1Role']
export type StaffGroup = Schemas['v1StaffGroup']
export type Permission = Schemas['v1Permission']
export type Plan = Schemas['v1Plan']
export type Subscription = Schemas['v1Subscription']
export type SubscriptionStatus = Schemas['v1SubscriptionStatus']
export type Entitlements = Schemas['v1Entitlements']
export type Customer = Schemas['v1Customer']
export type Vehicle = Schemas['v1Vehicle']
export type Partner = Schemas['v1Partner']
export type PartnerType = Schemas['v1PartnerType']
export type VehicleHistoryEntry = Schemas['v1VehicleHistoryEntry']
export type Quote = Schemas['v1Quote']
export type PublicQuote = Schemas['v1PublicQuote']
export type QuoteLine = Schemas['v1QuoteLine']
export type QuoteStatus = Schemas['v1QuoteStatus']
export type QuoteApprovalMode = Schemas['v1QuoteApprovalMode']
export type QuoteItemType = Schemas['v1QuoteItemType']
export type QuoteLineDecisionInput = Schemas['v1QuoteLineDecisionInput']
export type ConvertQuoteResponse = Schemas['v1ConvertQuoteResponse']
export type RepairOrder = Schemas['v1RepairOrder']
export type RepairOrderLine = Schemas['v1RepairOrderLine']
export type RepairOrderStatus = Schemas['v1RepairOrderStatus']
export type RepairOrderItemType = Schemas['v1RepairOrderItemType']
export type RepairOrderLineStatus = Schemas['v1RepairOrderLineStatus']
export type Item = Schemas['v1Item']
export type StockTransaction = Schemas['v1StockTransaction']
export type StockTransactionType = Schemas['v1StockTransactionType']
export type Pagination = Schemas['v1Pagination']
export type ApiErrorBody = Schemas['v1ErrorResponse']

/** A list answer: {data, pagination}. */
export type ListResponse<T> = { data?: T[]; pagination?: Pagination }
