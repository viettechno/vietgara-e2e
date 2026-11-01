// E2E-BIL-011 · An invoice is requested only when the billing party is complete
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/08_Settlement.md
//
// The browser part of FR-CUS-07 on the settlement: choose who is billed,
// tick "The customer asked for a VAT invoice", and be told what the company
// profile still lacks. The rules (the retail receipt, who may change it) are
// in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { SettlementDetailPage } from '../../src/pages/settlements/SettlementsPage.js'

test('E2E-BIL-011 an invoice is requested only when the billing party is complete', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('bil011')
  const gid = (await owner.api.createGarage({ name: 'QA Gara BIL011' })).id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer Hoa Pham BIL011', phone: '0911000111' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-111.11' })
  const profile = await owner.api.createTaxProfile(gid, customer.id ?? '', {
    kind: 'TAX_PROFILE_KIND_COMPANY',
    legalName: 'QA Company Incomplete',
  })
  const order = await closedRepairOrder(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, gid, order.id ?? '')
  await signIn(owner.session, gid)

  const detail = new SettlementDetailPage(page)
  await detail.goto(settlement.id ?? '')
  await expect(page.getByText('Retail receipt, no VAT invoice')).toBeVisible()

  // Steps 1 and 2: the profile has no tax ID and no address, so the dialog says so and refuses to save.
  await detail.openBilling()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Bill to').selectOption(profile.id ?? '')
  await dialog.getByLabel('The customer asked for a VAT invoice').check()
  await expect(dialog.getByText('An invoice needs: tax ID, address.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog.getByRole('alert')).toContainText('An invoice needs: tax ID, address.')
  await dialog.getByRole('button', { name: 'Cancel' }).click()

  // Step 3: the profile is completed; choosing it again takes the new data and the request is saved.
  await owner.api.updateTaxProfile(gid, customer.id ?? '', profile.id ?? '', { taxId: '0312345678', address: '1 Nguyen Hue, Quan 1' })
  await detail.goto(settlement.id ?? '')
  await detail.openBilling()
  await dialog.getByLabel('Bill to').selectOption(profile.id ?? '')
  await dialog.getByLabel('The customer asked for a VAT invoice').check()
  await expect(dialog.getByText('An invoice needs:')).toBeHidden()
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('VAT invoice requested')).toBeVisible()
})
