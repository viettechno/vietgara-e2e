import { n as e, q as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
var r = t(`download`, [
    [`path`, { d: `M12 15V3`, key: `m9g1x1` }],
    [`path`, { d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`, key: `ih7n3h` }],
    [`path`, { d: `m7 10 5 5 5-5`, key: `brsn70` }],
  ]),
  i = {
    exportQuotePdf: (t, r, i) => e.download(`${n(t)}/quotes/${encodeURIComponent(r)}/pdf`, i),
    exportRepairOrderPdf: (t, r, i) => e.download(`${n(t)}/repair-orders/${encodeURIComponent(r)}/pdf`, i),
    exportSettlementReceiptPdf: (t, r, i) => e.download(`${n(t)}/settlements/${encodeURIComponent(r)}/receipt-pdf`, i),
    exportPaymentVoucherPdf: (t, r, i, a) =>
      e.download(`${n(t)}/settlements/${encodeURIComponent(r)}/payments/${encodeURIComponent(i)}/voucher-pdf`, a),
    exportStockMovementsExcel: (t, r, i) =>
      e.download(`${n(t)}/reports/stock-movements/excel${r ? `?itemId=${encodeURIComponent(r)}` : ``}`, i),
  }
export { r as n, i as t }
