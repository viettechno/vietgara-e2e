import {
  At as e,
  Dt as t,
  F as n,
  K as r,
  M as i,
  N as a,
  O as o,
  Ot as s,
  R as c,
  S as l,
  Y as u,
  i as d,
  n as f,
  q as p,
} from './api-lC4u2sZi.js'
import { t as m } from './StatusBadge-DknRod1K.js'
import { a as h, i as g, n as _, o as v, r as y, s as b } from './Table-dqUq80Ez.js'
import { n as x, r as S } from './Stats-Uw-xO1jC.js'
import { A as C, Ct as w, R as T, _ as E, _t as ee, f as D, m as O, y as k, z as A } from './index-CbGLOUZk.js'
import { t as j } from './PageHeader-HSPIRw-a.js'
import { t as M } from './EmptyState-B6htI9zs.js'
import { n as N, t as te } from './api-D2cT5u-u.js'
import { n as ne, t as re } from './api-BvpQE47F.js'
import { n as ie, t as ae } from './api-CAXop4Lo.js'
import { n as oe, r as se } from './status-CaaLW-oP.js'
var ce = p(`arrow-right`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `m12 5 7 7-7 7`, key: `xquz4c` }],
  ]),
  le = p(`receipt-text`, [
    [`path`, { d: `M13 16H8`, key: `wsln4y` }],
    [`path`, { d: `M14 8H8`, key: `1l3xfs` }],
    [`path`, { d: `M16 12H8`, key: `1fr5h0` }],
    [
      `path`,
      {
        d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
        key: `ycz6yz`,
      },
    ],
  ]),
  P = e(s(), 1),
  F = t(),
  I = 200,
  L = { top: 12, right: 8, bottom: 26, left: 48 }
function R(e) {
  if (e <= 0) return 1
  let t = 10 ** Math.floor(Math.log10(e)),
    n = e / t
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * t
}
function z({ points: e, label: t, formatValue: n, formatTick: r = n, className: i }) {
  let [a, o] = (0, P.useState)(null),
    s = (0, P.useRef)(null),
    [c, l] = (0, P.useState)(720)
  ;(0, P.useEffect)(() => {
    let e = s.current
    if (!e || typeof ResizeObserver > `u`) return
    let t = new ResizeObserver(([e]) => l(Math.max(Math.round(e.contentRect.width), 240)))
    return (t.observe(e), () => t.disconnect())
  }, [])
  let d = (0, P.useId)(),
    f = R(Math.max(0, ...e.map((e) => e.value))),
    p = c - L.left - L.right,
    m = I - L.top - L.bottom,
    h = e.length ? p / e.length : p,
    g = Math.max(h * 0.62, 2),
    _ = [0, 0.5, 1].map((e) => e * f),
    v = Math.ceil(e.length / (c < 480 ? 4 : 6)),
    y = a === null ? null : e[a]
  return (0, F.jsxs)(`figure`, {
    ref: s,
    className: u(`relative m-0`, i),
    children: [
      (0, F.jsxs)(`svg`, {
        viewBox: `0 0 ${c} ${I}`,
        role: `img`,
        'aria-labelledby': d,
        width: c,
        height: I,
        className: `block h-auto w-full`,
        onMouseLeave: () => o(null),
        children: [
          (0, F.jsx)(`title`, { id: d, children: t }),
          _.map((e) => {
            let t = L.top + m - (e / f) * m
            return (0, F.jsxs)(
              `g`,
              {
                children: [
                  (0, F.jsx)(`line`, {
                    x1: L.left,
                    x2: c - L.right,
                    y1: t,
                    y2: t,
                    stroke: `var(--border)`,
                    strokeDasharray: e === 0 ? void 0 : `3 4`,
                  }),
                  (0, F.jsx)(`text`, {
                    x: L.left - 8,
                    y: t + 4,
                    textAnchor: `end`,
                    fontSize: `11`,
                    fill: `var(--muted-foreground)`,
                    className: `num`,
                    children: r(e),
                  }),
                ],
              },
              e,
            )
          }),
          e.map((e, t) => {
            let n = (e.value / f) * m,
              r = L.left + t * h + (h - g) / 2
            return (0, F.jsxs)(
              `g`,
              {
                onMouseEnter: () => o(t),
                children: [
                  (0, F.jsx)(`rect`, { x: L.left + t * h, y: L.top, width: h, height: m, fill: `transparent` }),
                  e.value > 0 &&
                    (0, F.jsx)(`rect`, {
                      x: r,
                      y: L.top + m - n,
                      width: g,
                      height: Math.max(n, 1),
                      rx: `2`,
                      fill: `var(--chart-1)`,
                      opacity: a === null || a === t ? 1 : 0.45,
                    }),
                  t % v === 0 &&
                    (0, F.jsx)(`text`, {
                      x: r + g / 2,
                      y: 192,
                      textAnchor: `middle`,
                      fontSize: `11`,
                      fill: `var(--muted-foreground)`,
                      children: e.label,
                    }),
                ],
              },
              t,
            )
          }),
        ],
      }),
      (0, F.jsx)(`div`, {
        'aria-live': `polite`,
        className: `pointer-events-none absolute right-0 top-0 min-h-6 rounded-md bg-foreground px-2 py-1 text-caption text-background transition-opacity`,
        style: { opacity: +!!y },
        children: y ? `${y.label}: ${n(y.value)}` : ``,
      }),
    ],
  })
}
var B = { getRevenueReport: (e, t) => f.get(`${O(e)}/reports/revenue${d(t)}`) }
function V(e, t) {
  return [`garages`, e, `reports`, `revenue`, t]
}
function H(e) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`
}
function U(e = 30, t = new Date()) {
  let n = new Date(t)
  n.setDate(n.getDate() - (e - 1))
  let r = new Date(t)
  return (r.setDate(r.getDate() + 1), { from: H(n), to: H(r) })
}
function ue(e = new Date()) {
  let t = new Date(e.getFullYear(), e.getMonth(), 1),
    n = new Date(e.getFullYear(), e.getMonth() + 1, 1)
  return { from: H(t), to: H(n) }
}
var de = [`REPAIR_ORDER_STATUS_OPEN`, `REPAIR_ORDER_STATUS_IN_PROGRESS`, `REPAIR_ORDER_STATUS_WAITING_ON_PARTS`]
function fe(e, t = 5) {
  return [...e].sort((e, t) => (t.createdAt ?? ``).localeCompare(e.createdAt ?? ``)).slice(0, t)
}
function W(e) {
  return Number(e.quantityOnHand ?? 0) <= (e.reorderThreshold ?? 0)
}
function pe(e) {
  return e.filter(W)
}
function G(e) {
  return Number(e.totalAmount ?? 0) - Number(e.paidAmount ?? 0)
}
function K(e) {
  return e.reduce((e, t) => e + G(t), 0)
}
function me(e, t = 30, n = new Date()) {
  let r = new Map()
  for (let t of e) r.set((t.periodLabel ?? ``).slice(0, 10), (r.get((t.periodLabel ?? ``).slice(0, 10)) ?? 0) + Number(t.amount ?? 0))
  return Array.from({ length: t }, (e, i) => {
    let a = new Date(n)
    a.setDate(a.getDate() - (t - 1 - i))
    let o = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, `0`)}-${String(a.getDate()).padStart(2, `0`)}`
    return { label: `${a.getDate()}/${a.getMonth() + 1}`, value: r.get(o) ?? 0 }
  })
}
var q = 100
function J() {
  let { t: e } = l(),
    { activeGarage: t, can: s } = D(),
    u = t?.id ?? ``,
    d = s(`PERMISSION_REPORT_READ`),
    f = s(`PERMISSION_REPAIR_ORDER_READ`),
    p = s(`PERMISSION_INVENTORY_READ`),
    O = s(`PERMISSION_BILLING_READ`),
    I = ue(),
    L = U(),
    R = w({
      queryKey: V(u, { period: `REVENUE_PERIOD_MONTH`, ...I }),
      queryFn: () => B.getRevenueReport(u, { period: `REVENUE_PERIOD_MONTH`, ...I }),
      enabled: !!u && d,
    }),
    H = w({
      queryKey: V(u, { period: `REVENUE_PERIOD_DAY`, ...L }),
      queryFn: () => B.getRevenueReport(u, { period: `REVENUE_PERIOD_DAY`, ...L }),
      enabled: !!u && d,
    }),
    W = w({
      queryKey: [...ie(u), `dashboard`],
      queryFn: async () => {
        let e = await Promise.all(de.map((e) => ae.list(u, { status: e, page: 1, pageSize: q })))
        return { total: e.reduce((e, t) => e + t.total, 0), items: e.flatMap((e) => e.items) }
      },
      enabled: !!u && f,
    }),
    G = w({ queryKey: [...N(u), `dashboard`], queryFn: () => te.list(u, { page: 1, pageSize: q }), enabled: !!u && p }),
    J = w({
      queryKey: [...ne(u), `dashboard-outstanding`],
      queryFn: () => re.list(u, { outstandingOnly: !0, page: 1, pageSize: q }),
      enabled: !!u && O,
    }),
    Y = G.data ? pe(G.data.items) : [],
    X = J.data ? K(J.data.items) : 0,
    Z = J.data?.items.length ?? 0,
    Q = W.data ? fe(W.data.items, 5) : [],
    he = Number(H.data?.totalAmount ?? 0) > 0,
    ge = (0, P.useMemo)(() => me(H.data?.points ?? []), [H.data]),
    $ = [
      p &&
        Y.length > 0 && {
          key: `stock`,
          icon: ee,
          text: e(`dashboard.lowStockAlert`, { count: Y.length }),
          to: `/inventory`,
          action: e(`dashboard.viewInventory`),
        },
      O &&
        Z > 0 && {
          key: `ar`,
          icon: le,
          text: e(`dashboard.outstandingAlert`, { count: Z }),
          to: `/settlements`,
          action: e(`dashboard.viewSettlements`),
        },
    ].filter(Boolean)
  return u
    ? (0, F.jsxs)(i, {
        children: [
          (0, F.jsx)(j, { title: e(`dashboard.title`), description: e(`dashboard.body`) }),
          (0, F.jsxs)(S, {
            children: [
              d &&
                (0, F.jsx)(x, {
                  label: e(`dashboard.monthlyRevenue`),
                  value: (0, F.jsx)(T, { text: k(R.data?.totalAmount) }),
                  loading: R.isLoading,
                }),
              f && (0, F.jsx)(x, { label: e(`dashboard.ordersInProgress`), value: String(W.data?.total ?? 0), loading: W.isLoading }),
              O &&
                (0, F.jsx)(x, {
                  label: e(`dashboard.outstandingReceivables`),
                  value: (0, F.jsx)(T, { text: k(X) }),
                  tone: X > 0 ? `warning` : `default`,
                  loading: J.isLoading,
                }),
            ],
          }),
          (0, F.jsxs)(`div`, {
            className: `grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`,
            children: [
              d &&
                (0, F.jsxs)(a, {
                  children: [
                    (0, F.jsx)(n, { title: e(`dashboard.revenueChartTitle`) }),
                    (0, F.jsx)(`div`, {
                      className: `p-5 max-sm:p-4`,
                      children: H.isLoading
                        ? (0, F.jsx)(o, { className: `h-48 w-full` })
                        : he
                          ? (0, F.jsx)(z, {
                              points: ge,
                              label: e(`dashboard.revenueChartTitle`),
                              formatValue: (e) => k(e),
                              formatTick: (e) =>
                                e >= 1e6 ? `${+(e / 1e6).toFixed(1)}M` : e >= 1e3 ? `${+(e / 1e3).toFixed(0)}k` : String(e),
                            })
                          : (0, F.jsx)(M, { kind: `search`, message: e(`dashboard.revenueEmpty`), compact: !0 }),
                    }),
                  ],
                }),
              (p || O) &&
                (0, F.jsxs)(a, {
                  className: d ? `` : `lg:col-span-2`,
                  children: [
                    (0, F.jsx)(n, { title: e(`dashboard.attention`) }),
                    G.isLoading || J.isLoading
                      ? (0, F.jsxs)(`div`, {
                          className: `flex flex-col gap-3 p-5`,
                          children: [(0, F.jsx)(o, { className: `h-5 w-4/5` }), (0, F.jsx)(o, { className: `h-5 w-3/5` })],
                        })
                      : $.length === 0
                        ? (0, F.jsx)(`p`, {
                            className: `px-5 py-8 text-center text-body text-muted-foreground`,
                            children: e(`dashboard.attentionNone`),
                          })
                        : (0, F.jsx)(`ul`, {
                            className: `divide-y divide-border`,
                            children: $.map((e) =>
                              (0, F.jsx)(
                                `li`,
                                {
                                  children: (0, F.jsxs)(C, {
                                    to: e.to,
                                    className: `group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/60`,
                                    children: [
                                      (0, F.jsx)(`span`, {
                                        className: `grid size-8 shrink-0 place-items-center rounded-md bg-warning-subtle text-warning-subtle-foreground`,
                                        children: (0, F.jsx)(e.icon, { className: `size-4`, 'aria-hidden': !0 }),
                                      }),
                                      (0, F.jsx)(`span`, { className: `min-w-0 flex-1 text-body`, children: e.text }),
                                      (0, F.jsx)(r, {
                                        className: `size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5`,
                                        'aria-hidden': !0,
                                      }),
                                      (0, F.jsx)(`span`, { className: `sr-only`, children: e.action }),
                                    ],
                                  }),
                                },
                                e.key,
                              ),
                            ),
                          }),
                  ],
                }),
            ],
          }),
          f &&
            (0, F.jsxs)(a, {
              children: [
                (0, F.jsx)(n, {
                  title: e(`dashboard.recentOrders`),
                  actions: (0, F.jsx)(c, {
                    asChild: !0,
                    variant: `ghost`,
                    size: `sm`,
                    children: (0, F.jsxs)(C, {
                      to: `/repair-orders`,
                      children: [e(`nav.repairOrders`), ` `, (0, F.jsx)(ce, { 'aria-hidden': !0 })],
                    }),
                  }),
                }),
                W.isLoading &&
                  (0, F.jsxs)(`div`, {
                    className: `flex flex-col gap-3 p-5`,
                    children: [
                      (0, F.jsx)(o, { className: `h-5 w-full` }),
                      (0, F.jsx)(o, { className: `h-5 w-full` }),
                      (0, F.jsx)(o, { className: `h-5 w-3/4` }),
                    ],
                  }),
                !W.isLoading && Q.length === 0 && (0, F.jsx)(M, { message: e(`dashboard.recentOrdersEmpty`), compact: !0 }),
                Q.length > 0 &&
                  (0, F.jsxs)(_, {
                    compact: !0,
                    caption: e(`dashboard.recentOrders`),
                    children: [
                      (0, F.jsx)(h, {
                        children: (0, F.jsxs)(`tr`, {
                          children: [
                            (0, F.jsx)(v, { children: e(`repairOrders.number`) }),
                            (0, F.jsx)(v, { children: e(`repairOrders.vehicle`) }),
                            (0, F.jsx)(v, { children: e(`common.status`) }),
                            (0, F.jsx)(v, { numeric: !0, children: e(`repairOrders.total`) }),
                            (0, F.jsx)(v, { children: e(`common.createdAt`) }),
                          ],
                        }),
                      }),
                      (0, F.jsx)(y, {
                        children: Q.map((t) =>
                          (0, F.jsxs)(
                            b,
                            {
                              children: [
                                (0, F.jsx)(g, {
                                  primary: !0,
                                  label: e(`repairOrders.number`),
                                  children: (0, F.jsx)(C, {
                                    to: `/repair-orders/${t.id}`,
                                    className: `num whitespace-nowrap hover:text-primary-subtle-foreground hover:underline`,
                                    children: t.number,
                                  }),
                                }),
                                (0, F.jsx)(g, {
                                  label: e(`repairOrders.vehicle`),
                                  children: (0, F.jsxs)(`span`, {
                                    className: `inline-flex flex-wrap items-center gap-2`,
                                    children: [
                                      (0, F.jsx)(A, { children: t.vehicleLicensePlate ?? `` }),
                                      (0, F.jsx)(`span`, { className: `text-muted-foreground`, children: t.customerName }),
                                    ],
                                  }),
                                }),
                                (0, F.jsx)(g, {
                                  label: e(`common.status`),
                                  children: (0, F.jsx)(m, { tone: se(t.status), label: e(oe(t.status)) }),
                                }),
                                (0, F.jsx)(g, {
                                  numeric: !0,
                                  label: e(`repairOrders.total`),
                                  children: (0, F.jsx)(T, { text: k(t.totalAmount) }),
                                }),
                                (0, F.jsx)(g, {
                                  label: e(`common.createdAt`),
                                  className: `num text-muted-foreground`,
                                  children: E(t.createdAt),
                                }),
                              ],
                            },
                            t.id,
                          ),
                        ),
                      }),
                    ],
                  }),
              ],
            }),
        ],
      })
    : (0, F.jsx)(M, { message: e(`common.selectGarageFirst`) })
}
export { J as DashboardPage }
