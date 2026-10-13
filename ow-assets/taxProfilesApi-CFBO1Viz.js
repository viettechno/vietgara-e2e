import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
import { t as r } from './lifecycle-CokP48op.js'
function i(e, t, r) {
  let i = `${n(e)}/customers/${encodeURIComponent(t)}/tax-profiles`
  return r ? `${i}/${encodeURIComponent(r)}` : i
}
var a = {
  list: async (n, r, a = !1) => (await t.get(`${i(n, r)}${e({ includeInactive: a || void 0 })}`)).data ?? [],
  create: (e, n, r) => t.post(i(e, n), r),
  update: (e, n, r, a) => t.patch(i(e, n, r), a),
  lifecycle: (e, t, n) => r(i(e, t, n)),
}
function o(e, t) {
  return [`garages`, e, `customers`, t, `tax-profiles`]
}
function s(e) {
  if (!e) return [`legalName`, `taxId`, `address`]
  let t = []
  return (e.legalName || t.push(`legalName`), e.taxId || t.push(`taxId`), e.address || t.push(`address`), t)
}
export { a as n, o as r, s as t }
