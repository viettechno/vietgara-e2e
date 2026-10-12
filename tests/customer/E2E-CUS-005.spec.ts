// E2E-CUS-005 · Register a vehicle for a customer
// docs: vietgara-docs/docs/05-Testing/E2E_Scenarios/04_Customer_Vehicle_Partner.md
//
// Vehicles register from their owner's page (the /vehicles screen is a
// lookup), so the UI flow opens the customer detail and adds the vehicle
// there; the lookup screen then finds it by plate, make and model.
import { expect, test } from '../../src/fixtures/index.js'
import { CustomerDetailPage } from '../../src/pages/customers/CustomersPage.js'
import { VehiclesPage } from '../../src/pages/customers/VehiclesPage.js'

test('E2E-CUS-005 register a vehicle for a customer', async ({ page, signIn, freshOwner }) => {
  const owner = await freshOwner('cus005')
  const garage = await owner.api.createGarage({ name: 'QA Gara CUS005' })
  const customer = await owner.api.createCustomer(garage.id ?? '', { fullName: 'QA Customer Binh CUS005', phone: '0911000055' })
  await signIn(owner.session, garage.id)

  const detail = new CustomerDetailPage(page)
  await detail.goto(customer.id ?? '')
  await detail.registerVehicle({ plate: '51A-555.55', make: 'Kia', model: 'Morning', year: 2019, vin: 'KNABE511AKT000001', engine: 'G4LA0001' })
  await expect(detail.vehicleRow('51A-555.55')).toBeVisible()
  await expect(detail.vehicleRow('51A-555.55')).toContainText('Kia')

  const vehicles = new VehiclesPage(page)
  await vehicles.goto()
  for (const query of ['51A-555', 'Kia', 'Morning']) {
    await vehicles.search(query)
    await expect(vehicles.row('51A-555.55')).toBeVisible()
  }
})
