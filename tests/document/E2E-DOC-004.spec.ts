// E2E-DOC-004 · Print settings belong to the garage; changing them needs the permission
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/11_Documents.md
//
// The owner picks A5 for the quote and turns the copy mark on, in the
// garage settings; the choice is kept; a member who may read the garage but
// not write it sees the table locked. That a print then follows the choice is in
// the blackbox suite (it compares the PDFs).
import { expect, test } from '../../src/fixtures/index.js'
import { joinWith } from '../../src/fixtures/members.js'

test('E2E-DOC-004 print settings belong to the garage; changing them needs the permission', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('doc004')
  const gid = (await owner.api.createGarage({ name: 'QA Gara DOC004' })).id ?? ''
  await signIn(owner.session, gid)

  // Steps 1 and 2: A5 for the quote, copy mark on.
  await page.goto(`/garages/${gid}/settings`)
  const paper = page.getByLabel('Quote: Paper')
  await expect(paper).toHaveValue('PAPER_SIZE_A4')
  // Each choice is saved at once; wait for the save to land before the next one,
  // as the controls are locked while it runs.
  const saved = () => page.waitForResponse((r) => r.url().includes('/print-settings/') && r.request().method() === 'PUT' && r.ok())
  const firstSave = saved()
  await paper.selectOption('PAPER_SIZE_A5')
  await firstSave
  const copyMark = page.getByLabel('Quote: Copy mark on reprints')
  const secondSave = saved()
  await copyMark.click()
  await secondSave
  await expect(copyMark).toBeChecked()

  // Step 3: kept after a reload, and other documents are untouched.
  await page.reload()
  await expect(page.getByLabel('Quote: Paper')).toHaveValue('PAPER_SIZE_A5')
  await expect(page.getByLabel('Quote: Copy mark on reprints')).toBeChecked()
  await expect(page.getByLabel('Repair order: Paper')).toHaveValue('PAPER_SIZE_A4')
  await expect(page.getByLabel('Repair order: Copy mark on reprints')).not.toBeChecked()

  // Step 4: a member without garage.write sees the same choice, locked.
  const reader = await joinWith(owner, gid, await freshOwner('doc004reader'), 'Garage Reader', ['PERMISSION_GARAGE_READ'])
  await signIn(reader.session, gid)
  await page.goto(`/garages/${gid}/settings`)
  await expect(page.getByLabel('Quote: Paper')).toHaveValue('PAPER_SIZE_A5')
  await expect(page.getByLabel('Quote: Paper')).toBeDisabled()
  await expect(page.getByLabel('Quote: Copy mark on reprints')).toBeDisabled()
})
