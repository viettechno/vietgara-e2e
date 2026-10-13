import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
import { t as r } from './pagination-CRXyaCrX.js'
function i(e, t) {
  return `${n(e)}/inventory-items${t ? `/${encodeURIComponent(t)}` : ``}`
}
var a = {
  list: async (n, a) => r(await t.get(`${i(n)}${e({ pageSize: 20, ...a })}`)),
  get: (e, n) => t.get(i(e, n)),
  create: (e, n) => t.post(i(e), n),
  update: (e, n, r) => t.patch(i(e, n), r),
  remove: (e, n) => t.delete(i(e, n)),
  receiveStock: (e, r, i) => t.post(`${n(e)}/stock-receipts`, { itemId: r, ...i }),
  listTransactions: async (i, a) => r(await t.get(`${n(i)}/reports/stock-movements${e({ pageSize: 20, ...a })}`)),
}
function o(e) {
  return [`garages`, e, `items`]
}
function s(e) {
  return [`garages`, e, `stock-movements`]
}
export { o as n, s as r, a as t }
