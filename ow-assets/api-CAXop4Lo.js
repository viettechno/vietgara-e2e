import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
import { t as r } from './pagination-CRXyaCrX.js'
function i(e, t) {
  return `${n(e)}/repair-orders${t ? `/${encodeURIComponent(t)}` : ``}`
}
var a = 100,
  o = {
    list: async (n, o) => r(await t.get(`${i(n)}${e({ pageSize: a, ...o })}`)),
    get: (e, n) => t.get(i(e, n)),
    create: (e, n) => t.post(i(e), n),
    updateLine: (e, n, r, a) => t.patch(`${i(e, n)}/lines/${encodeURIComponent(r)}`, a),
    close: (e, n) => t.post(`${i(e, n)}/closing`),
  }
function s(e) {
  return [`garages`, e, `repair-orders`]
}
export { s as n, o as t }
