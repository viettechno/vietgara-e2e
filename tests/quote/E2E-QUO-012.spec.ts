// E2E-QUO-012 · The configured daily limit blocks quote creation, not closing
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/05_Quote_Pricing.md
//
// The plan counts both quotes and repair orders: the quote and its conversion
// use the 2-document limit, while closing still works because it is not a
// creation.
import { expect, test } from '../../src/fixtures/index.js'
import { QuoteFormPage } from '../../src/pages/quotes/QuoteFormPage.js'
import { SubscriptionPage } from '../../src/pages/license/SubscriptionPage.js'

test('E2E-QUO-012 the configured daily limit blocks quote creation, not closing', async ({ page, signIn, freshOwner, adminApi }) => {
  const code = `qa-txn-limit-${Date.now()}`
  const plan = await adminApi.createPlan({
    code,
    name: `QA Txn Limit ${Date.now()}`,
    price: '100000',
    billingCycle: 'BILLING_CYCLE_MONTHLY',
    maxGarages: 1,
    maxStaff: 5,
    maxTransactionsPerDay: 2,
    countedTransactionKinds: ['TRANSACTION_KIND_QUOTE', 'TRANSACTION_KIND_REPAIR_ORDER'],
    isPublic: true,
    isActive: true,
  })

  const owner = await freshOwner('quo012')
  await owner.api.changeMyPlan(plan.id ?? '', adminApi)
  const garage = await owner.api.createGarage({ name: 'QA Gara QUO012' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer An QUO012', phone: '0911000012' })
  const vehicle = await owner.api.createVehicle(garage.id ?? '', { customerId: customer.id ?? '', licensePlate: '51A-121.21' })

  // Counted document 1: the quote. Counted document 2: its repair order.
  const quote = await owner.api.createQuote(garage.id ?? '', {
    customerId: customer.id ?? '',
    vehicleId: vehicle.id ?? '',
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [{ itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change service', quantity: '1', unitPrice: '250000' }],
  })
  const sent = await owner.api.sendQuote(garage.id ?? '', quote.id ?? '')
  const token = (sent.publicUrl ?? '').split('/').pop() ?? ''
  const viewed = await owner.api.getPublicQuote(token)
  await owner.api.decidePublicQuote(
    token,
    (viewed.lines ?? []).map((line) => ({ lineId: line.id ?? '', approved: true })),
  )
  const converted = await owner.api.convertQuote(garage.id ?? '', quote.id ?? '')
  await signIn(owner.session, garage.id)

  await new SubscriptionPage(page).goto()
  await expect(page.getByText('Counted documents today')).toBeVisible()
  await expect(page.getByText('2 / 2').first()).toBeVisible()

  // Transaction 3 is refused.
  const quoteForm = new QuoteFormPage(page)
  await quoteForm.goto()
  await quoteForm.pickCustomer(customer.fullName ?? '', customer.fullName ?? '')
  await quoteForm.pickSearchSelect(quoteForm.vehicleField, vehicle.licensePlate ?? '', vehicle.licensePlate ?? '')
  await quoteForm.fillLine(0, { itemType: 'Labor', description: 'Second job', quantity: '1', unitPrice: '100000' })
  await quoteForm.saveButton.click()
  await expect(
    page.getByText('Your plan limit is reached. Upgrade to add more, or contact support if you are already on the largest plan.'),
  ).toBeVisible()

  // Closing is a separate action from creation and is not counted.
  const order = converted.repairOrderId ?? ''
  const detail = await owner.api.getRepairOrder(garage.id ?? '', order)
  for (const line of detail.lines ?? []) {
    await owner.api.updateRepairOrderLine(garage.id ?? '', order, line.id ?? '', {
      status: 'REPAIR_ORDER_LINE_STATUS_COMPLETED',
      assignedTechnicianIds: [],
    })
  }
  const closed = await owner.api.closeRepairOrder(garage.id ?? '', order)
  expect(closed.status).toBe('REPAIR_ORDER_STATUS_CLOSED')
})
