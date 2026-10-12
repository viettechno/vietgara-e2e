// E2E-IAM-020 · Platform admin uses the admin web; others are denied; the owner web has no admin pages
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/01_Identity_Access.md
//
// Runs in the admin-chromium project (admin origin). Covers the scenario's
// admin-web steps: the admin signs in and both Plans and Subscriptions load;
// a garage owner signs in and sees only Access denied. The manager denial
// (step 3) shares the same RequirePlatformAdmin gate — code-verified, not
// re-clicked. Step 4 (no /admin/* in the owner web) is structural: the owner
// App has no such routes (App.tsx), so there is nothing to drive.
//
// Provision gate: the backend grants PLATFORM_ADMIN_EMAILS only at startup,
// so without the post-seed backend restart the admin login is a normal user
// and this spec skips instead of failing. CI restarts the backend after the
// seed step; see .github/workflows/e2e.yml.
import { env, expect, test } from '../../src/fixtures/index.js'
import { AdminPlansPage, AdminSubscriptionsPage } from '../../src/pages/admin/AdminPages.js'
import { datasetAvailable, email, loadDataset, stubbedPassword, user } from '../../src/testdata/dataset.js'

test('E2E-IAM-020 platform admin uses the admin web; others are denied', async ({ page, api, signIn, freshOwner }) => {
  test.skip(!(await datasetAvailable()) || env.seedEnv !== 'stubbed', 'needs the seeded baseline: `npm run testdata` on the stubbed stack')
  const dataset = await loadDataset()

  const adminSession = await api.login(email(dataset, 'admin'), stubbedPassword(dataset, 'admin')).catch(() => undefined)
  test.skip(!adminSession?.user?.platformAdmin, 'platform admin not provisioned: seed the baseline and restart the backend')

  await signIn(adminSession, undefined)

  const plans = new AdminPlansPage(page)
  await plans.goto()
  await expect(page.getByRole('heading', { name: 'Plans' })).toBeVisible()
  // Seeded by the backend migrations (not the dataset): the catalogue every test relies on.
  await expect(plans.row('trial')).toBeVisible()
  await expect(plans.newPlanButton).toBeVisible()

  const subscriptions = new AdminSubscriptionsPage(page)
  await subscriptions.goto()
  await expect(page.getByRole('heading', { name: 'Subscriptions' })).toBeVisible()
  await subscriptions.search(user(dataset, 'owner1').name ?? '')
  await expect(subscriptions.row(user(dataset, 'owner1').name ?? '')).toBeVisible()

  const owner = await freshOwner('iam020')
  await signIn(owner.session, undefined)
  await plans.goto()
  await expect(page.getByText('Access denied')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
})
