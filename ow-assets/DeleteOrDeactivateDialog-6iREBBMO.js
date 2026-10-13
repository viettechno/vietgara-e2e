import { At as e, Dt as t, Ot as n, R as r, S as i } from './api-lC4u2sZi.js'
import { n as a, t as o } from './Modal-BAMT8Cnj.js'
import { Ct as s, D as c, I as l } from './index-CbGLOUZk.js'
var u = e(n(), 1),
  d = t()
function f({ subject: e, detail: t, previewKey: n, preview: f, remove: p, onClose: m, onDone: h }) {
  let { t: g } = i(),
    [_, v] = (0, u.useState)(``),
    [y, b] = (0, u.useState)(!1),
    x = s({ queryKey: [`lifecycle-preview`, ...n], queryFn: f, gcTime: 0, staleTime: 0, retry: !1 }),
    S = x.data === `deactivated`,
    C = x.data ? g(S ? `lifecycle.willDeactivate` : `lifecycle.willDelete`, { subject: e }) : g(`common.loading`)
  return (0, d.jsx)(o, {
    title: g(S ? `lifecycle.deactivateTitle` : `lifecycle.deleteTitle`, { subject: e }),
    description: x.error ? void 0 : [C, t].filter(Boolean).join(` `),
    error: _ || (x.error ? c(g, x.error) : ``),
    onClose: m,
    children: (0, d.jsxs)(a, {
      children: [
        (0, d.jsx)(r, { variant: `outline`, onClick: m, disabled: y, children: g(`common.cancel`) }),
        (0, d.jsx)(r, {
          variant: `destructive`,
          onClick: async () => {
            ;(b(!0), v(``))
            try {
              let t = await p()
              ;(l.success(g(t === `deactivated` ? `lifecycle.deactivated` : `lifecycle.deleted`, { subject: e })), h?.(t), m())
            } catch (e) {
              ;(v(c(g, e)), b(!1))
            }
          },
          loading: y,
          disabled: !x.data,
          children: g(S ? `lifecycle.deactivate` : `common.delete`),
        }),
      ],
    }),
  })
}
export { f as t }
