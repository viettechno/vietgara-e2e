// E2E-INV-010 · Permissions: view-only, and full access
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Three actors: the owner (full access), a Technician member (inventory
// view only, per the default Technician role), and an outsider with no
// garage access at all. Membership is set up over the API (invite +
// accept); every permission assertion is the UI.
import { expect, test } from '../../src/fixtures/index.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-010 permissions: view-only, and full access', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('inv010owner')
  const garage = await owner.api.createGarage({ name: 'QA Gara INV010' })
  await owner.api.createItem(garage.id ?? '', { sku: 'OIL-5W30', name: 'Engine oil 5W-30', unit: 'L' })

  const technician = await freshOwner('inv010tech')
  const groups = await owner.api.listStaffGroups(garage.id ?? '')
  const technicianGroup = (groups.data ?? []).find((g) => g.name === 'Technician')
  if (!technicianGroup?.id) throw new Error('garage has no default Technician group')
  const candidate = await owner.api.lookupStaffCandidate(garage.id ?? '', technician.email)
  await owner.api.inviteStaff(garage.id ?? '', candidate.userId ?? '', [technicianGroup.id ?? ''])
  const pending = await technician.api.listMyInvitations()
  const invitation = (pending.data ?? []).find((i) => i.id !== undefined)
  if (!invitation?.id) throw new Error('technician has no pending invitation')
  await technician.api.acceptInvitation(invitation.id ?? '')

  // View-only: the catalogue and levels show, but no management actions.
  await signIn(technician.session, garage.id)
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.itemRow('OIL-5W30')).toBeVisible()
  await expect(inventory.newItemButton).toBeHidden()
  await expect(page.getByRole('button', { name: 'Receive stock' })).toBeHidden()

  // No access at all: without a garage membership the sidebar offers no
  // Inventory entry (module links need an active garage and its read
  // permission; AppShell filters them by permission).
  const outsider = await freshOwner('inv010out')
  await signIn(outsider.session)
  await page.goto('/garages')
  await expect(page.getByRole('link', { name: 'Inventory' })).toBeHidden()
})
