import { At as e, Dt as t, Ot as n, R as r, S as i, q as a, t as o } from './api-lC4u2sZi.js'
import { t as s } from './useMutation-YmV9sVwE.js'
import { n as c, t as l } from './Modal-BAMT8Cnj.js'
import { C as u, D as d, k as f } from './index-CbGLOUZk.js'
import { i as p } from './LinkStatusBadge-EfUbWhIc.js'
var m = a(`key-round`, [
    [
      `path`,
      {
        d: `M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,
        key: `1s6t7t`,
      },
    ],
    [`circle`, { cx: `16.5`, cy: `7.5`, r: `.5`, fill: `currentColor`, key: `w0ekpg` }],
  ]),
  h = a(`link-2`, [
    [`path`, { d: `M9 17H7A5 5 0 0 1 7 7h2`, key: `8i5ue5` }],
    [`path`, { d: `M15 7h2a5 5 0 1 1 0 10h-2`, key: `1b9ql8` }],
    [`line`, { x1: `8`, x2: `16`, y1: `12`, y2: `12`, key: `1jonct` }],
  ]),
  g = e(n(), 1),
  _ = t()
function v({ garageId: e, customerId: t, customerName: n, waiting: a, onClose: m, onLinked: h, onChanged: v }) {
  let { t: y } = i(),
    [b, x] = (0, g.useState)(!!a),
    [S, C] = (0, g.useState)(``),
    w = s({
      mutationFn: () => p.request(e, t),
      onSuccess: () => {
        ;(x(!0), v())
      },
    }),
    T = s({
      mutationFn: () => p.confirm(e, t, S),
      onSuccess: (e) => {
        ;(v(), h(e), m())
      },
    }),
    E = s({
      mutationFn: () => p.unlink(e, t),
      onSuccess: () => {
        ;(v(), m())
      },
    }),
    D = [w.error, T.error, E.error].find(Boolean),
    O = w.error instanceof o && w.error.code === `FAILED_PRECONDITION`
  return (0, _.jsxs)(l, {
    title: y(`customers.link.title`, { name: n }),
    description: y(b ? `customers.link.codeDescription` : `customers.link.description`),
    onClose: m,
    children: [
      D !== void 0 && (0, _.jsx)(u, { tone: O ? `warning` : `error`, title: O ? y(`customers.link.noUser`) : d(y, D) }),
      b
        ? (0, _.jsxs)(`form`, {
            onSubmit: (e) => {
              ;(e.preventDefault(), S.length === 6 && T.mutate())
            },
            children: [
              (0, _.jsx)(f, { label: y(`customers.link.code`), value: S, onChange: C, disabled: T.isPending }),
              (0, _.jsxs)(c, {
                children: [
                  (0, _.jsx)(r, {
                    variant: `ghost`,
                    loading: E.isPending,
                    onClick: () => E.mutate(),
                    children: y(`customers.link.cancelRequest`),
                  }),
                  (0, _.jsx)(r, {
                    variant: `outline`,
                    loading: w.isPending,
                    onClick: () => w.mutate(),
                    children: y(`customers.link.resend`),
                  }),
                  (0, _.jsx)(r, {
                    type: `submit`,
                    variant: `primary`,
                    disabled: S.length !== 6,
                    loading: T.isPending,
                    children: y(`customers.link.confirm`),
                  }),
                ],
              }),
            ],
          })
        : (0, _.jsxs)(_.Fragment, {
            children: [
              (0, _.jsx)(`p`, { className: `text-body text-muted-foreground`, children: y(`customers.link.consentNote`) }),
              (0, _.jsxs)(c, {
                children: [
                  (0, _.jsx)(r, { variant: `outline`, onClick: m, children: y(`common.cancel`) }),
                  (0, _.jsx)(r, {
                    variant: `primary`,
                    loading: w.isPending,
                    onClick: () => w.mutate(),
                    children: y(`customers.link.send`),
                  }),
                ],
              }),
            ],
          }),
    ],
  })
}
export { h as n, m as r, v as t }
