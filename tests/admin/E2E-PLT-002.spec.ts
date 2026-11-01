// E2E-PLT-002 · A role change applies at once; a role in use cannot be deleted
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/10_Platform_Staff.md
// Runs in the admin-chromium project (admin origin).
//
// The browser part: the platform admin creates a role and a group in the admin
// web, sees the permission count and the groups using the role change when the
// role is edited, and is told that a role in use cannot be deleted. That a
// member's access follows a role change at the next request is in the
// blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-PLT-002 a role change applies at once; a role in use cannot be deleted', async ({ page, adminSession, signIn }) => {
  await signIn(adminSession, undefined)
  const stamp = Date.now()
  const roleName = `QA Billing support ${stamp}`
  const groupName = `QA Support group ${stamp}`

  // Step 1: a role with one permission.
  await page.goto('/roles')
  await page.getByRole('button', { name: 'Add role' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Name', { exact: true }).fill(roleName)
  await dialog.getByLabel('View subscriptions').check()
  await dialog.getByRole('button', { name: 'Save' }).click()
  const roleRow = page.locator('tbody tr', { hasText: roleName })
  await expect(roleRow).toBeVisible()
  await expect(roleRow.getByRole('cell').nth(1)).toHaveText('1')

  // Step 2: a group that uses it.
  await page.goto('/groups')
  await page.getByRole('button', { name: 'Add group' }).click()
  await dialog.getByLabel('Name', { exact: true }).fill(groupName)
  await dialog.getByLabel('Role', { exact: true }).selectOption({ label: roleName })
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.locator('tbody tr', { hasText: groupName })).toContainText(roleName)

  // Step 3: editing the role changes its count and the groups using it at once.
  await page.goto('/roles')
  await page.getByRole('button', { name: `Edit: ${roleName}` }).click()
  await dialog.getByLabel('View plans').check()
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(roleRow.getByRole('cell').nth(1)).toHaveText('2')
  await expect(roleRow.getByRole('cell').nth(2)).toHaveText('1')

  // Step 4: a role a group still uses cannot be deleted.
  await page.getByRole('button', { name: `Delete: ${roleName}` }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()
  await expect(roleRow).toBeVisible()
})
