// A garage member holding exactly the given permissions, set up over the API
// the way E2E-CAT-009 does it by hand: a role, a staff group, an invitation
// the member accepts.
import type { RegisteredOwner } from './register.js'

export async function joinWith(
  owner: RegisteredOwner,
  garageId: string,
  member: RegisteredOwner,
  label: string,
  permissions: string[],
): Promise<RegisteredOwner> {
  const role = await owner.api.createRole(`QA ${label}`, permissions)
  const group = await owner.api.createStaffGroup(garageId, `QA ${label}`, role.id ?? '')
  const candidate = await owner.api.lookupStaffCandidate(garageId, member.email)
  await owner.api.inviteStaff(garageId, candidate.userId ?? '', [group.id ?? ''])
  const invitation = ((await member.api.listMyInvitations()).data ?? []).find((i) => i.id)
  await member.api.acceptInvitation(invitation?.id ?? '')
  return member
}
