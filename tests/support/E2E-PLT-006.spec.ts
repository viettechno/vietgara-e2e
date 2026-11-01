// E2E-PLT-006 · Admin staff request a garage, the owner approves, staff read
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/10_Platform_Staff.md
//
// The owner's side in the owner web: a request from platform support waits on
// the Support access page, the owner approves it, sees the grant, and revokes
// it. The staff member's read-only session, its limits and the access log
// entries are in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-PLT-006 the owner approves a support request and revokes the access', async ({ page, signIn, freshOwner, adminApi }) => {
  const owner = await freshOwner('plt006')
  const gid = (await owner.api.createGarage({ name: 'QA Gara PLT006' })).id ?? ''
  const stamp = Date.now()

  // Platform support staff who may request access (set up over the API).
  const role = await adminApi.createPlatformRole({
    name: `QA support ${stamp}`,
    permissions: ['PLATFORM_PERMISSION_SUPPORT_WRITE', 'PLATFORM_PERMISSION_GARAGE_DIRECTORY_READ'],
  })
  const group = await adminApi.createPlatformGroup({ name: `QA support group ${stamp}`, roleId: role.id })
  const staff = await freshOwner('plt006staff', { fullName: 'QA Support Staff' })
  await adminApi.invitePlatformStaff(staff.email, group.id)
  await staff.api.acceptFirstPlatformInvitation()
  await staff.api.requestSupportGrant(gid, 'Ticket 4711: a settlement looks wrong', 24)

  // Step 1: the request waits for the owner, with the reason and the length.
  await signIn(owner.session, gid)
  await page.goto(`/support-access?garageId=${gid}`)
  await expect(page.getByText('QA Support Staff')).toBeVisible()
  await expect(page.getByText('Reason: Ticket 4711: a settlement looks wrong · 24 hours from your approval')).toBeVisible()

  // Step 2: approving moves it to the grants, valid for a limited time.
  await page.getByRole('button', { name: 'Approve' }).click()
  const grants = page.locator('tbody tr', { hasText: 'QA Support Staff' })
  await expect(grants).toBeVisible()
  await expect(page.getByRole('button', { name: 'Approve' })).toHaveCount(0)

  // Step 3: revoking ends the access at once.
  await grants.getByRole('button', { name: 'Revoke' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Revoke' }).click()
  await expect(grants.getByRole('button', { name: 'Revoke' })).toHaveCount(0)
})
