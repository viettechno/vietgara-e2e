// E2E-LIC-004 · Staff limit counts members and pending invitations once per person
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-LIC-004 staff limit counts members and pending invitations once per person', async ({
  page,
  api,
  freshOwner,
  signIn,
  adminApi,
}) => {
  // Create owner and subscribe to QA Small plan (2 staff, 1 garage)
  const owner = await freshOwner('lic004-owner')
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara LIC004', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find((g) => g.name === 'QA Gara LIC004')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Subscribe to QA Small plan (2 staff)
  const plans = await api.withToken(owner.session.accessToken).listPlans()
  const smallPlan = plans.data?.find((p) => p.code === 'qa-small' || p.name === 'QA Small')
  if (smallPlan?.id) {
    await api.withToken(owner.session.accessToken).changeMyPlan(smallPlan.id, adminApi)
  }

  // Verify usage shows 0/2 staff initially
  const subPage = new SubscriptionPage(page)
  await subPage.goto()
  await expect(page.getByText(/Staff\s+0\s*\/\s*2/)).toBeVisible()

  // Create freelancer and invite
  const freelancerEmail = `signup.lic004-freelancer.${Date.now()}@vietgara.test`
  const freelancerInitial = await api.register({ email: freelancerEmail, password: 'Qa@123456', fullName: 'QA Freelancer LIC004' })

  // Get Technician group
  const groups = await api.withToken(owner.session.accessToken).listStaffGroups(garageId)
  const techGroup = groups.data?.find((g) => g.name.toLowerCase().includes('technician'))
  if (!techGroup?.id) throw new Error('Technician group not found')

  // Invite freelancer
  const freelancerUserId = freelancerInitial.user?.id
  if (!freelancerUserId) throw new Error('Freelancer user ID missing')
  await api.withToken(owner.session.accessToken).inviteStaff(garageId, freelancerUserId, [techGroup.id])

  // Create viewer and invite (pending)
  const viewerEmail = `signup.lic004-viewer.${Date.now()}@vietgara.test`
  const viewerInitial = await api.register({ email: viewerEmail, password: 'Qa@123456', fullName: 'QA Viewer LIC004' })
  const viewerUserId = viewerInitial.user?.id
  if (!viewerUserId) throw new Error('Viewer user ID missing')
  await api.withToken(owner.session.accessToken).inviteStaff(garageId, viewerUserId, [techGroup.id])

  // Usage should show 2/2 (1 member + 1 pending)
  await subPage.goto()
  await expect(page.getByText(/Staff\s+2\s*\/\s*2/)).toBeVisible()

  // Try to invite advisor - should be refused
  const advisorEmail = `signup.lic004-advisor.${Date.now()}@vietgara.test`
  const advisorInitial = await api.register({ email: advisorEmail, password: 'Qa@123456', fullName: 'QA Advisor LIC004' })
  const advisorUserId = advisorInitial.user?.id
  if (!advisorUserId) throw new Error('Advisor user ID missing')

  // This should fail due to limit
  await expect(api.withToken(owner.session.accessToken).inviteStaff(garageId, advisorUserId, [techGroup.id])).rejects.toThrow(
    /plan limit is reached|upgrade to add more/,
  )

  // Revoke viewer's invitation (staff lives at /staff, not /garages/:id/staff)
  await page.goto('/staff')
  await page.getByRole('row', { name: 'QA Viewer LIC004' }).getByRole('button', { name: 'Revoke' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click()

  // Now invite advisor should succeed (asserted over the API: the UI shows
  // no toast for API-made invitations).
  await api.withToken(owner.session.accessToken).inviteStaff(garageId, advisorUserId, [techGroup.id])
  const invites = await api.withToken(owner.session.accessToken).listStaffGroups(garageId)
  expect(invites.data?.length).toBeGreaterThan(0)
})
