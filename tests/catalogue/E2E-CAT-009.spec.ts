// E2E-CAT-009 · Permissions: catalogue read-only, and full access
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/09_Catalogue.md
import { expect, test } from '../../src/fixtures/index.js'
import { CataloguePage } from '../../src/pages/catalogue/CataloguePage.js'

test('E2E-CAT-009 permissions: catalogue read-only, and full access', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cat009owner', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara CAT009' })
  const gid = garage.id ?? ''
  await owner.api.createSimplePart(gid, { sku: 'OIL-5W30', name: 'Engine oil 5W-30', salePrice: 120000 })

  const join = async (label: string, permission: string) => {
    const member = await freshOwner(`cat009${label}`)
    const role = await owner.api.createRole(`QA Catalogue ${label}`, [permission])
    const group = await owner.api.createStaffGroup(gid, `QA Catalogue ${label}`, role.id ?? '')
    const candidate = await owner.api.lookupStaffCandidate(gid, member.email)
    await owner.api.inviteStaff(gid, candidate.userId ?? '', [group.id ?? ''])
    const invitation = ((await member.api.listMyInvitations()).data ?? []).find((i) => i.id)
    await member.api.acceptInvitation(invitation?.id ?? '')
    return member
  }

  // Step 1: read-only: the lists load with prices, but no controls; no stock.
  const reader = await join('reader', 'PERMISSION_CATALOGUE_READ')
  await signIn(reader.session, garage.id)
  const catalogue = new CataloguePage(page)
  await catalogue.goto()
  await expect(catalogue.row('OIL-5W30')).toContainText('120,000')
  await expect(catalogue.newPartButton).toBeHidden()
  await expect(catalogue.row('OIL-5W30').getByRole('button')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Inventory' })).toBeHidden()

  // Step 3: add-and-edit: the controls are there and a part can be created.
  const editor = await join('editor', 'PERMISSION_CATALOGUE_WRITE')
  const editorPage = await page.context().newPage()
  await editorPage.addInitScript(
    ({ session, garageId }) => {
      localStorage.setItem('vietgara.language', 'en')
      localStorage.setItem('vietgara.accessToken', session.accessToken ?? '')
      localStorage.setItem('vietgara.refreshToken', session.refreshToken ?? '')
      localStorage.setItem('vietgara.user', JSON.stringify(session.user))
      localStorage.setItem('vietgara.garageId', garageId)
    },
    { session: editor.session, garageId: gid },
  )
  const editorCatalogue = new CataloguePage(editorPage)
  await editorCatalogue.goto()
  await expect(editorCatalogue.newPartButton.first()).toBeVisible()
  await editorCatalogue.createUnit('Piece', 'pc')
  await editorCatalogue.createPart({ sku: 'EDIT-1', name: 'Editor part', baseUnit: 'Piece (pc)' })
  await expect(editorCatalogue.row('EDIT-1')).toBeVisible()
})
