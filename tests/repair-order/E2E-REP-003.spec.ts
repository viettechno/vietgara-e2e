// E2E-REP-003 · A repair order created from an approved quote inherits its data
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/06_Repair_Order.md
import { expect, test } from '../../src/fixtures/index.js'
import { GaragesPage } from '../../src/pages/garages/GaragesPage.js'

test('E2E-REP-003 repair order from approved quote inherits data', async ({ page, api, freshOwner, signIn }) => {
  const owner = await freshOwner('rep003')
  await signIn(owner.session)

  const garages = new GaragesPage(page)
  await garages.goto()
  await garages.createGarage({ name: 'QA Gara REP003', address: '1 Test St, Quan 1, TP.HCM' })

  // Get garage ID
  const listed = await api.withToken(owner.session.accessToken).listGarages()
  const garage = listed.data?.find(g => g.name === 'QA Gara REP003')
  const garageId = garage?.id
  if (!garageId) throw new Error('Garage not found')

  // Create customer and vehicle via API
  const customer = await api.withToken(owner.session.accessToken).createCustomer(garageId, {
    fullName: 'QA Customer REP003',
    phone: '0911000033',
  })
  if (!customer.id) throw new Error('Customer creation failed')
  const vehicle = await api.withToken(owner.session.accessToken).createVehicle(garageId, {
    customerId: customer.id,
    licensePlate: '51A-999.99',
    make: 'Toyota',
    model: 'Vios',
    year: 2020,
  })
  if (!vehicle.id) throw new Error('Vehicle creation failed')

  // Create and approve a quote via API
  const quote = await api.withToken(owner.session.accessToken).createQuote(garageId, {
    customerId: customer.id,
    vehicleId: vehicle.id,
    approvalMode: 'QUOTE_APPROVAL_MODE_LINK',
    lines: [
      { itemType: 'QUOTE_ITEM_TYPE_LABOR', description: 'Oil change', quantity: '1', unitPrice: '250000' },
      { itemType: 'QUOTE_ITEM_TYPE_PART', description: 'Oil filter', quantity: '1', unitPrice: '100000' },
    ],
  })
  if (!quote.id) throw new Error('Quote creation failed')

  // Send for approval (LINK mode)
  const sendResult = await api.withToken(owner.session.accessToken).sendQuote(garageId, quote.id)
  const publicUrl = sendResult.publicUrl
  if (!publicUrl) throw new Error('No public URL for quote')

  // Approve from public link
  const token = publicUrl.split('/').pop()!
  const publicQuote = await api.withToken(undefined).getPublicQuote(token)
  const line0Id = publicQuote.lines?.[0]?.id
  const line1Id = publicQuote.lines?.[1]?.id
  if (!line0Id || !line1Id) throw new Error('Public quote lines missing')
  await api.withToken(undefined).decidePublicQuote(token, [
    { lineId: line0Id, approved: true },
    { lineId: line1Id, approved: true },
  ])

  // Convert to repair order
  const convertResult = await api.withToken(owner.session.accessToken).convertQuote(garageId, quote.id)
  const repairOrderId = (convertResult as { repairOrder?: { id: string } }).repairOrder?.id
  if (!repairOrderId) throw new Error('No repair order created')

  // Verify repair order in UI
  await page.goto(`/repair-orders/${repairOrderId}`)
  await expect(page.getByText('QA Customer REP003')).toBeVisible()
  await expect(page.getByText('51A-999.99')).toBeVisible()
  await expect(page.getByText('Oil change')).toBeVisible()
  await expect(page.getByText('Oil filter')).toBeVisible()
  await expect(page.getByText('350,000')).toBeVisible() // Total
  await expect(page.getByText('Open')).toBeVisible() // Status
})