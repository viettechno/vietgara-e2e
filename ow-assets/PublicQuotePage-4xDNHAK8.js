import { At as e, Dt as t, Et as n, Ot as r, R as i, S as a } from './api-lC4u2sZi.js'
import { t as o } from './useMutation-YmV9sVwE.js'
import { t as s } from './Segmented-v9dewsey.js'
import { C as c, Ct as l, D as u, F as d, R as f, S as p, T as m, y as h, z as g } from './index-CbGLOUZk.js'
import { t as _ } from './api-T2kamPX_.js'
var v = e(r(), 1),
  y = t(),
  b = (e) => [`public-quotes`, e]
function x() {
  let { token: e = `` } = d(),
    t = n(),
    r = l({ queryKey: b(e), queryFn: () => _.get(e) }),
    [i, a] = (0, v.useState)(null),
    s = o({
      mutationFn: (t) =>
        _.decide(
          e,
          Object.entries(t).map(([e, t]) => ({ lineId: e, approved: t })),
        ),
      onSuccess: (n) => t.setQueryData(b(e), n),
    })
  return (0, y.jsxs)(`div`, {
    className: `flex min-h-dvh flex-col items-center bg-background px-4 pb-32 pt-8`,
    children: [
      (0, y.jsx)(m, { to: `#` }),
      (0, y.jsxs)(`main`, {
        className: `mt-6 w-full max-w-xl`,
        children: [
          (0, y.jsx)(p, { isLoading: r.isLoading, error: r.error, onRetry: () => void r.refetch(), skeleton: `detail` }),
          r.data &&
            (0, y.jsx)(S, {
              quote: r.data.quote,
              approvals: i,
              onStartDeciding: () => a(Object.fromEntries((r.data.quote.lines ?? []).map((e) => [e.id ?? ``, !0]))),
              onToggle: (e, t) => a((n) => ({ ...n, [e]: t })),
              onSubmit: () => i && s.mutate(i),
              isSubmitting: s.isPending,
              error: s.error,
            }),
        ],
      }),
    ],
  })
}
function S({ quote: e, approvals: t, onStartDeciding: n, onToggle: r, onSubmit: o, isSubmitting: l, error: d }) {
  let { t: p } = a(),
    m = e.status !== `QUOTE_STATUS_SENT`
  return (0, y.jsxs)(y.Fragment, {
    children: [
      (0, y.jsx)(`h1`, { className: `text-title`, children: p(`quotes.publicTitle`, { number: e.number }) }),
      (0, y.jsxs)(`p`, {
        className: `mt-1 flex flex-wrap items-center gap-2 text-body-lg text-muted-foreground`,
        children: [e.garageName, (0, y.jsx)(g, { children: e.vehicleLicensePlate ?? `` })],
      }),
      (0, y.jsxs)(`ul`, {
        className: `mt-6 divide-y divide-border rounded-lg border border-border bg-surface`,
        children: [
          e.lines?.map((e) =>
            (0, y.jsxs)(
              `li`,
              {
                className: `flex flex-wrap items-start justify-between gap-3 p-4`,
                children: [
                  (0, y.jsxs)(`div`, {
                    className: `min-w-0 flex-1 basis-48`,
                    children: [
                      (0, y.jsx)(`p`, { className: `text-body-lg font-medium`, children: e.description }),
                      (0, y.jsxs)(`p`, {
                        className: `num mt-0.5 text-body text-muted-foreground`,
                        children: [e.quantity, ` × `, (0, y.jsx)(f, { text: h(e.unitPrice) })],
                      }),
                    ],
                  }),
                  m || !t
                    ? (0, y.jsx)(`span`, { className: `text-body-lg`, children: (0, y.jsx)(f, { text: h(e.lineTotal) }) })
                    : (0, y.jsx)(s, {
                        label: e.description ?? ``,
                        value: t[e.id ?? ``] === !1 ? `reject` : `approve`,
                        onValueChange: (t) => r(e.id ?? ``, t === `approve`),
                        options: [
                          { value: `approve`, label: p(`quotes.approve`) },
                          { value: `reject`, label: p(`quotes.reject`) },
                        ],
                      }),
                ],
              },
              e.id,
            ),
          ),
          (0, y.jsxs)(`li`, {
            className: `flex items-center justify-between bg-surface-sunken p-4`,
            children: [
              (0, y.jsx)(`span`, { className: `text-body-lg font-medium`, children: p(`quotes.total`) }),
              (0, y.jsx)(`span`, { className: `text-heading`, children: (0, y.jsx)(f, { text: h(e.totalAmount) }) }),
            ],
          }),
        ],
      }),
      e.notes && (0, y.jsx)(`p`, { className: `mt-4 text-body text-muted-foreground`, children: e.notes }),
      d != null && (0, y.jsx)(c, { className: `mt-4`, tone: `error`, title: u(p, d) }),
      m &&
        (0, y.jsx)(c, {
          className: `mt-4`,
          tone: e.status === `QUOTE_STATUS_APPROVED` ? `success` : `warning`,
          title: p(e.status === `QUOTE_STATUS_APPROVED` ? `quotes.publicApproved` : `quotes.publicRejected`),
        }),
      !m &&
        (0, y.jsx)(`div`, {
          className: `fixed inset-x-0 bottom-0 border-t border-border bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]`,
          children: (0, y.jsx)(`div`, {
            className: `mx-auto max-w-xl`,
            children: t
              ? (0, y.jsx)(i, {
                  variant: `primary`,
                  size: `lg`,
                  className: `w-full`,
                  loading: l,
                  onClick: o,
                  children: p(l ? `common.saving` : `quotes.publicSubmitDecision`),
                })
              : (0, y.jsx)(i, { variant: `primary`, size: `lg`, className: `w-full`, onClick: n, children: p(`quotes.publicDecideStart`) }),
          }),
        }),
    ],
  })
}
export { x as PublicQuotePage }
