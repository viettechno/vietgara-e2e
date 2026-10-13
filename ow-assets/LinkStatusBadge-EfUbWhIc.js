import { Dt as e, S as t, i as n, n as r } from './api-lC4u2sZi.js'
import { t as i } from './StatusBadge-DknRod1K.js'
import { m as a } from './index-CbGLOUZk.js'
import { n as o, t as s } from './form-Bpp5E52a.js'
import { t as c } from './lifecycle-CokP48op.js'
import { t as l } from './pagination-CRXyaCrX.js'
import { t as u } from './FormModal-O5Cwhy1v.js'
function d(e, t) {
  return `${a(e)}/customers${t ? `/${encodeURIComponent(t)}` : ``}`
}
var f = {
    list: async (e, t) => l(await r.get(`${d(e)}${n({ ...t, pageSize: 20 })}`)),
    get: (e, t) => r.get(d(e, t)),
    create: (e, t) => r.post(d(e), t),
    update: (e, t, n) => r.patch(d(e, t), n),
    lifecycle: (e, t) => c(d(e, t)),
  },
  p = {
    request: (e, t) => r.post(`${d(e, t)}/user-links`),
    confirm: (e, t, n) => r.post(`${d(e, t)}/user-links/current:confirm`, { otp: n }),
    unlink: (e, t) => r.delete(`${d(e, t)}/user-links/current`),
  }
function m(e) {
  return [`garages`, e, `customers`]
}
var h = e()
function g({ customer: e, initialName: n, onClose: r, onSave: i }) {
  let { t: a } = t()
  return (0, h.jsx)(u, {
    title: a(e ? `customers.editTitle` : `customers.createTitle`),
    fields: [
      { name: `fullName`, label: a(`customers.fullName`), required: !0, maxLength: 255 },
      { name: `phone`, label: a(`common.phone`), type: `tel`, maxLength: 20 },
      { name: `email`, label: a(`common.email`), type: `email`, maxLength: 255 },
      { name: `address`, label: a(`common.address`), type: `textarea`, maxLength: 500 },
      { name: `personalDataConsent`, label: a(`customers.consent`), type: `checkbox` },
    ],
    values: e ?? (n ? { fullName: n } : void 0),
    submitLabel: a(e ? `common.save` : `common.create`),
    onClose: r,
    onSave: (e) =>
      i({
        fullName: o(e, `fullName`),
        phone: o(e, `phone`),
        email: o(e, `email`),
        address: o(e, `address`),
        personalDataConsent: s(e, `personalDataConsent`),
      }),
  })
}
function _(e) {
  switch (e) {
    case `CUSTOMER_USER_LINK_STATUS_REQUESTED`:
      return { key: `customers.link.status.requested`, tone: `pending` }
    case `CUSTOMER_USER_LINK_STATUS_LINKED`:
      return { key: `customers.link.status.linked`, tone: `active` }
    case `CUSTOMER_USER_LINK_STATUS_DECLINED`:
      return { key: `customers.link.status.declined`, tone: `danger` }
    case `CUSTOMER_USER_LINK_STATUS_UNLINKED`:
      return { key: `customers.link.status.unlinked`, tone: `neutral` }
    default:
      return null
  }
}
function v(e) {
  return !!e.email && e.linkStatus !== `CUSTOMER_USER_LINK_STATUS_LINKED` && e.linkStatus !== `CUSTOMER_USER_LINK_STATUS_REQUESTED`
}
function y({ status: e }) {
  let { t: n } = t(),
    r = _(e)
  return r ? (0, h.jsx)(i, { tone: r.tone, label: n(r.key) }) : null
}
export { f as a, p as i, v as n, m as o, g as r, y as t }
