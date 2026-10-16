// API-only setup for the Catalogue specs (E2E-CAT-*): the documented
// BEER-330 (00_Test_Data.md §3.4) in a fresh garage, so each scenario starts
// from the same part without repeating the setup.
import type { ApiClient } from '../api/client.js'
import type { Part, Unit } from '../api/types.js'

export type BeerFixture = { part: Part; can: Unit; caseUnit: Unit }

/** BEER-330: base unit can, selling price 9,000, a case of 24 priced 200,000. */
export async function beer330(api: ApiClient, garageId: string): Promise<BeerFixture> {
  const can = await api.createUnit(garageId, 'Can', 'can')
  const caseUnit = await api.createUnit(garageId, 'Case', 'case')
  const created = await api.createPart(garageId, {
    sku: 'BEER-330',
    name: 'Beer 330ml',
    baseUnitId: can.id ?? '',
    salePrice: 9000,
    brand: 'Sabeco',
    reorderThreshold: '100',
  })
  const part = await api.setPartUnits(garageId, created.id ?? '', [{ unitId: caseUnit.id ?? '', factor: '24', salePrice: 200000 }])
  return { part, can, caseUnit }
}

/** A valid 1x1 PNG, the smallest part image the file store accepts. */
export const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)
