import { At as e, Dt as t, M as n, N as r, Ot as i, R as a, S as o } from './api-lC4u2sZi.js'
import { n as s } from './Choice-C8tAQzDN.js'
import { G as c, S as l, f as u, gt as d } from './index-CbGLOUZk.js'
import { t as f } from './PageHeader-HSPIRw-a.js'
import { t as p } from './EmptyState-B6htI9zs.js'
import { n as m, r as h } from './api-yVqfsw1B.js'
import { t as g } from './VehicleTable-Il6VA6ri.js'
import { n as _, t as v } from './usePagedQuery-l3G6ju52.js'
import { t as y } from './useDebouncedValue-BuAekAoL.js'
var b = e(i(), 1),
  x = t()
function S() {
  let { t: e } = o(),
    { activeGarage: t, can: i } = u(),
    S = t?.id ?? ``,
    [C, w] = (0, b.useState)(``),
    [T, E] = (0, b.useState)(!1),
    D = y(C.trim()),
    O = v([...h(S), { debounced: D, includeInactive: T }], (e) => m.list(S, { query: D, page: e, includeInactive: T }), !!S)
  return S
    ? (0, x.jsxs)(n, {
        children: [
          (0, x.jsx)(f, { title: e(`vehicles.title`), description: e(`vehicles.description`) }),
          (0, x.jsxs)(`div`, {
            className: `flex flex-col gap-3 sm:flex-row sm:items-center`,
            children: [
              (0, x.jsx)(`div`, {
                className: `flex-1`,
                children: (0, x.jsx)(c, {
                  icon: (0, x.jsx)(d, {}),
                  'aria-label': e(`common.search`),
                  value: C,
                  onChange: (e) => w(e.target.value),
                  onClear: () => w(``),
                  clearLabel: e(`ui.clear`),
                  placeholder: e(`vehicles.searchPlaceholder`),
                }),
              }),
              (0, x.jsxs)(`label`, {
                className: `flex items-center gap-2 text-body text-muted-foreground`,
                children: [
                  (0, x.jsx)(s, { checked: T, onCheckedChange: E, label: e(`lifecycle.showInactive`) }),
                  e(`lifecycle.showInactive`),
                ],
              }),
            ],
          }),
          (0, x.jsx)(l, { isLoading: O.isLoading, error: O.error, onRetry: () => void O.refetch() }),
          O.data &&
            O.data.items.length === 0 &&
            (0, x.jsx)(r, {
              children: (0, x.jsx)(p, {
                kind: D ? `search` : `list`,
                title: D ? e(`ui.noResults`) : void 0,
                message: e(`vehicles.empty`),
                action: D && (0, x.jsx)(a, { variant: `outline`, onClick: () => w(``), children: e(`ui.clearFilters`) }),
                compact: !0,
              }),
            }),
          O.data &&
            O.data.items.length > 0 &&
            (0, x.jsxs)(r, {
              children: [
                (0, x.jsx)(g, { garageId: S, vehicles: O.data.items, showOwner: !0, canWrite: i(`PERMISSION_CUSTOMER_WRITE`) }),
                (0, x.jsx)(_, { page: O.page, pageSize: O.data.pageSize, total: O.data.total, onPageChange: O.setPage }),
              ],
            }),
        ],
      })
    : (0, x.jsx)(p, { message: e(`common.selectGarageFirst`) })
}
export { S as VehiclesPage }
