// E2E-CAT-008 · Excel exports: revenue and stock movements
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { newIdempotencyKey } from '../../src/api/client.js'
import { expect, test } from '../../src/fixtures/index.js'
import { beer330 } from '../../src/fixtures/catalogue.js'
import { closedRepairOrder } from '../../src/fixtures/order-chain.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

const run = promisify(execFile)

/** The shared strings and the first sheet of a downloaded .xlsx (a zip). */
async function workbookText(path: string): Promise<string> {
  const [strings, sheet] = await Promise.all([
    run('unzip', ['-p', path, 'xl/sharedStrings.xml']),
    run('unzip', ['-p', path, 'xl/worksheets/sheet1.xml']),
  ])
  return `${strings.stdout}${sheet.stdout}`
}

test('E2E-CAT-008 Excel exports: revenue and stock movements', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat008', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT008' })
  const gid = garage.id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-888.88' })
  const { part, caseUnit } = await beer330(owner.api, gid)
  await owner.api.receiveStock(gid, part.id ?? '', { quantity: '10', unitId: caseUnit.id, unitCost: 150000 })
  const order = await closedRepairOrder(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  const settlement = await owner.api.createSettlement(gid, order.id ?? '', newIdempotencyKey())
  await owner.api.recordSettlementPayment(
    gid,
    settlement.id ?? '',
    { amount: '970000', method: 'PAYMENT_METHOD_CASH' },
    newIdempotencyKey(),
  )
  await signIn(owner.session, garage.id)

  // Step 1: the dashboard exports this month's revenue.
  await page.goto('/dashboard')
  const revenueDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export revenue Excel' }).click()
  const revenuePath = await (await revenueDownload).path()
  expect(await workbookText(revenuePath)).toContain('970000')

  // Step 2: the movements export shows the base and the entered amount.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await inventory.stockMovementsTab.click()
  const movementsDownload = page.waitForEvent('download')
  await inventory.exportExcelButton.click()
  const text = await workbookText(await (await movementsDownload).path())
  for (const expected of ['BEER-330', '240', 'can', '10', 'case']) expect(text).toContain(`>${expected}<`)
})
