// E2E-RPT-007 · The report screens
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/17_Reports.md
//
// A closed repair order whose parts were issued shows its profit; the Reports
// page has the technician report and, for those who may see cost, the profit
// report grouped by job, technician and repair order.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder } from '../../src/fixtures/order-chain.js'

test('E2E-RPT-007 report screens: technicians, profit and the order profit', async ({ page, signIn, freshOwner }) => {
  test.setTimeout(90_000)
  const owner = await freshOwner('rpt007')
  const garage = await owner.api.createGarage({ name: 'QA Gara RPT007' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An RPT007', phone: '0911000071' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-707.07' })
  const order = await closedRepairOrder(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  await signIn(owner.session, garage.id)

  // The closed order shows its profit: revenue 970,000, cost not known (no part was issued).
  await page.goto(`/repair-orders/${order.id}`)
  await expect(page.getByText('Profit of the order')).toBeVisible()
  await expect(page.getByText('970,000').first()).toBeVisible()
  await expect(page.getByText("The cost is not known yet: the order's parts have not been issued.")).toBeVisible()

  // Technicians: nobody was assigned to the lines, so the month has none completed by a named technician.
  await page.goto('/reports')
  await expect(page.getByRole('tab', { name: 'Technicians' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Profit' })).toBeVisible()
  await expect(page.getByText(/No line was completed in this period|No technician assigned/)).toBeVisible()

  // Profit: the three groupings, totals and the note for an order without a cost.
  await page.getByRole('tab', { name: 'Profit' }).click()
  // The order's lines name no job, so the whole 970,000 is in the row of no job.
  await expect(page.locator('tbody tr', { hasText: 'No job' })).toContainText('970,000')
  await expect(page.getByText(/1 order has no cost yet/)).toBeVisible()
  await page.getByRole('combobox', { name: 'Group by' }).selectOption({ label: 'Repair order' })
  await expect(page.locator('tbody tr', { hasText: order.number ?? '' })).toBeVisible()
  await page.getByRole('combobox', { name: 'Group by' }).selectOption({ label: 'Technician' })
  await expect(page.getByRole('columnheader', { name: 'Technician' })).toBeVisible()
})
