// E2E-CUS-015 · Link request confirmed with the one-time code
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// The advisor asks the user who owns the customer's verified e-mail to link;
// the code goes to that user, who reads it out; the advisor enters it. The
// advisor is never told whose account it is. The rules (cooldown, wrong code,
// who may ask, ending a link) are in the blackbox suite.
import { expect, test } from '../../src/fixtures/index.js'

test('E2E-CUS-015 a link request is confirmed with the one-time code', async ({ page, signIn, freshOwner, mailpit }) => {
  const advisor = await freshOwner('cus015')
  const person = await freshOwner('cus015person')
  const garage = await advisor.api.createGarage({ name: 'QA Gara CUS015' })
  const customer = await advisor.api.createCustomer(garage.id ?? '', {
    fullName: 'QA Customer Link CUS015',
    phone: '0911000151',
    email: person.email,
  })
  await signIn(advisor.session, garage.id)

  await page.goto(`/customers/${customer.id}`)
  await expect(page.getByRole('button', { name: 'Request link' })).toBeVisible()

  // Step 1: request the link and send the code.
  await page.getByRole('button', { name: 'Request link' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Send code' }).click()
  await expect(dialog.getByText('Ask the customer for the code we sent them, then enter it here.')).toBeVisible()

  // Step 2: the user reads the code out of their mail; the advisor types it.
  // The inbox also holds the sign-up code and the welcome mail, so the link mail is found by its subject.
  const code = mailpit.extractOtp(await mailpit.waitForMessage(person.email, { subjectContains: 'link your VietGara account' }))

  await dialog.getByLabel('Code the customer read out').fill(code)
  await dialog.getByRole('button', { name: 'Confirm link' }).click()

  // Step 3: the customer is linked (the page never shows whose account it is: the answer carries no user data).
  await expect(page.getByText('The customer is linked.')).toBeVisible()
  await expect(page.getByText('Linked', { exact: true }).first()).toBeVisible()
  await expect(dialog).toBeHidden()
})
