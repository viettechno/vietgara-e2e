// E2E-BIL-009 · Permissions: billing view and billing write
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-BIL-009 permissions: billing view and billing write', async ({ page, freshOwner, signIn }) => {
  // A technician has no billing permission: the settlements list answers
  // PERMISSION_DENIED (the sidebar hides the entry; the denial surfaces as
  // the query error text).
  const owner = await freshOwner('bil009-owner')
  const garage = await owner.api.createGarage({ name: 'QA Gara BIL009' })
  const garageId = garage.id ?? ''
  if (!garageId) throw new Error('Garage not found')

  const technician = await freshOwner('bil009-tech')
  const groups = await owner.api.listStaffGroups(garageId)
  const techGroup = (groups.data ?? []).find((g) => g.name === 'Technician')
  if (!techGroup?.id) throw new Error('garage has no default Technician group')
  const candidate = await owner.api.lookupStaffCandidate(garageId, technician.email)
  await owner.api.inviteStaff(garageId, candidate.userId ?? '', [techGroup.id ?? ''])
  const pending = await technician.api.listMyInvitations()
  const invitation = (pending.data ?? []).find((i) => i.id !== undefined)
  if (!invitation?.id) throw new Error('technician has no pending invitation')
  await technician.api.acceptInvitation(invitation.id ?? '')

  await signIn(technician.session, garageId)
  await page.goto('/settlements')
  await expect(page.getByText('You are not allowed to do this.')).toBeVisible()
})
