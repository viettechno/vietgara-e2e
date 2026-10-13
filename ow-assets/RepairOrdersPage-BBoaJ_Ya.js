import { At as e, Dt as t, M as n, O as r, Ot as i, R as a, S as o } from './api-lC4u2sZi.js'
import { t as s } from './StatusBadge-DknRod1K.js'
import { t as c } from './plus-CTDUdFcD.js'
import { A as l, Ct as u, H as d, L as f, S as p, W as m, _ as h, f as g, z as _ } from './index-CbGLOUZk.js'
import { t as v } from './PageHeader-HSPIRw-a.js'
import { t as y } from './EmptyState-B6htI9zs.js'
import { n as b, r as x } from './api-D3jc5Ec0.js'
import { n as S, t as C } from './api-CAXop4Lo.js'
import { n as w, r as T, t as E } from './status-CaaLW-oP.js'
var D = e(i(), 1),
  O = t()
function k() {
  let { t: e } = o(),
    { activeGarage: t, can: i } = g(),
    k = t?.id ?? ``,
    A = i(`PERMISSION_REPAIR_ORDER_WRITE`),
    [j, M] = (0, D.useState)(``),
    N = u({ queryKey: x(k), queryFn: () => b.list(k), enabled: !!k }).data ?? [],
    P = u({
      queryKey: [...S(k), `board`, j],
      queryFn: async () => {
        let e = await Promise.all(E.map((e) => C.list(k, { status: e, technicianId: j || void 0, page: 1 })))
        return E.map((t, n) => ({ status: t, items: e[n].items }))
      },
      enabled: !!k,
    })
  if (!k) return (0, O.jsx)(y, { message: e(`common.selectGarageFirst`) })
  let F = P.data ?? E.map((e) => ({ status: e, items: [] })),
    I = P.isLoading,
    L = P.error,
    R =
      A &&
      (0, O.jsx)(a, {
        asChild: !0,
        variant: `primary`,
        children: (0, O.jsxs)(l, {
          to: `/repair-orders/new`,
          children: [(0, O.jsx)(c, { 'aria-hidden': !0 }), ` `, e(`repairOrders.new`)],
        }),
      })
  return (0, O.jsxs)(n, {
    wide: !0,
    className: `max-w-none`,
    children: [
      (0, O.jsx)(v, { title: e(`repairOrders.title`), description: e(`repairOrders.description`), action: R }),
      (0, O.jsxs)(m, {
        wrapperClassName: `sm:w-64`,
        value: j,
        onChange: (e) => M(e.target.value),
        'aria-label': e(`repairOrders.filterTechnician`),
        children: [
          (0, O.jsx)(`option`, { value: ``, children: e(`repairOrders.filterTechnician`) }),
          N.map((e) => (0, O.jsx)(`option`, { value: e.userId, children: e.fullName }, e.userId)),
        ],
      }),
      (0, O.jsx)(p, { isLoading: !1, error: L, onRetry: () => void P.refetch() }),
      !L &&
        (0, O.jsx)(`div`, {
          className: `-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0`,
          'aria-busy': I,
          children: F.map(({ status: t, items: n }) =>
            (0, O.jsxs)(
              `section`,
              {
                'aria-label': e(w(t)),
                className: `flex min-w-[17rem] shrink-0 basis-[85%] snap-start flex-col rounded-lg bg-surface-sunken sm:basis-[45%] lg:min-w-0 lg:basis-auto`,
                children: [
                  (0, O.jsxs)(`header`, {
                    className: `flex items-center justify-between px-3.5 py-3`,
                    children: [
                      (0, O.jsx)(`h2`, { className: `text-body font-semibold`, children: e(w(t)) }),
                      (0, O.jsx)(d, { children: I ? `–` : n.length }),
                    ],
                  }),
                  (0, O.jsxs)(`ul`, {
                    className: `flex min-h-24 flex-col gap-2.5 px-2.5 pb-2.5`,
                    children: [
                      I &&
                        (0, O.jsxs)(O.Fragment, {
                          children: [
                            (0, O.jsx)(`li`, { children: (0, O.jsx)(r, { className: `h-24 w-full rounded-lg` }) }),
                            (0, O.jsx)(`li`, { children: (0, O.jsx)(r, { className: `h-24 w-full rounded-lg` }) }),
                          ],
                        }),
                      !I &&
                        n.length === 0 &&
                        (0, O.jsx)(`li`, {
                          className: `rounded-lg border border-dashed border-border px-3 py-6 text-center text-caption text-muted-foreground`,
                          children: e(`repairOrders.columnEmpty`),
                        }),
                      n.map((t) =>
                        (0, O.jsx)(
                          f.li,
                          {
                            layout: !0,
                            transition: { duration: 0.16 },
                            children: (0, O.jsxs)(l, {
                              to: `/repair-orders/${t.id}`,
                              className: `flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-input`,
                              children: [
                                (0, O.jsx)(`span`, { className: `num whitespace-nowrap text-body font-medium`, children: t.number }),
                                (0, O.jsxs)(`span`, {
                                  className: `flex flex-wrap items-center gap-2`,
                                  children: [
                                    (0, O.jsx)(_, { children: t.vehicleLicensePlate ?? `` }),
                                    (0, O.jsx)(s, { tone: T(t.status), label: e(w(t.status)) }),
                                  ],
                                }),
                                (0, O.jsxs)(`span`, {
                                  className: `flex items-center justify-between gap-2 text-caption text-muted-foreground`,
                                  children: [
                                    (0, O.jsx)(`span`, { className: `truncate`, children: t.customerName }),
                                    (0, O.jsx)(`span`, { className: `num shrink-0`, children: h(t.updatedAt) }),
                                  ],
                                }),
                              ],
                            }),
                          },
                          t.id,
                        ),
                      ),
                    ],
                  }),
                ],
              },
              t,
            ),
          ),
        }),
      !I &&
        !L &&
        F.every((e) => e.items.length === 0) &&
        (0, O.jsx)(`p`, { className: `text-center text-body text-muted-foreground`, children: e(`repairOrders.empty`) }),
    ],
  })
}
export { k as RepairOrdersPage }
