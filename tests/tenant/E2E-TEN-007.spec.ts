// E2E-TEN-007 · Invite an existing user by e-mail and accept from the e-mail link
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/02_Garage_Staff.md
//
// The inviter drives the real Staff UI; the invitee (a second actor) follows
// the real invitation e-mail link and accepts in the UI. Leaves no member
// behind: the invitation is for a scenario-owned garage, and the invitee
// joins only that garage.
import { expect, test } from '../../src/fixtures/index.js'
import { CustomersPage } from '../../src/pages/customers/CustomersPage.js'
import { GarageSwitcher } from '../../src/pages/garages/GarageSwitcher.js'
import { MyInvitationsPage, StaffPage } from '../../src/pages/staff/StaffPage.js'

test('E2E-TEN-007 invite an existing user by e-mail and accept from the e-mail link', async ({ page, signIn, freshOwner, mailpit }) => {
  // English-locale owner: default group names snapshot the owner's
  // locale at verification, and the invite flow ticks groups by name.
  const owner = await freshOwner('ten007owner', { locale: 'LOCALE_EN' })
  const garage = await owner.api.createGarage({ name: 'QA Gara TEN007' })
  const freelancer = await freshOwner('ten007guest')
  await signIn(owner.session, garage.id)

  const staff = new StaffPage(page)
  await staff.goto()
  await staff.inviteByLookup(freelancer.email, ['Service Advisor'])
  await expect(page.getByText('Invitation sent.')).toBeVisible()
  await expect(staff.invitationRow(freelancer.email)).toBeVisible()

  const invitationMail = await mailpit.waitForMessage(freelancer.email)
  const invitationLink = mailpit.extractLink(invitationMail)

  await signIn(freelancer.session)
  await page.goto(invitationLink)
  await expect(page.getByText(/invited you to join/)).toBeVisible()
  const invitations = new MyInvitationsPage(page)
  await invitations.acceptButton.click()
  await expect(page.getByText(/You joined/)).toBeVisible()

  // The invitee now works in the garage: it is selectable and its data opens.
  await new GarageSwitcher(page).switchTo('QA Gara TEN007')
  await new CustomersPage(page).goto()
  await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible()
})
