// E2E-INV-016 · A technician sees quantities but no cost
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// Cost (average cost, stock value, unit cost, totals, the purchases and valuation
// reports) is for callers with inventory.cost.read; the default Technician role
// has inventory view only. Membership is set up over the API; the assertions are the UI.
import { expect, test } from '../../src/fixtures/index.js'
import { createSuppliers } from '../../src/fixtures/inventory.js'
import { GoodsReceiptPage } from '../../src/pages/inventory/GoodsReceiptPage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-INV-016 a technician sees quantities but no cost', async ({ page, signIn, freshOwner }) => {
  // English-locale owner: the default Technician group name snapshots the owner's locale.
  const owner = await freshOwner('inv016owner', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara INV016' })
  const gid = garage.id ?? ''
  const part = await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30' })
  const { first } = await createSuppliers(owner.api, gid)
  const { receipt } = await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitCost: 150000, supplierId: first.id })

  const technician = await freshOwner('inv016tech')
  const groups = await owner.api.listStaffGroups(gid)
  const technicianGroup = (groups.data ?? []).find((g) => g.name === 'Technician')
  if (!technicianGroup?.id) throw new Error('garage has no default Technician group')
  const candidate = await owner.api.lookupStaffCandidate(gid, technician.email)
  await owner.api.inviteStaff(gid, candidate.userId ?? '', [technicianGroup.id])
  const pending = await technician.api.listMyInvitations()
  const invitation = (pending.data ?? []).find((i) => i.id !== undefined)
  if (!invitation?.id) throw new Error('technician has no pending invitation')
  await technician.api.acceptInvitation(invitation.id)

  // Steps 1-3: the technician sees the quantity, not the cost, and has no cost reports.
  await signIn(technician.session, garage.id)
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')
  await expect(inventory.partRow('OIL-5W30')).not.toContainText('₫')
  await expect(page.getByRole('columnheader', { name: 'Average cost' })).toBeHidden()
  await expect(page.getByRole('columnheader', { name: 'Stock value' })).toBeHidden()
  await expect(inventory.purchasesTab).toBeHidden()
  await expect(inventory.valuationTab).toBeHidden()
  const goodsReceipt = new GoodsReceiptPage(page)
  await goodsReceipt.goto(receipt.id ?? '')
  await expect(goodsReceipt.lineRow(0)).toContainText('OIL-5W30')
  await expect(goodsReceipt.lineRow(0)).toContainText('10')
  await expect(page.getByRole('columnheader', { name: 'Unit cost (VND)' })).toBeHidden()
  await expect(page.getByRole('columnheader', { name: 'Amount' })).toBeHidden()
  await expect(page.getByText('₫')).toHaveCount(0)

  // Step 4: the owner sees all of it.
  await signIn(owner.session, garage.id)
  await inventory.goto()
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫150,000')
  await expect(inventory.partRow('OIL-5W30')).toContainText('₫1,500,000')
  await expect(inventory.purchasesTab).toBeVisible()
  await expect(inventory.valuationTab).toBeVisible()
  await goodsReceipt.goto(receipt.id ?? '')
  await expect(page.getByRole('columnheader', { name: 'Unit cost (VND)' })).toBeVisible()
  await expect(goodsReceipt.lineRow(0)).toContainText('₫1,500,000')
})
