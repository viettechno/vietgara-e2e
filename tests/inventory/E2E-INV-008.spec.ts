// E2E-INV-008 · Closing a repair order with part lines posts its stock issue and deducts stock
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/07_Inventory.md
//
// The suite's flagship cross-module test: Repair Order (closing) and
// Inventory (stock on hand) meet through repair_order.closed, an
// asynchronous outbox event -- everything up to `closeButton.click()` is
// pure UI, and the assertion below polls the UI for the async result
// rather than reaching for the API, so the test proves what a user
// actually sees, not just that the backend eventually agrees with itself.
import { expect, test } from '../../src/fixtures/index.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'
import { RepairOrderCreateForm, RepairOrderDetailPage } from '../../src/pages/repair-orders/RepairOrderFormPage.js'

test(
  'E2E-INV-008 closing a repair order with part lines automatically deducts stock',
  { tag: '@smoke' },
  async ({ page, signIn, freshOwner }) => {
    // The deduction polls up to 60 s below (Kafka lag under the parallel load of the full suite).
    test.setTimeout(90_000)
    const owner = await freshOwner('inv008')
    const garage = await owner.api.createGarage({ name: 'QA Gara INV008' })
    const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An Nguyen' })
    const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-111.11' })
    const part = await owner.api.createSimplePart(garage.id ?? '', { sku: 'OIL-5W30', name: 'Engine oil 5W-30', reorderThreshold: '5' })
    await owner.api.receiveStock(garage.id ?? '', part.id ?? '', { quantity: '10' })

    await signIn(owner.session, garage.id)

    // Create the repair order through the UI, picking the catalogue part on
    // the part line -- this is what actually links item_ref_id (the part), which is
    // what FR-INV-02's deduction reads.
    const createForm = new RepairOrderCreateForm(page)
    await createForm.goto()
    await createForm.pickVehicle(vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
    await createForm.fillLine(0, { itemType: 'Labor', description: 'Oil change service', quantity: '1', unitPrice: '250000' })
    await createForm.addLine({ itemType: 'Part', description: 'Engine oil 5W-30', quantity: '4', unitPrice: '180000', partSku: 'OIL-5W30' })
    await createForm.createButton.click()
    await expect(page).toHaveURL(/\/repair-orders\/(?!new)[^/]+$/)
    const createdUrl = page.url()

    // Step 1: the draft stock issue (created by an event a moment after the order)
    // reserves the parts before any stock moves.
    const inventory = new InventoryPage(page)
    await inventory.goto()
    await expect(async () => {
      await page.reload()
      await expect(inventory.partRow('OIL-5W30')).toContainText('4 reserved', { timeout: 2_000 })
    }).toPass({ timeout: 60_000 })
    await expect(inventory.partRow('OIL-5W30')).toContainText('10 L')

    const detail = new RepairOrderDetailPage(page)
    await page.goto(createdUrl)
    await detail.setLineStatus(0, 'Completed')
    await detail.saveLine(0)
    await detail.setLineStatus(1, 'Completed')
    await detail.saveLine(1)

    await expect(detail.closeButton).toBeEnabled()
    await detail.closeButton.click()
    await expect(page.getByText('Closed')).toBeVisible()

    // The deduction happens off an outbox event (Event Design; ~2s relay
    // interval in this environment), fetched once per page load -- a
    // locator assertion alone re-checks the same DOM, it doesn't re-fetch.
    // Poll the real Inventory screen by reloading until it agrees. The
    // timeout is generous: the full suite shares the runner with the stack
    // (Kafka lag spikes under parallel load).
    await inventory.goto()
    await expect(async () => {
      await page.reload()
      await expect(inventory.partRow('OIL-5W30')).toContainText('6 L')
    }).toPass({ timeout: 60_000 })

    await inventory.stockMovementsTab.click()
    const movementRow = page.locator('tbody tr', { hasText: 'OIL-5W30' }).filter({ hasText: 'Out' })
    await expect(movementRow).toBeVisible()
    await expect(movementRow).toContainText('Stock issue')
    await expect(movementRow).toContainText('4')
  },
)
