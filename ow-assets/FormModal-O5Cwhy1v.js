import { At as e, Dt as t, Ot as n, R as r, S as i } from './api-lC4u2sZi.js'
import { t as a } from './Choice-C8tAQzDN.js'
import { n as o, t as s } from './Modal-BAMT8Cnj.js'
import { D as c, J as l, K as u, O as d, U as f, W as p } from './index-CbGLOUZk.js'
var m = e(n(), 1),
  h = t()
function g({ title: e, description: t, fields: n, values: a = {}, submitLabel: l, onClose: u, onSave: f }) {
  let { t: p } = i(),
    [g, v] = (0, m.useState)(null),
    [y, b] = (0, m.useState)(!1)
  return (0, h.jsx)(s, {
    title: e,
    description: t,
    error: g ? c(p, g) : ``,
    onClose: u,
    children: (0, h.jsxs)(`form`, {
      onSubmit: async (e) => {
        e.preventDefault()
        let t = new FormData(e.currentTarget)
        ;(b(!0), v(null))
        try {
          await f(t)
        } catch (e) {
          ;(v(e), b(!1))
        }
      },
      className: `flex flex-col gap-4`,
      children: [
        n.map((e, t) => (0, h.jsx)(_, { field: e, value: a[e.name], autoFocus: t === 0, issue: d(g, e.name) }, e.name)),
        (0, h.jsxs)(o, {
          children: [
            (0, h.jsx)(r, { variant: `outline`, onClick: u, children: p(`common.cancel`) }),
            (0, h.jsx)(r, { type: `submit`, variant: `primary`, loading: y, children: y ? p(`common.saving`) : l }),
          ],
        }),
      ],
    }),
  })
}
function _({ field: e, value: t, autoFocus: n, issue: r }) {
  if (e.type === `checkbox`) return (0, h.jsx)(a, { name: e.name, defaultChecked: !!t, label: e.label })
  let i = {
    name: e.name,
    required: e.required && !e.disabled,
    disabled: e.disabled,
    autoFocus: n && !e.disabled,
    defaultValue: t == null || typeof t == `boolean` ? `` : String(t),
  }
  return (0, h.jsx)(l, {
    label: e.label,
    hint: e.hint,
    error: r,
    required: e.required,
    children:
      e.type === `select`
        ? (0, h.jsx)(p, { ...i, children: e.options?.map((e) => (0, h.jsx)(`option`, { value: e.value, children: e.label }, e.value)) })
        : e.type === `textarea`
          ? (0, h.jsx)(u, { ...i, placeholder: e.placeholder, maxLength: e.maxLength, rows: 3 })
          : (0, h.jsx)(f, {
              ...i,
              type: e.type ?? `text`,
              placeholder: e.placeholder,
              maxLength: e.maxLength,
              min: e.min,
              max: e.max,
              step: e.step,
            }),
  })
}
export { g as t }
