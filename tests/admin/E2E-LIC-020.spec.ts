// E2E-LIC-020 · Platform payment details and manual credit adjustments are audited and permission-checked
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
//
// The browser part: the platform admin edits the bank details and uploads the
// QR code in "Payment details"; a file that is not an image is refused; an
// owner who then asks for a plan is shown what the admin saved. The permission
// checks, the credit adjustments and "a quote keeps the instructions it
// started with" are in the blackbox suite.
import { env, expect, test } from '../../src/fixtures/index.js'

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

test('E2E-LIC-020 platform payment details are edited by the admin and shown to owners', async ({
  page,
  browser,
  adminSession,
  signIn,
  freshOwner,
}) => {
  await signIn(adminSession, undefined)
  const holder = `QA Holder ${Date.now()}`

  // Steps 1 and 2: edit and save the bank details.
  await page.goto('/payment-settings')
  await page.getByLabel('Bank').fill('QA Bank')
  await page.getByLabel('Account number').fill('0123456789')
  await page.getByLabel('Account holder').fill(holder)
  await page.getByLabel('Transfer instructions').fill('Write the reference in the transfer note.')
  await page.getByLabel('Support phone').fill('0900000020')
  await page.getByLabel('Support e-mail').fill('support020@vietgara.test')
  await page.getByLabel('Support Zalo').fill('VietGara LIC020')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Payment details saved.')).toBeVisible()

  await page.reload()
  await expect(page.getByLabel('Account holder')).toHaveValue(holder)
  await expect(page.getByLabel('Support phone')).toHaveValue('0900000020')
  await expect(page.getByLabel('Support e-mail')).toHaveValue('support020@vietgara.test')
  await expect(page.getByLabel('Support Zalo')).toHaveValue('VietGara LIC020')

  // Step 3: a PNG is accepted as the QR code, a text file is not.
  await page.getByLabel('QR code image').setInputFiles({ name: 'qr.png', mimeType: 'image/png', buffer: PNG })
  await expect(page.getByText('QR code saved.')).toBeVisible()
  await page.getByLabel('QR code image').setInputFiles({ name: 'qr.png', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
  await expect(page.getByText('Choose a PNG, JPEG or WebP image.')).toBeVisible()

  // Step 4: an owner who asks for a plan is shown what the admin saved.
  const owner = await freshOwner('lic020')
  const ownerContext = await browser.newContext({ baseURL: env.webBaseUrl })
  try {
    const ownerPage = await ownerContext.newPage()
    await ownerPage.addInitScript((session) => {
      localStorage.setItem('vietgara.language', 'en')
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      if (session.user) localStorage.setItem('vietgara.user', JSON.stringify(session.user))
    }, owner.session)
    await ownerPage.goto('/subscription')
    await expect(ownerPage.getByText('Need a larger plan or help?')).toBeVisible()
    await expect(ownerPage.getByText('0900000020')).toBeVisible()
    await expect(ownerPage.getByText('support020@vietgara.test')).toBeVisible()
    await expect(ownerPage.getByText('VietGara LIC020')).toBeVisible()
  } finally {
    await ownerContext.close()
  }

  const plans = await owner.api.listPlans()
  const plan = (plans.data ?? []).find((p) => p.code !== 'trial')
  const request = await owner.api.post<{ instructions?: { accountHolder?: string; bankName?: string } }>(
    '/v1/me/subscription/payment-requests',
    {
      planId: plan?.id ?? '',
      kind: 'PLAN_PAYMENT_KIND_CHANGE',
    },
  )
  expect(request.instructions?.accountHolder).toBe(holder)
  expect(request.instructions?.bankName).toBe('QA Bank')
})
