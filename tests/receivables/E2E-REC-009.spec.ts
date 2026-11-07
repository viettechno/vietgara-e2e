// E2E-REC-009 · The receivables screen: filter, search and the reminder schedule
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/14_Receivables.md
//
// The settlement becomes a receivable through an event, so the setup waits for
// it over the API; what the screen shows is asserted in the UI. Nothing is
// overdue on the day a settlement is made (terms are 7 days), so the overdue
// filter is checked to narrow the table to nothing.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'

test('E2E-REC-009 receivables screen: filter, detail and the reminder schedule', async ({ page, signIn, freshOwner }) => {
  test.setTimeout(90_000)
  const owner = await freshOwner('rec009')
  const garage = await owner.api.createGarage({ name: 'QA Gara REC009' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An REC009', phone: '0911000091' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-909.09' })
  const order = await closedRepairOrder(owner.api, garage.id ?? '', customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, garage.id ?? '', order.id ?? '')
  await expect.poll(async () => (await owner.api.listReceivables(garage.id ?? '')).data?.length ?? 0, { timeout: 60_000 }).toBe(1)
  await signIn(owner.session, garage.id)

  await page.goto('/receivables')
  const number = settlement.number ?? ''
  expect(number).not.toBe('')
  const row = page.locator('tbody tr', { hasText: number })
  await expect(row).toContainText('QA Customer An REC009')
  await expect(row).toContainText('970,000')
  await expect(page.getByText('Outstanding', { exact: true }).first()).toBeVisible()

  // Nothing is overdue yet: the filter narrows the table, clearing it brings the row back.
  await page.getByRole('checkbox', { name: 'Overdue only' }).check()
  await expect(page.getByText('No matching results')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Overdue only' }).uncheck()
  await expect(row).toBeVisible()

  // The detail shows the ledger and the settlement it links to.
  await row.getByRole('link', { name: number }).click()
  await expect(page.getByRole('heading', { name: number })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Charge', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open the settlement to record a payment' })).toHaveAttribute(
    'href',
    `/settlements/${settlement.id}`,
  )
  await page.goBack()

  // The reminder schedule: an invalid step is refused beside the field; a valid one is kept after a reload.
  await page.getByRole('button', { name: 'Reminder schedule' }).click()
  const dialog = page.getByRole('dialog')
  const terms = dialog.getByLabel('Payment terms (days)')
  const steps = dialog.getByLabel('Reminder steps (days overdue)')
  await steps.fill('120')
  await expect(dialog.getByText('Enter day counts separated by commas.')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled()
  await terms.fill('14')
  await steps.fill('5, 10')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toBeHidden()

  await page.reload()
  await page.getByRole('button', { name: 'Reminder schedule' }).click()
  await expect(page.getByRole('dialog').getByLabel('Payment terms (days)')).toHaveValue('14')
  await expect(page.getByRole('dialog').getByLabel('Reminder steps (days overdue)')).toHaveValue('5, 10')
  const settings = await owner.api.getReceivableSettings(garage.id ?? '')
  expect(settings.paymentTermsDays).toBe(14)
  expect(settings.reminderOffsetDays).toEqual([5, 10])
})
