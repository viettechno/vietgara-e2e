// E2E-CAT-002 · Receive by the case, issue by the can
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { SUPPLIER_1, createSuppliers } from '../../src/fixtures/inventory.js'
import { beer330 } from '../../src/fixtures/catalogue.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test('E2E-CAT-002 receive by the case, issue by the can', { tag: '@smoke' }, async ({ page, signIn, freshOwner }) => {
  // Events (stock issue, reservation, posting) are polled for up to 60 s; the full suite shares the runner with the stack.
  test.setTimeout(120_000)
  const owner = await freshOwner('cat002', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT002' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An Nguyen' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-222.22' })
  await beer330(owner.api, garage.id ?? '')
  await createSuppliers(owner.api, garage.id ?? '')
  await signIn(owner.session, garage.id)

  // Step 1: 10 cases at 150,000 a case.
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await inventory.receiveStock('BEER-330', { quantity: '10', unit: 'case', unitCost: '150000', supplier: SUPPLIER_1 })
  await expect(inventory.partRow('BEER-330')).toContainText('240 can')

  // Step 2: the movement shows both amounts.
  await inventory.stockMovementsTab.click()
  const receipt = page.locator('tbody tr', { hasText: 'BEER-330' }).filter({ hasText: 'In' })
  await expect(receipt).toContainText('240 can')
  await expect(receipt).toContainText('10 case')

  // Step 3: 30 cans on a repair order, completed and closed.
  const createForm = new RepairOrderCreateForm(page)
  await createForm.goto()
  await createForm.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await createForm.fillLine(0, { itemType: 'Part', description: 'Beer 330ml', quantity: '30', unitPrice: '9000', partSku: 'BEER-330' })
  await createForm.createButton.click()
  await expect(page).toHaveURL(/\/repair-orders\/(?!new)[^/]+$/)
  const detail = new RepairOrderDetailPage(page)
  await detail.setLineStatus(0, 'Completed')
  await detail.saveLine(0)
  await detail.closeButton.click()
  await expect(page.getByText('Closed')).toBeVisible()

  // Step 4: the deduction arrives off an outbox event; poll the screen.
  await inventory.goto()
  await expect(async () => {
    await page.reload()
    await expect(inventory.partRow('BEER-330')).toContainText('210 can')
  }).toPass({ timeout: 60_000 })
})
