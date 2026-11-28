// Setup shared by the subscription-expiry specs (E2E-LIC-010/011): an
// English-language owner with a garage, one customer and a staff member on
// the Service Advisor group, reached through the API.
import type { ApiClient } from '../api/client.js'
import type { MailpitClient } from '../api/mailpit.js'
import type { Customer, Garage } from '../api/types.js'
import { registerAndVerify, type RegisteredOwner } from './register.js'

export type ExpirySetup = {
  owner: RegisteredOwner
  staff: RegisteredOwner
  garage: Garage
  customer: Customer
}

export async function expirySetup(api: ApiClient, mailpit: MailpitClient, label: string): Promise<ExpirySetup> {
  const owner = await registerAndVerify(api, mailpit, `${label}-owner`, {
    locale: 'LOCALE_EN',
    fullName: `QA Owner ${label.toUpperCase()}`,
  })
  const garage = await owner.api.createGarage({ name: `QA Gara ${label.toUpperCase()} Tan Binh` })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer Em Vo', phone: '0911000010' })

  const staff = await registerAndVerify(api, mailpit, `${label}-staff`, {
    locale: 'LOCALE_EN',
    fullName: `QA Staff ${label.toUpperCase()}`,
  })
  const groups = await owner.api.listStaffGroups(garage.id ?? '')
  const advisor = (groups.data ?? []).find((g) => g.name === 'Service Advisor')
  if (!advisor?.id) throw new Error('default Service Advisor group not found')
  const candidate = await owner.api.lookupStaffCandidate(garage.id ?? '', staff.email)
  const invitation = await owner.api.inviteStaff(garage.id ?? '', candidate.userId ?? '', [advisor.id])
  await staff.api.acceptInvitation(invitation.id ?? '')

  return { owner, staff, garage, customer }
}

/** Polls the owner's subscription until it has `status` (the stack's expiry job runs every few seconds). */
export async function waitForStatus(
  api: ApiClient,
  status: 'SUBSCRIPTION_STATUS_PAST_DUE' | 'SUBSCRIPTION_STATUS_SUSPENDED' | 'SUBSCRIPTION_STATUS_ACTIVE',
  timeoutMs = 90_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const sub = await api.getMySubscription()
    if (sub.status === status) return
    if (Date.now() > deadline) throw new Error(`subscription is ${sub.status} after ${timeoutMs}ms, want ${status}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
