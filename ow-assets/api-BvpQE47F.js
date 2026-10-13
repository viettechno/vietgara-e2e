import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
import { t as r } from './pagination-CRXyaCrX.js'
function i(e, t) {
  return `${n(e)}/settlements${t ? `/${encodeURIComponent(t)}` : ``}`
}
var a = {
  list: async (n, a) =>
    r(
      await t.get(
        `${i(n)}${e({ status: a.status, outstandingOnly: a.outstandingOnly ? `true` : void 0, page: a.page, pageSize: a.pageSize })}`,
      ),
    ),
  get: (e, n) => t.get(i(e, n)),
  create: (e, n, r) => t.postIdempotent(i(e), { repairOrderId: n }, r),
  recordPayment: (e, n, r, a) => t.postIdempotent(`${i(e, n)}/payments`, r, a),
  updateBilling: (e, n, r) => t.patch(i(e, n), r),
  voidPayment: (e, n, r, a) => t.post(`${i(e, n)}/payments/${encodeURIComponent(r)}:void`, { reason: a }),
}
function o(e) {
  return [`garages`, e, `settlements`]
}
export { o as n, a as t }
