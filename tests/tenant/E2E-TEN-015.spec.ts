// E2E-TEN-015 · Deactivate, reactivate and remove a member
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-TEN-015 deactivate, reactivate and remove a member', async ({ page, api, freshOwner, signIn }) => {
  // Create owner with garage
  const owner = await freshOwner('ten015-owner')
  await signIn(owner.session)
  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara TEN015', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find(g => g.name === 'QA Gara TEN015')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Create freelancer user and add to garage with Service Advisor group
  const freelancerEmail = `signup.ten015-freelancer.${Date.now()}@vietgara.test`
  const freelancerInitial = await api.register({ email: freelancerEmail, password: 'Qa@123456', fullName: 'QA Freelancer TEN015' })

  // Get Service Advisor group
  const groups = await api.withToken(owner.session.accessToken).listStaffGroups(garageId)
  const advisorGroup = groups.data?.find(g => g.name.toLowerCase().includes('advisor'))
  if (!advisorGroup?.id) throw new Error('Service Advisor group not found')

  // Invite freelancer
  const freelancerUserId = freelancerInitial.user?.id
  if (!freelancerUserId) throw new Error('Freelancer user ID missing')
  await api.withToken(owner.session.accessToken).inviteStaff(garageId, freelancerUserId, [advisorGroup.id])

  // Freelancer accepts
  const freelancerApi = api.withToken(freelancerInitial.accessToken)
  const invites = await freelancerApi.listMyInvitations()
  const invite = invites.data?.find(i => i.garageId === garageId)
  if (invite?.id) await freelancerApi.acceptInvitation(invite.id)

  // Verify freelancer is active member
  await page.goto(`/garages/${garageId}/staff`)
  await expect(page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByText('Active')).toBeVisible()

  // Deactivate freelancer
  await page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByRole('button', { name: 'Deactivate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByText('Inactive')).toBeVisible()

  // Reactivate freelancer
  await page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByRole('button', { name: 'Activate' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByText('Active')).toBeVisible()

  // Remove freelancer from garage
  await page.getByRole('row', { name: 'QA Freelancer TEN015' }).getByRole('button', { name: 'Remove from garage' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByRole('row', { name: 'QA Freelancer TEN015' })).toBeHidden()

  // Verify owner row has no actions
  const ownerRow = page.getByRole('row', { name: 'QA Owner TEN015' })
  await expect(ownerRow.getByRole('button', { name: 'Change groups' })).toBeHidden()
  await expect(ownerRow.getByRole('button', { name: 'Deactivate' })).toBeHidden()
  await expect(ownerRow.getByRole('button', { name: 'Remove from garage' })).toBeHidden()
})