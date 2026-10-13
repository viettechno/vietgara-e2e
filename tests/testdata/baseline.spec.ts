// Shared-testdata consumption proof: the seeded baseline behind the suite
// is really the pinned dataset — the dataset owners log in and own the
// dataset garages by the dataset names.
//
// Skips without `.testdata/` (run `npm run testdata`) and off the stubbed
// stack (baseline passwords exist only in `environments.stubbed`; staging
// keeps only `passwordRef`s). NON-smoke: it asserts the seed, not a product
// flow, and only runs where the seed runs.
import { env, expect, test } from '../../src/fixtures/index.js'
import { datasetAvailable, email, garage, loadDataset, stubbedPassword, user } from '../../src/testdata/dataset.js'

test('seeded baseline users own the dataset garages', async ({ api }) => {
  test.skip(!(await datasetAvailable()), 'needs the pinned dataset: run `npm run testdata`')
  test.skip(env.seedEnv !== 'stubbed', 'baseline passwords exist only on the stubbed stack')

  const dataset = await loadDataset()
  const expectations: Array<{ owner: string; garages: string[] }> = [
    { owner: 'owner1', garages: ['gara1-1', 'gara1-2'] },
    { owner: 'owner2', garages: ['gara2-1'] },
  ]

  for (const { owner, garages } of expectations) {
    const session = await api.login(email(dataset, owner), stubbedPassword(dataset, owner))
    expect(session.user?.fullName, `${owner} full name`).toBe(user(dataset, owner).name)
    const listed = await api.withToken(session.accessToken).listGarages()
    const names = (listed.data ?? []).map((g) => g.name)
    for (const key of garages) {
      expect(names, `${owner} garages`).toContain(garage(dataset, key).name)
    }
  }
})
