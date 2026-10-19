// Builds the .xlsx files the import specs upload (E2E-INV-033).
import ExcelJS from 'exceljs'

export type WorkbookRow = Record<string, string>

/** A workbook with `headers` in row 1 and one row per entry, every cell as text. */
export async function workbook(headers: string[], rows: WorkbookRow[]): Promise<Buffer> {
  const book = new ExcelJS.Workbook()
  const sheet = book.addWorksheet('Data')
  sheet.addRow(headers)
  for (const row of rows) sheet.addRow(headers.map((header) => row[header] ?? ''))
  return Buffer.from(await book.xlsx.writeBuffer())
}

export const PARTS_COLUMNS = [
  'SKU',
  'Name',
  'Base unit',
  'Base unit abbreviation',
  'Category',
  'Brand',
  'Barcodes',
  'Packaging units',
  'Opening quantity',
  'Unit cost',
  'Supplier',
]

/**
 * A parts file of `n` parts: a barcode on each, every tenth with a Case of 12 and its own
 * barcode, every one but each seventh with opening stock from `supplier`.
 */
export function partsRows(n: number, supplier: string): WorkbookRow[] {
  const rows: WorkbookRow[] = []
  for (let i = 0; i < n; i++) {
    const row: WorkbookRow = {
      SKU: `P-${String(i).padStart(4, '0')}`,
      Name: `Part ${i}`,
      'Base unit': 'Piece',
      'Base unit abbreviation': 'pc',
      Category: 'Filters',
      Brand: 'Bosch',
      Barcodes: `89${String(i).padStart(6, '0')}`,
    }
    if (i % 10 === 0) {
      row['Packaging units'] = 'Case=12'
      row.Barcodes += `;79${String(i).padStart(6, '0')}@Case`
    }
    if (i % 7 !== 0) {
      row['Opening quantity'] = String((i % 5) + 1)
      row['Unit cost'] = String(1000 + i)
      row.Supplier = supplier
    }
    rows.push(row)
  }
  return rows
}
