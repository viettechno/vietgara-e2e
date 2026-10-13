import { g as e, i as t, n, t as r } from './api-lC4u2sZi.js'
import { m as i } from './index-CbGLOUZk.js'
import { t as a } from './pagination-CRXyaCrX.js'
function o(e, t) {
  return `${i(e)}/quotes${t ? `/${encodeURIComponent(t)}` : ``}`
}
var s = {
  list: async (e, r) => a(await n.get(`${o(e)}${t({ ...r, pageSize: 20 })}`)),
  get: (e, t) => n.get(o(e, t)),
  create: (e, t) => n.post(o(e), t),
  update: (e, t, r) => n.patch(o(e, t), r),
  remove: (e, t) => n.delete(o(e, t)),
  send: (e, t) => n.post(`${o(e, t)}/sending`),
  recordDecision: (e, t, r) => n.post(`${o(e, t)}/decision`, { decisions: r }),
  convert: (e, t) => n.post(`${o(e, t)}/conversion`),
}
function c(e) {
  return [`garages`, e, `quotes`]
}
async function l(t, n, i = ``, a) {
  let o = await fetch(`${e}/v1/public/quotes/${encodeURIComponent(n)}${i}`, {
      method: t,
      headers: { 'Content-Type': `application/json`, 'Accept-Language': document.documentElement.lang || `vi` },
      body: a === void 0 ? void 0 : JSON.stringify(a),
    }),
    s = await o.text(),
    c = s ? JSON.parse(s) : void 0
  if (!o.ok) throw new r(o.status, c)
  return c
}
function u(e) {
  return `quote` in e ? e : { quote: e }
}
var d = { get: async (e) => u(await l(`GET`, e)), decide: async (e, t) => u(await l(`POST`, e, `/decision`, { decisions: t })) }
export { s as n, c as r, d as t }
