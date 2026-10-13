import { At as e, Dt as t, M as n, N as r, Ot as i, R as a, S as o } from './api-lC4u2sZi.js'
import { t as s } from './StatusBadge-DknRod1K.js'
import { t as c } from './Choice-C8tAQzDN.js'
import { a as l, i as u, n as d, o as f, r as p, s as m } from './Table-dqUq80Ez.js'
import { A as h, R as g, S as _, W as v, _ as y, f as b, y as x, z as S } from './index-CbGLOUZk.js'
import { t as C } from './PageHeader-HSPIRw-a.js'
import { t as w } from './EmptyState-B6htI9zs.js'
import { n as T, t as E } from './usePagedQuery-l3G6ju52.js'
import { n as D, t as O } from './api-BvpQE47F.js'
import { n as k, t as A } from './status-B1g7KuSk.js'
var j = e(i(), 1),
  M = t(),
  N = [``, `SETTLEMENT_STATUS_PENDING`, `SETTLEMENT_STATUS_PARTIALLY_PAID`, `SETTLEMENT_STATUS_PAID`]
function P() {
  let { t: e } = o(),
    { activeGarage: t } = b(),
    i = t?.id ?? ``,
    [P, F] = (0, j.useState)(``),
    [I, L] = (0, j.useState)(!1),
    R = E([...D(i), { status: P, outstandingOnly: I }], (e) => O.list(i, { status: P || void 0, outstandingOnly: I, page: e }), !!i)
  if (!i) return (0, M.jsx)(w, { message: e(`common.selectGarageFirst`) })
  let z = !!(P || I)
  return (0, M.jsxs)(n, {
    children: [
      (0, M.jsx)(C, { title: e(`settlements.title`), description: e(`settlements.description`) }),
      (0, M.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row sm:items-center`,
        children: [
          (0, M.jsx)(v, {
            wrapperClassName: `sm:w-56`,
            value: P,
            onChange: (e) => {
              ;(F(e.target.value), L(!1))
            },
            'aria-label': e(`common.status`),
            children: N.map((t) =>
              (0, M.jsx)(`option`, { value: t, children: t ? e(A(t)) : `${e(`common.status`)}: ${e(`common.all`)}` }, t || `all`),
            ),
          }),
          (0, M.jsx)(c, {
            checked: I,
            onChange: (e) => {
              ;(L(e.target.checked), F(``))
            },
            label: e(`settlements.outstandingOnly`),
            wrapperClassName: `items-center`,
          }),
        ],
      }),
      (0, M.jsx)(_, { isLoading: R.isLoading, error: R.error, onRetry: () => void R.refetch() }),
      R.data &&
        R.data.items.length === 0 &&
        (0, M.jsx)(r, {
          children: (0, M.jsx)(w, {
            kind: z ? `search` : `list`,
            title: z ? e(`ui.noResults`) : void 0,
            message: e(`settlements.empty`),
            action:
              z &&
              (0, M.jsx)(a, {
                variant: `outline`,
                onClick: () => {
                  ;(F(``), L(!1))
                },
                children: e(`ui.clearFilters`),
              }),
            compact: z,
          }),
        }),
      R.data &&
        R.data.items.length > 0 &&
        (0, M.jsxs)(r, {
          children: [
            (0, M.jsxs)(d, {
              caption: e(`settlements.title`),
              children: [
                (0, M.jsx)(l, {
                  children: (0, M.jsxs)(`tr`, {
                    children: [
                      (0, M.jsx)(f, { children: e(`settlements.number`) }),
                      (0, M.jsx)(f, { children: e(`settlements.customerVehicle`) }),
                      (0, M.jsx)(f, { children: e(`common.status`) }),
                      (0, M.jsx)(f, { numeric: !0, children: e(`settlements.total`) }),
                      (0, M.jsx)(f, { children: e(`common.createdAt`) }),
                    ],
                  }),
                }),
                (0, M.jsx)(p, {
                  children: R.data.items.map((t) =>
                    (0, M.jsxs)(
                      m,
                      {
                        rail: t.status === `SETTLEMENT_STATUS_PENDING` ? `warning` : void 0,
                        children: [
                          (0, M.jsx)(u, {
                            primary: !0,
                            label: e(`settlements.number`),
                            children: (0, M.jsx)(h, {
                              to: `/settlements/${t.id}`,
                              className: `num whitespace-nowrap hover:text-primary-subtle-foreground hover:underline`,
                              children: t.number,
                            }),
                          }),
                          (0, M.jsx)(u, {
                            label: e(`settlements.customerVehicle`),
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
                          (0, M.jsx)(u, {
                            numeric: !0,
                            label: e(`settlements.total`),
                            children: (0, M.jsx)(g, { text: x(t.totalAmount) }),
                          }),
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
export { P as SettlementsPage }
