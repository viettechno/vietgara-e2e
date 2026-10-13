import { At as e, Dt as t, M as n, N as r, Ot as i, R as a, S as o } from './api-lC4u2sZi.js'
import { t as s } from './StatusBadge-DknRod1K.js'
import { t as c } from './plus-CTDUdFcD.js'
import { a as l, i as u, n as d, o as f, r as p, s as m } from './Table-dqUq80Ez.js'
import { A as h, R as g, S as _, W as v, _ as y, f as b, y as x, z as S } from './index-CbGLOUZk.js'
import { t as C } from './PageHeader-HSPIRw-a.js'
import { t as w } from './EmptyState-B6htI9zs.js'
import { n as T, t as E } from './usePagedQuery-l3G6ju52.js'
import { n as D, r as O } from './api-T2kamPX_.js'
import { n as k, t as A } from './status-CqSMkbrS.js'
var j = e(i(), 1),
  M = t(),
  N = [``, `QUOTE_STATUS_DRAFT`, `QUOTE_STATUS_SENT`, `QUOTE_STATUS_APPROVED`, `QUOTE_STATUS_REJECTED`, `QUOTE_STATUS_CONVERTED`]
function P() {
  let { t: e } = o(),
    { activeGarage: t, can: i } = b(),
    P = t?.id ?? ``,
    F = i(`PERMISSION_QUOTE_WRITE`),
    [I, L] = (0, j.useState)(``),
    R = E([...O(P), { status: I }], (e) => D.list(P, { status: I || void 0, page: e }), !!P)
  if (!P) return (0, M.jsx)(w, { message: e(`common.selectGarageFirst`) })
  let z =
    F &&
    (0, M.jsx)(a, {
      asChild: !0,
      variant: `primary`,
      children: (0, M.jsxs)(h, { to: `/quotes/new`, children: [(0, M.jsx)(c, { 'aria-hidden': !0 }), ` `, e(`quotes.new`)] }),
    })
  return (0, M.jsxs)(n, {
    children: [
      (0, M.jsx)(C, {
        title: e(`quotes.title`),
        description: e(`quotes.description`),
        action: R.data?.items.length === 0 && !I ? void 0 : z,
      }),
      (0, M.jsx)(v, {
        wrapperClassName: `sm:w-56`,
        value: I,
        onChange: (e) => L(e.target.value),
        'aria-label': e(`common.status`),
        children: N.map((t) =>
          (0, M.jsx)(`option`, { value: t, children: t ? e(A(t)) : `${e(`common.status`)}: ${e(`common.all`)}` }, t || `all`),
        ),
      }),
      (0, M.jsx)(_, { isLoading: R.isLoading, error: R.error, onRetry: () => void R.refetch() }),
      R.data &&
        R.data.items.length === 0 &&
        (0, M.jsx)(r, {
          children: I
            ? (0, M.jsx)(w, {
                kind: `search`,
                title: e(`ui.noResults`),
                message: e(`quotes.empty`),
                action: (0, M.jsx)(a, { variant: `outline`, onClick: () => L(``), children: e(`ui.clearFilters`) }),
                compact: !0,
              })
            : (0, M.jsx)(w, { message: e(`quotes.empty`), action: z }),
        }),
      R.data &&
        R.data.items.length > 0 &&
        (0, M.jsxs)(r, {
          children: [
            (0, M.jsxs)(d, {
              caption: e(`quotes.title`),
              children: [
                (0, M.jsx)(l, {
                  children: (0, M.jsxs)(`tr`, {
                    children: [
                      (0, M.jsx)(f, { children: e(`quotes.number`) }),
                      (0, M.jsx)(f, { children: e(`quotes.customerVehicle`) }),
                      (0, M.jsx)(f, { children: e(`common.status`) }),
                      (0, M.jsx)(f, { numeric: !0, children: e(`quotes.total`) }),
                      (0, M.jsx)(f, { children: e(`common.createdAt`) }),
                    ],
                  }),
                }),
                (0, M.jsx)(p, {
                  children: R.data.items.map((t) =>
                    (0, M.jsxs)(
                      m,
                      {
                        children: [
                          (0, M.jsx)(u, {
                            primary: !0,
                            label: e(`quotes.number`),
                            children: (0, M.jsx)(h, {
                              to: `/quotes/${t.id}`,
                              className: `num whitespace-nowrap hover:text-primary-subtle-foreground hover:underline`,
                              children: t.number,
                            }),
                          }),
                          (0, M.jsx)(u, {
                            label: e(`quotes.customerVehicle`),
                            className: `py-2`,
                            children: (0, M.jsxs)(`span`, {
                              className: `flex flex-col items-start gap-1 max-md:items-end`,
                              children: [
                                (0, M.jsx)(`span`, { children: t.customerName }),
                                (0, M.jsx)(S, { children: t.vehicleLicensePlate ?? `` }),
                              ],
                            }),
                          }),
                          (0, M.jsx)(u, {
                            label: e(`common.status`),
                            children: (0, M.jsx)(s, { tone: k(t.status), label: e(A(t.status)) }),
                          }),
                          (0, M.jsx)(u, { numeric: !0, label: e(`quotes.total`), children: (0, M.jsx)(g, { text: x(t.totalAmount) }) }),
                          (0, M.jsx)(u, { label: e(`common.createdAt`), className: `num text-muted-foreground`, children: y(t.createdAt) }),
                        ],
                      },
                      t.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, M.jsx)(T, { page: R.page, pageSize: R.data.pageSize, total: R.data.total, onPageChange: R.setPage }),
          ],
        }),
    ],
  })
}
export { P as QuotesPage }
