// E2E-CAT-006 · Part images: up to three, thumbnail in the lists
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { PNG_1X1 } from '../../src/fixtures/catalogue.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'
import { InventoryPage } from '../../src/pages/inventory/InventoryPage.js'

test('E2E-CAT-006 part images: up to three, thumbnail in the lists', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat006', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT006' })
  await owner.api.createSimplePart(garage.id ?? '', {
    sku: 'WPR-24',
    name: 'Wiper blade 24 inch',
    unit: { name: 'Piece', abbreviation: 'pc' },
  })
  await signIn(owner.session, garage.id)

  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  const dialog = await catalogue.openImages('WPR-24')

  // Step 1: up to three images.
  const input = dialog.getByLabel('Add image')
  for (let i = 1; i <= 3; i++) {
    await input.setInputFiles({ name: `wiper-${i}.png`, mimeType: 'image/png', buffer: PNG_1X1 })
    await expect(dialog.getByRole('img')).toHaveCount(i)
  }

  // Step 2: a fourth is not offered; a text file is refused.
  await expect(dialog.getByRole('button', { name: 'A part has at most three images.' })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Remove image 3' }).click()
  await expect(dialog.getByRole('img')).toHaveCount(2)
  await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
  await expect(dialog.getByRole('alert')).toBeVisible()
  await expect(dialog.getByRole('img')).toHaveCount(2)

  // The first image is the thumbnail in the parts and stock lists.
  await dialog.getByRole('button', { name: 'Close', exact: true }).last().click()
  await expect(catalogue.row('WPR-24').locator('img')).toHaveCount(1)
  const inventory = new InventoryPage(page)
  await inventory.goto()
  await expect(inventory.itemRow('WPR-24').locator('img')).toHaveCount(1)

  // Step 3: removing the first promotes the next.
  await catalogue.goto()
  const again = await catalogue.openImages('WPR-24')
  await again.getByRole('button', { name: 'Remove image 1' }).click()
  await expect(again.getByRole('img')).toHaveCount(1)
})
