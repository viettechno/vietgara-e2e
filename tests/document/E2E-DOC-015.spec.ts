// E2E-DOC-015 · In the web console, the owner adds an agent and its printer, and a voucher prints from the Print menu without a dialog
// docs: vietgara-docs/docs/en/05-Testing/E2E_Scenarios/11_Documents.md
//
// The spec plays the print agent (src/fixtures/print-agent.ts): it pairs
// with the code the console shows, connects through the gateway and answers
// the job. A real Windows PC is the manual check E2E-DOC-016.
import { expect, test } from '../../src/fixtures/index.js'
import { closedRepairOrder, pendingSettlement } from '../../src/fixtures/order-chain.js'
import { connectAgent, pairAgent } from '../../src/fixtures/print-agent.js'
import { newIdempotencyKey } from '../../src/api/client.js'

test('E2E-DOC-015 the owner adds a print agent and its printer, and a voucher prints silently', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('doc015')
  const gid = (await owner.api.createGarage({ name: 'QA Gara DOC015' })).id ?? ''
  const customer = await owner.api.createCustomer(gid, { fullName: 'QA Customer An DOC015', phone: '0911000151' })
  const vehicle = await owner.api.createVehicle(gid, { customerId: customer.id ?? '', licensePlate: '51A-151.51' })
  const order = await closedRepairOrder(owner.api, gid, customer.id ?? '', vehicle.id ?? '')
  const settlement = await pendingSettlement(owner.api, gid, order.id ?? '')
  await owner.api.recordSettlementPayment(
    gid,
    settlement.id ?? '',
    { amount: '970000', method: 'PAYMENT_METHOD_CASH' },
    newIdempotencyKey(),
  )
  await signIn(owner.session, gid)

  // Step 1: add the agent; the dialog shows the code and the command for the PC.
  await page.goto(`/garages/${gid}/settings`)
  await page.getByRole('button', { name: 'Add a print agent' }).click()
  await page.getByRole('dialog').getByRole('textbox', { name: /Name/ }).fill('Quầy')
  await page.getByRole('button', { name: 'Create the pairing code' }).click()
  const pairing = page.getByRole('dialog', { name: 'Pair “Quầy”' })
  await expect(pairing.getByTestId('pairing-code')).toHaveText(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/)
  const code = (await pairing.getByTestId('pairing-code').textContent()) ?? ''
  expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/)
  await expect(pairing.getByTestId('pairing-command')).toContainText(`setup --server`)
  await expect(pairing.getByTestId('pairing-command')).toContainText(code)
  await expect(pairing.getByRole('link', { name: /Download the agent for Windows/ })).toBeVisible()
  await pairing.getByRole('button', { name: 'Close', exact: true }).last().click()

  // Step 2: the agent pairs and connects; the console says so.
  const agent = await connectAgent(await pairAgent(owner.api, code))
  try {
    // The server has stored the printers the agent reported.
    await expect.poll(async () => (await owner.api.listPrintAgents(gid)).agents?.[0]?.printers?.map((p) => p.name)).toEqual(['XP-80C'])
    await page.reload()
    await expect(page.getByText('Connected', { exact: true })).toBeVisible()
    await expect(page.getByText('QUAY-PC · e2e')).toBeVisible()

    // Step 3: the agent's printer.
    await page.getByRole('button', { name: 'Add a printer of an agent' }).click()
    const form = page.getByRole('dialog')
    await expect(form.getByLabel(/Printer on the PC/)).toHaveValue('XP-80C')
    await form.getByRole('textbox', { name: /Name/ }).fill('Quầy K80')
    await form.getByLabel('Payment voucher').check()
    await form.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Agent “Quầy”: XP-80C')).toBeVisible()

    // Step 4: print the voucher on it from the settlement.
    await page.goto(`/settlements/${settlement.id}`)
    // Silent: no PDF is fetched for the browser's print dialog.
    const dialogPrints: string[] = []
    page.on('request', (request) => {
      if (request.url().includes('pdf:print')) dialogPrints.push(request.url())
    })
    await page.getByRole('button', { name: /^Print: / }).click()
    await expect(page.getByRole('menuitem')).toHaveText(['Quầy K80', 'Another printer (print dialog)'])
    await page.getByRole('menuitem', { name: 'Quầy K80' }).click()

    const job = await agent.nextJob()
    await expect(page.getByText('Sending to Quầy K80…')).toBeVisible()
    expect(job.title).toBe('VietGara payment_voucher')
    expect(job.printer).toBe('XP-80C')
    expect(job.format).toBe('escpos')
    expect(job.paperSize).toBe('K80')
    expect([...job.data.subarray(0, 2)]).toEqual([0x1b, 0x40])
    agent.printed(job.id)
    await expect(page.getByText('Printed on Quầy K80')).toBeVisible()
    expect(dialogPrints).toEqual([])
  } finally {
    agent.close()
  }
})
