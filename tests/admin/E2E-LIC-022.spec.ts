// E2E-LIC-022 · The admin sets the trial length; running trials keep theirs
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/03_License_Subscription.md
// Runs in the admin-chromium project (admin origin).
import { expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage } from '../../src/pages/admin/AdminPages.js'

test('E2E-LIC-022 the admin sets the trial length; running trials keep theirs', async ({ page, adminSession, signIn, freshOwner }) => {
  await signIn(adminSession, undefined)
  const plansPage = new AdminPlansPage(page)
  await plansPage.goto()

  const editTrial = async (days: string): Promise<void> => {
    await plansPage.row('trial').getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Trial days').fill(days)
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page.getByText('Changes saved.').first()).toBeVisible()
  }

  // Restore the shared default first, then capture a trial that is already running.
  await editTrial('60')
  const existingOwner = await freshOwner('lic022-existing')
  const existingBefore = await existingOwner.api.getMySubscription()

  try {
    await editTrial('14')

    const newOwner = await freshOwner('lic022-new')
    const newSubscription = await newOwner.api.getMySubscription()
    const newTrialMs = new Date(newSubscription.currentPeriodEnd ?? '').getTime() - Date.now()
    expect(newTrialMs).toBeGreaterThan(13.5 * 24 * 60 * 60 * 1000)
    expect(newTrialMs).toBeLessThan(14.5 * 24 * 60 * 60 * 1000)
    expect((await existingOwner.api.getMySubscription()).currentPeriodEnd).toBe(existingBefore.currentPeriodEnd)

    await plansPage.row('trial').getByRole('button', { name: 'Edit' }).click()
    const trialDays = page.getByLabel('Trial days')
    await trialDays.fill('0')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(trialDays).toHaveValue('0')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Cancel' }).click()

    await plansPage.row('starter').getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByLabel('Trial days')).toHaveCount(0)
    await page.getByRole('button', { name: 'Cancel' }).click()
  } finally {
    const dialog = page.getByRole('dialog')
    if (await dialog.isVisible()) await dialog.getByRole('button', { name: 'Cancel' }).click()
    await editTrial('60')
  }
})
