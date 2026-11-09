// E2E-LIC-023 · Only configured transaction kinds use the daily limit
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin); business documents use the API fixture.
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test('E2E-LIC-023 only configured transaction kinds use the daily limit', async ({ page, adminSession, adminApi, signIn, freshOwner }) => {
  await signIn(adminSession, undefined)
  const code = `qa-counting-${Date.now()}`
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()
  await plansPage.newPlanButton.click()
  await page.getByLabel('Code').fill(code)
  await page.getByLabel('Name').fill('QA Counting')
  await page.getByLabel('Price').fill('1000000')
  await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
  await page.getByLabel('Max garages').fill('1')
  await page.getByLabel('Max staff').fill('5')
  await page.getByLabel('Max transactions per day').fill('3')
  const countedRepairOrders = page.locator('input[name="countedTransactionKinds"][value="TRANSACTION_KIND_REPAIR_ORDER"]')
  const countedQuotes = page.locator('input[name="countedTransactionKinds"][value="TRANSACTION_KIND_QUOTE"]')
  await expect(countedRepairOrders).toBeChecked()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  const owner = await freshOwner('lic023')
  const listed = await owner.api.listPlans()
  const plan = (listed.data ?? []).find((item) => item.code === code)
  if (!plan?.id) throw new Error('QA Counting plan not listed')
  await owner.api.changeMyPlan(plan.id, adminApi)

  const garage = await owner.api.createGarage({ name: 'QA Gara LIC023' })
  const garageId = garage.id ?? ''
  const customer = await owner.api.createCustomer(garageId, { fullName: 'QA Customer LIC023', phone: '0911000023' })
  const vehicle = await owner.api.createVehicle(garageId, {
    customerId: customer.id ?? '',
    licensePlate: '51A-023.00',
  })

  const quotes = []
  for (let index = 0; index < 5; index += 1) {
    quotes.push(
      await owner.api.createQuote(garageId, {
        customerId: customer.id ?? '',
        vehicleId: vehicle.id ?? '',
        approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
        lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: `LIC023 labor ${index}`, quantity: '1', unitPrice: '100000' }],
      }),
    )
  }

  for (const quote of quotes.slice(0, 2)) {
    const sent = await owner.api.sendQuote(garageId, quote.id ?? '')
    const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
    const publicQuote = await owner.api.withToken(undefined).getPublicQuote(token)
    await owner.api.withToken(undefined).decidePublicQuote(
      token,
      (publicQuote.lines ?? []).map((line) => ({ lineId: line.id ?? '', approved: true })),
    )
    await owner.api.convertQuote(garageId, quote.id ?? '')
  }

  const directOrder = () =>
    owner.api.createRepairOrder(garageId, {
      vehicleId: vehicle.id ?? '',
      lines: [
        {
          itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR',
          description: 'LIC023 direct labor',
          quantity: '1',
          unitPrice: '100000',
        },
      ],
    })

  await directOrder()
  await expect(directOrder()).rejects.toMatchObject({ code: 'PLAN_LIMIT_REACHED' })

  await plansPage.row(code).getByRole('button', { name: 'Edit' }).click()
  await countedQuotes.check()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()

  const quoteOwner = await freshOwner('lic023-quotes')
  await quoteOwner.api.changeMyPlan(plan.id, adminApi)
  const quoteGarage = await quoteOwner.api.createGarage({ name: 'QA Quote Gara LIC023' })
  const quoteCustomer = await quoteOwner.api.createCustomer(quoteGarage.id ?? '', {
    fullName: 'QA Quote Customer LIC023',
    phone: '0911000024',
  })
  const quoteVehicle = await quoteOwner.api.createVehicle(quoteGarage.id ?? '', {
    customerId: quoteCustomer.id ?? '',
    licensePlate: '51A-023.01',
  })
  const countedQuote = (index: number) =>
    quoteOwner.api.createQuote(quoteGarage.id ?? '', {
      customerId: quoteCustomer.id ?? '',
      vehicleId: quoteVehicle.id ?? '',
      approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
      lines: [
        {
          itemType: 'QUOTE_ITEM_TYPE_LABOR',
          description: `LIC023 counted quote ${index}`,
          quantity: '1',
          unitPrice: '100000',
        },
      ],
    })
  await countedQuote(1)
  await countedQuote(2)
  await countedQuote(3)
  await expect(countedQuote(4)).rejects.toMatchObject({
    code: 'PLAN_LIMIT_REACHED',
  })

  await plansPage.row(code).getByRole('button', { name: 'Edit' }).click()
  await countedRepairOrders.uncheck()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Changes saved.').first()).toBeVisible()
  const uncountedOrder = await directOrder()
  expect(uncountedOrder.id).toBeTruthy()
})
