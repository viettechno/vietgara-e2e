// E2E-LIC-023 · Only the kinds a plan counts use its daily limit; a plan with subscribers cannot change them
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin); business documents use the API fixture.
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

const lockedMessage = "This plan has subscribers, so its price, billing cycle, limits and features can't change. Create a new plan instead."

test('E2E-LIC-023 only the kinds a plan counts use its daily limit', async ({ page, adminSession, adminApi, signIn, freshOwner }) => {
  await signIn(adminSession, undefined)
  const stamp = Date.now()
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()

  const counted = (kind: string) => page.locator(`input[name="countedTransactionKinds"][value="TRANSACTION_KIND_${kind}"]`)

  // A plan with a limit of 3 a day that counts the kinds asked for (the form starts with repair orders ticked).
  const createPlan = async (code: string, name: string, kinds: { quotes: boolean; repairOrders: boolean }) => {
    await plansPage.newPlanButton.click()
    await page.getByLabel('Code').fill(code)
    await page.getByLabel('Name').fill(name)
    await page.getByLabel('Price').fill('1000000')
    await page.getByLabel('Billing cycle').selectOption('BILLING_CYCLE_YEARLY')
    await page.getByLabel('Max garages').fill('1')
    await page.getByLabel('Max staff').fill('5')
    await page.getByLabel('Max transactions per day').fill('3')
    await expect(counted('REPAIR_ORDER')).toBeChecked()
    await expect(counted('QUOTE')).not.toBeChecked()
    if (kinds.quotes) await counted('QUOTE').check()
    if (!kinds.repairOrders) await counted('REPAIR_ORDER').uncheck()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Changes saved.').first()).toBeVisible()
  }

  // An owner on the plan, with a garage, a customer and a vehicle.
  const ownerOn = async (code: string, label: string, phone: string, plate: string) => {
    const owner = await freshOwner(label)
    const listed = await owner.api.listPlans()
    const plan = (listed.data ?? []).find((item) => item.code === code)
    if (!plan?.id) throw new Error(`${code} not listed`)
    await owner.api.changeMyPlan(plan.id, adminApi)
    const garage = await owner.api.createGarage({ name: `QA Gara ${label}` })
    const garageId = garage.id ?? ''
    const customer = await owner.api.createCustomer(garageId, { fullName: `QA Customer ${label}`, phone })
    const vehicle = await owner.api.createVehicle(garageId, { customerId: customer.id ?? '', licensePlate: plate })
    const quote = (index: number) =>
      owner.api.createQuote(garageId, {
        customerId: customer.id ?? '',
        vehicleId: vehicle.id ?? '',
        approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
        lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: `${label} quote ${index}`, quantity: '1', unitPrice: '100000' }],
      })
    const order = () =>
      owner.api.createRepairOrder(garageId, {
        vehicleId: vehicle.id ?? '',
        lines: [{ itemType: 'REPAIR_ORDER_ITEM_TYPE_LABOR', description: `${label} direct labor`, quantity: '1', unitPrice: '100000' }],
      })
    return { owner, garageId, quote, order }
  }

  // 1. A plan that counts repair orders only: quotes are free, a conversion and direct orders count.
  const repairCode = `qa-counting-${stamp}`
  await createPlan(repairCode, 'QA Counting', { quotes: false, repairOrders: true })
  const first = await ownerOn(repairCode, 'lic023', '0911000023', '51A-023.00')

  const quotes = []
  for (let index = 0; index < 5; index += 1) quotes.push(await first.quote(index))
  for (const quote of quotes.slice(0, 2)) {
    const sent = await first.owner.api.sendQuote(first.garageId, quote.id ?? '')
    const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
    const publicQuote = await first.owner.api.withToken(undefined).getPublicQuote(token)
    await first.owner.api.withToken(undefined).decidePublicQuote(
      token,
      (publicQuote.lines ?? []).map((line) => ({ lineId: line.id ?? '', approved: true })),
    )
    await first.owner.api.convertQuote(first.garageId, quote.id ?? '')
  }
  await first.order()
  await expect(first.order()).rejects.toMatchObject({ code: 'PLAN_LIMIT_REACHED' })

  // 2. The plan now has a subscriber: its counted kinds are locked.
  await plansPage.row(repairCode).getByRole('button', { name: 'Edit' }).click()
  await counted('QUOTE').check()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText(lockedMessage)).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()

  // 3. A plan that counts quotes too: the fourth quote of the day is refused.
  const quoteCode = `qa-counting-quotes-${stamp}`
  await createPlan(quoteCode, 'QA Counting Quotes', { quotes: true, repairOrders: true })
  const second = await ownerOn(quoteCode, 'lic023-quotes', '0911000024', '51A-023.01')
  await second.quote(1)
  await second.quote(2)
  await second.quote(3)
  await expect(second.quote(4)).rejects.toMatchObject({ code: 'PLAN_LIMIT_REACHED' })

  // 4. A plan that counts quotes only: repair orders are free.
  const freeCode = `qa-counting-free-${stamp}`
  await createPlan(freeCode, 'QA Counting Free Orders', { quotes: true, repairOrders: false })
  const third = await ownerOn(freeCode, 'lic023-free', '0911000025', '51A-023.02')
  for (let index = 0; index < 4; index += 1) expect((await third.order()).id).toBeTruthy()
})
