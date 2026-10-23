// E2E-PLT-001 · Platform staff: an invited user gets read-only subscription access, then loses it
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/10_Platform_Staff.md
//
// Runs in the admin-chromium project (admin origin). The platform admin sets
// up a role with only `subscription.read` and a group "Billing support"; a
// fresh user, who has no platform access yet, accepts the invitation from the
// access-denied screen and sees the subscriptions but neither the plans nor
// the write actions. Removing the user from the group takes the access away
// at their next request.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-PLT-001 invited staff see subscriptions read-only until removed from the group', async ({
  page,
  adminApi,
  signIn,
  freshOwner,
}) => {
  // The stack may run images from before Release 8.1: skip, never fail.
  const supported = await adminApi.getPlatformAccess().then(
    () => true,
    () => false,
  )
  test.skip(!supported, 'needs the backend and admin web of Release 8.1')

  const stamp = Date.now()
  const role = await adminApi.createPlatformRole({
    name: `Billing read-only ${stamp}`,
    permissions: ['PLATFORM_PERMISSION_SUBSCRIPTION_READ'],
  })
  const group = await adminApi.createPlatformGroup({ name: `Billing support ${stamp}`, roleId: role.id })
  const staff = await freshOwner('plt001')
  await signIn(staff.session, undefined)

  // No platform access yet: the app says so.
  await page.goto('/')
  await expect(page.getByText('Access denied')).toBeVisible()

  // The invitation arrives; accepting it opens the app.
  await adminApi.invitePlatformStaff(staff.email, group.id)
  await page.reload()
  await expect(page.getByText(/invited you to the group/)).toBeVisible()
  await page.getByRole('button', { name: 'Accept' }).click()

  // Only the subscriptions are in the menu and nothing can be changed.
  await expect(page.getByRole('heading', { name: 'Subscriptions' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Subscriptions' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Plans' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Extend' })).toHaveCount(0)

  // A deep link to a page outside the role is refused.
  await page.goto('/plans')
  await expect(page.getByText('You cannot view this page')).toBeVisible()

  // Removing the user from the group blocks their next request.
  const userId = staff.session.user?.id ?? ''
  await adminApi.removePlatformStaffMember(group.id, userId)
  await page.goto('/subscriptions')
  await expect(page.getByText('Access denied')).toBeVisible()
})
