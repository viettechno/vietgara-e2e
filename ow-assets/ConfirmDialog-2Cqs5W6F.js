import { At as e, Dt as t, Ot as n, R as r, S as i } from './api-lC4u2sZi.js'
import { n as a, t as o } from './Modal-BAMT8Cnj.js'
import { D as s } from './index-CbGLOUZk.js'
var c = e(n(), 1),
  l = t()
function u({ title: e, description: t, confirmLabel: n, danger: u, onClose: d, onConfirm: f, onDone: p }) {
  let { t: m } = i(),
    [h, g] = (0, c.useState)(``),
    [_, v] = (0, c.useState)(!1)
  return (0, l.jsx)(o, {
    title: e,
    description: t,
    error: h,
    onClose: d,
    children: (0, l.jsxs)(a, {
      children: [
        (0, l.jsx)(r, { variant: `outline`, onClick: d, disabled: _, children: m(`common.cancel`) }),
        (0, l.jsx)(r, {
          variant: u ? `destructive` : `primary`,
          onClick: async () => {
            ;(v(!0), g(``))
            try {
              ;(await f(), p?.(), d())
            } catch (e) {
              ;(g(s(m, e)), v(!1))
            }
          },
          loading: _,
          children: n,
        }),
      ],
    }),
  })
}
export { u as t }
