import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
import { t as r } from './lifecycle-CokP48op.js'
import { t as i } from './pagination-CRXyaCrX.js'
function a(e, t) {
  return `${n(e)}/vehicles${t ? `/${encodeURIComponent(t)}` : ``}`
}
var o = {
  list: async (n, r) => i(await t.get(`${a(n)}${e({ pageSize: 20, ...r })}`)),
  get: (e, n) => t.get(a(e, n)),
  create: (e, n) => t.post(a(e), n),
  update: (e, n, r) => t.patch(a(e, n), r),
  lifecycle: (e, t) => r(a(e, t)),
  correct: (e, n, r) => t.post(`${a(e, n)}:correct`, r),
  changeOwner: (e, n, r) => t.post(`${a(e, n)}:change-owner`, r),
  history: async (e, n) => (await t.get(`${a(e, n)}/history`)).data ?? [],
}
function s(e) {
  return [`garages`, e, `vehicles`]
}
function c(e) {
  return [e.make, e.model, e.year || ``].filter(Boolean).join(` `)
}
export { o as n, s as r, c as t }
