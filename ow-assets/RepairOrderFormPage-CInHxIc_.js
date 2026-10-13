import { At as e, Dt as t, Et as n, L as r, M as i, N as a, Ot as o, P as s, R as c, S as l, r as u } from './api-lC4u2sZi.js'
import { t as d } from './useMutation-YmV9sVwE.js'
import { t as f } from './StatusBadge-DknRod1K.js'
import { n as p, t as m } from './api-BOlXkYhw.js'
import { t as h } from './plus-CTDUdFcD.js'
import { t as g } from './trash-DZQxI2eA.js'
import { t as _ } from './Choice-C8tAQzDN.js'
import { a as v, i as y, n as b, o as x, r as S, s as C } from './Table-dqUq80Ez.js'
import {
  A as w,
  C as T,
  Ct as E,
  D,
  F as O,
  I as k,
  J as A,
  P as j,
  R as M,
  S as ee,
  U as N,
  W as P,
  X as F,
  f as I,
  j as L,
  y as R,
  z,
} from './index-CbGLOUZk.js'
import { t as B } from './PageHeader-HSPIRw-a.js'
import { t as V } from './Crumbs-CL4a3zqe.js'
import { n as H, t as U } from './api-yVqfsw1B.js'
import { t as W } from './api-D2cT5u-u.js'
import { t as G } from './SearchSelect-DQkPP5cW.js'
import { t as K } from './api-BvpQE47F.js'
import { n as q, r as te } from './api-D3jc5Ec0.js'
import { n as J, t as Y } from './api-CAXop4Lo.js'
import { n as ne, r as re } from './status-CaaLW-oP.js'
var X = e(o(), 1),
  Z = t(),
  Q = 0
function $() {
  return ((Q += 1), { key: `new-${Q}`, itemType: `REPAIR_ORDER_ITEM_TYPE_LABOR`, description: ``, quantity: `1`, unitPrice: `0` })
}
function ie(e) {
  return e.reduce((e, t) => e + Number(t.quantity || 0) * Number(t.unitPrice || 0), 0)
}
function ae() {
  let { t: e } = l(),
    { orderId: t } = O(),
    r = j(),
    a = n(),
    { activeGarage: o, isLoading: s } = I(),
    c = o?.id ?? ``,
    u = E({ queryKey: [...J(c), t], queryFn: () => Y.get(c, t ?? ``), enabled: !!(c && t) })
  if (s) return null
  if (!c) return (0, Z.jsx)(L, { to: `/repair-orders`, replace: !0 })
  if (t && !u.data)
    return (0, Z.jsx)(i, {
      children: (0, Z.jsx)(ee, { isLoading: u.isLoading, error: u.error, onRetry: () => void u.refetch(), skeleton: `detail` }),
    })
  let d = () => a.invalidateQueries({ queryKey: J(c) })
  return t && u.data
    ? (0, Z.jsx)(se, { garageId: c, order: u.data, onChanged: d })
    : (0, Z.jsx)(oe, {
        garageId: c,
        onCreated: (t) => {
          ;(d(), k.success(e(`common.saved`)), r(`/repair-orders/${t.id}`, { replace: !0 }))
        },
      })
}
function oe({ garageId: e, onCreated: t }) {
  let { t: n } = l(),
    [o, u] = (0, X.useState)(null),
    [f, p] = (0, X.useState)([$()]),
    m = d({
      mutationFn: () =>
        Y.create(e, {
          vehicleId: o?.id ?? ``,
          lines: f.map((e) => ({
            itemType: e.itemType,
            itemRefId: e.itemRefId,
            description: e.description,
            quantity: e.quantity,
            unitPrice: e.unitPrice,
          })),
        }),
      onSuccess: t,
    }),
    g = !!(o && f.length > 0 && f.every((e) => e.description.trim()))
  return (0, Z.jsxs)(i, {
    children: [
      (0, Z.jsx)(B, {
        breadcrumb: (0, Z.jsx)(V, { items: [{ label: n(`repairOrders.title`), to: `/repair-orders` }, { label: n(`repairOrders.new`) }] }),
        title: n(`repairOrders.new`),
        description: n(`repairOrders.formDescription`),
      }),
      m.error && (0, Z.jsx)(T, { tone: `error`, title: D(n, m.error) }),
      (0, Z.jsx)(a, {
        children: (0, Z.jsx)(s, {
          className: `max-w-xl`,
          children: (0, Z.jsx)(A, {
            label: n(`repairOrders.vehicle`),
            required: !0,
            children: (0, Z.jsx)(G, {
              placeholder: n(`vehicles.searchPlaceholder`),
              selected: o,
              onSelect: u,
              search: async (t) =>
                (await H.list(e, { query: t, page: 1, pageSize: 20 })).items.map((e) => ({
                  id: e.id ?? ``,
                  label: e.licensePlate ?? ``,
                  sublabel: `${U(e)} — ${e.customerName ?? ``}`,
                })),
            }),
          }),
        }),
      }),
      (0, Z.jsx)(le, { garageId: e, lines: f, editable: !0, onChange: p }),
      (0, Z.jsxs)(r, {
        children: [
          (0, Z.jsxs)(c, {
            variant: `outline`,
            onClick: () => p((e) => [...e, $()]),
            children: [(0, Z.jsx)(h, { 'aria-hidden': !0 }), ` `, n(`repairOrders.addLine`)],
          }),
          (0, Z.jsxs)(`div`, {
            className: `flex items-center gap-4`,
            children: [
              (0, Z.jsx)(`span`, { className: `text-heading`, children: (0, Z.jsx)(M, { text: R(ie(f)) }) }),
              (0, Z.jsx)(c, {
                variant: `primary`,
                disabled: !g,
                loading: m.isPending,
                onClick: () => m.mutate(),
                children: m.isPending ? n(`common.saving`) : n(`common.create`),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
function se({ garageId: e, order: t, onChanged: n }) {
  let { t: o } = l(),
    { can: s } = I(),
    h = s(`PERMISSION_REPAIR_ORDER_WRITE`),
    g = t.status === `REPAIR_ORDER_STATUS_CLOSED`,
    _ = (t.lines ?? []).length > 0 && (t.lines ?? []).every((e) => e.status === `REPAIR_ORDER_LINE_STATUS_COMPLETED`),
    y = E({ queryKey: te(e), queryFn: () => q.list(e) }).data ?? [],
    C = d({
      mutationFn: () => Y.close(e, t.id ?? ``),
      onSuccess: () => {
        ;(n(), k.success(o(`common.saved`)))
      },
    }),
    O = d({ mutationFn: () => m.exportRepairOrderPdf(e, t.id ?? ``, `${t.number}.pdf`) }),
    [A] = (0, X.useState)(u),
    j = d({ mutationFn: () => K.create(e, t.id ?? ``, A) })
  return (0, Z.jsxs)(i, {
    children: [
      (0, Z.jsx)(B, {
        breadcrumb: (0, Z.jsx)(V, { items: [{ label: o(`repairOrders.title`), to: `/repair-orders` }, { label: t.number }] }),
        title: t.number ?? ``,
        meta: (0, Z.jsx)(f, { tone: re(t.status), label: o(ne(t.status)) }),
        description: (0, Z.jsxs)(`span`, {
          className: `inline-flex flex-wrap items-center gap-2`,
          children: [(0, Z.jsx)(z, { children: t.vehicleLicensePlate ?? `` }), t.customerName],
        }),
        action: (0, Z.jsxs)(c, {
          variant: `outline`,
          loading: O.isPending,
          onClick: () => O.mutate(),
          children: [(0, Z.jsx)(p, { 'aria-hidden': !0 }), ` `, o(`repairOrders.exportPdf`)],
        }),
      }),
      C.error && (0, Z.jsx)(T, { tone: `error`, title: D(o, C.error) }),
      O.error && (0, Z.jsx)(T, { tone: `error`, title: D(o, O.error) }),
      j.error && (0, Z.jsx)(T, { tone: `error`, title: D(o, j.error) }),
      (0, Z.jsxs)(a, {
        children: [
          (0, Z.jsxs)(b, {
            caption: o(`repairOrders.title`),
            children: [
              (0, Z.jsx)(v, {
                children: (0, Z.jsxs)(`tr`, {
                  children: [
                    (0, Z.jsx)(x, { children: o(`repairOrders.itemType`) }),
                    (0, Z.jsx)(x, { children: o(`repairOrders.lineDescription`) }),
                    (0, Z.jsx)(x, { numeric: !0, children: o(`repairOrders.quantity`) }),
                    (0, Z.jsx)(x, { numeric: !0, children: o(`repairOrders.unitPrice`) }),
                    (0, Z.jsx)(x, { numeric: !0, children: o(`repairOrders.lineTotal`) }),
                    (0, Z.jsx)(x, { children: o(`repairOrders.lineStatus`) }),
                    (0, Z.jsx)(x, { children: o(`repairOrders.technicians`) }),
                  ],
                }),
              }),
              (0, Z.jsx)(S, {
                children: (t.lines ?? []).map((r) =>
                  (0, Z.jsx)(ce, { garageId: e, orderId: t.id ?? ``, line: r, technicians: y, editable: h && !g, onSaved: n }, r.id),
                ),
              }),
            ],
          }),
          (0, Z.jsxs)(`div`, {
            className: `flex items-center justify-between border-t border-border bg-surface-sunken px-4 py-3`,
            children: [
              (0, Z.jsx)(`span`, { className: `text-body font-medium`, children: o(`repairOrders.total`) }),
              (0, Z.jsx)(`span`, { className: `text-heading`, children: (0, Z.jsx)(M, { text: R(t.totalAmount) }) }),
            ],
          }),
        ],
      }),
      !g &&
        h &&
        (0, Z.jsxs)(r, {
          children: [
            (0, Z.jsx)(`span`, {
              className: `text-body text-muted-foreground`,
              children: o(_ ? `repairOrders.readyToClose` : `repairOrders.notReadyToClose`),
            }),
            (0, Z.jsx)(c, {
              variant: `primary`,
              disabled: !_,
              loading: C.isPending,
              onClick: () => C.mutate(),
              children: C.isPending ? o(`common.saving`) : o(`repairOrders.close`),
            }),
          ],
        }),
      g &&
        h &&
        !j.data &&
        (0, Z.jsxs)(r, {
          children: [
            (0, Z.jsx)(`span`, { className: `text-body text-muted-foreground`, children: o(`repairOrders.createSettlement`) }),
            (0, Z.jsx)(c, {
              variant: `primary`,
              loading: j.isPending,
              onClick: () => j.mutate(),
              children: j.isPending ? o(`common.saving`) : o(`repairOrders.createSettlement`),
            }),
          ],
        }),
      j.data &&
        (0, Z.jsx)(T, {
          tone: `info`,
          title: o(`repairOrders.settlementCreatedNotice`),
          action: (0, Z.jsx)(c, {
            asChild: !0,
            variant: `outline`,
            size: `sm`,
            children: (0, Z.jsx)(w, { to: `/settlements/${j.data.id}`, children: o(`repairOrders.viewSettlement`) }),
          }),
        }),
    ],
  })
}
function ce({ garageId: e, orderId: t, line: n, technicians: r, editable: i, onSaved: a }) {
  let { t: o } = l(),
    [s, u] = (0, X.useState)(n.status ?? `REPAIR_ORDER_LINE_STATUS_NOT_STARTED`),
    [f, p] = (0, X.useState)(n.assignedTechnicianIds ?? []),
    m = s !== (n.status ?? `REPAIR_ORDER_LINE_STATUS_NOT_STARTED`) || JSON.stringify(f) !== JSON.stringify(n.assignedTechnicianIds ?? []),
    h = d({
      mutationFn: () => Y.updateLine(e, t, n.id ?? ``, { status: s, assignedTechnicianIds: f }),
      onSuccess: () => {
        ;(a(), k.success(o(`common.saved`)))
      },
    }),
    g = (e) => p((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e]))
  return (0, Z.jsxs)(C, {
    rail: n.status === `REPAIR_ORDER_LINE_STATUS_COMPLETED` ? `success` : void 0,
    children: [
      (0, Z.jsx)(y, {
        label: o(`repairOrders.itemType`),
        className: `text-muted-foreground`,
        children: o(n.itemType === `REPAIR_ORDER_ITEM_TYPE_PART` ? `repairOrders.part` : `repairOrders.labor`),
      }),
      (0, Z.jsx)(y, { primary: !0, label: o(`repairOrders.lineDescription`), children: n.description }),
      (0, Z.jsx)(y, { numeric: !0, label: o(`repairOrders.quantity`), children: n.quantity }),
      (0, Z.jsx)(y, { numeric: !0, label: o(`repairOrders.unitPrice`), children: (0, Z.jsx)(M, { text: R(n.unitPrice) }) }),
      (0, Z.jsx)(y, { numeric: !0, label: o(`repairOrders.lineTotal`), children: (0, Z.jsx)(M, { text: R(n.lineTotal) }) }),
      (0, Z.jsx)(y, {
        label: o(`repairOrders.lineStatus`),
        children: i
          ? (0, Z.jsxs)(P, {
              'aria-label': o(`repairOrders.lineStatus`),
              value: s,
              onChange: (e) => u(e.target.value),
              children: [
                (0, Z.jsx)(`option`, {
                  value: `REPAIR_ORDER_LINE_STATUS_NOT_STARTED`,
                  children: o(`repairOrders.lineStatuses.NOT_STARTED`),
                }),
                (0, Z.jsx)(`option`, {
                  value: `REPAIR_ORDER_LINE_STATUS_IN_PROGRESS`,
                  children: o(`repairOrders.lineStatuses.IN_PROGRESS`),
                }),
                (0, Z.jsx)(`option`, { value: `REPAIR_ORDER_LINE_STATUS_COMPLETED`, children: o(`repairOrders.lineStatuses.COMPLETED`) }),
              ],
            })
          : o(`repairOrders.lineStatuses.${(n.status ?? `REPAIR_ORDER_LINE_STATUS_NOT_STARTED`).replace(`REPAIR_ORDER_LINE_STATUS_`, ``)}`),
      }),
      (0, Z.jsx)(y, {
        label: o(`repairOrders.technicians`),
        className: `py-2`,
        children: i
          ? (0, Z.jsxs)(`div`, {
              className: `flex min-w-40 flex-col gap-1.5`,
              children: [
                r.map((e) =>
                  (0, Z.jsx)(_, { checked: f.includes(e.userId ?? ``), onChange: () => g(e.userId ?? ``), label: e.fullName }, e.userId),
                ),
                m &&
                  (0, Z.jsx)(c, {
                    variant: `outline`,
                    size: `sm`,
                    className: `mt-1 self-start`,
                    loading: h.isPending,
                    onClick: () => h.mutate(),
                    children: h.isPending ? o(`common.saving`) : o(`common.save`),
                  }),
              ],
            })
          : r
              .filter((e) => (n.assignedTechnicianIds ?? []).includes(e.userId ?? ``))
              .map((e) => e.fullName)
              .join(`, `) || `—`,
      }),
    ],
  })
}
function le({ garageId: e, lines: t, editable: n, onChange: r }) {
  let { t: i } = l(),
    o = (e, n) => r(t.map((t) => (t.key === e ? { ...t, ...n } : t))),
    s = (e) => r(t.filter((t) => t.key !== e))
  return (0, Z.jsx)(a, {
    children: (0, Z.jsxs)(b, {
      caption: i(`repairOrders.lineDescription`),
      children: [
        (0, Z.jsx)(v, {
          children: (0, Z.jsxs)(`tr`, {
            children: [
              (0, Z.jsx)(x, { className: `w-36`, children: i(`repairOrders.itemType`) }),
              (0, Z.jsx)(x, { children: i(`repairOrders.lineDescription`) }),
              (0, Z.jsx)(x, { className: `w-56`, children: i(`repairOrders.part`) }),
              (0, Z.jsx)(x, { numeric: !0, className: `w-28`, children: i(`repairOrders.quantity`) }),
              (0, Z.jsx)(x, { numeric: !0, className: `w-40`, children: i(`repairOrders.unitPrice`) }),
              (0, Z.jsx)(x, { numeric: !0, children: i(`repairOrders.lineTotal`) }),
              n &&
                (0, Z.jsx)(x, { className: `w-px`, children: (0, Z.jsx)(`span`, { className: `sr-only`, children: i(`common.actions`) }) }),
            ],
          }),
        }),
        (0, Z.jsx)(S, {
          children: t.map((r, a) =>
            (0, Z.jsxs)(
              C,
              {
                children: [
                  (0, Z.jsx)(y, {
                    label: i(`repairOrders.itemType`),
                    className: `py-2`,
                    children: (0, Z.jsxs)(P, {
                      'aria-label': `${i(`repairOrders.itemType`)} ${a + 1}`,
                      value: r.itemType,
                      onChange: (e) => {
                        let t = e.target.value
                        o(r.key, { itemType: t, itemRefId: t === `REPAIR_ORDER_ITEM_TYPE_PART` ? r.itemRefId : void 0 })
                      },
                      children: [
                        (0, Z.jsx)(`option`, { value: `REPAIR_ORDER_ITEM_TYPE_LABOR`, children: i(`repairOrders.labor`) }),
                        (0, Z.jsx)(`option`, { value: `REPAIR_ORDER_ITEM_TYPE_PART`, children: i(`repairOrders.part`) }),
                      ],
                    }),
                  }),
                  (0, Z.jsx)(y, {
                    label: i(`repairOrders.lineDescription`),
                    className: `py-2`,
                    children: (0, Z.jsx)(N, {
                      'aria-label': `${i(`repairOrders.lineDescription`)} ${a + 1}`,
                      value: r.description,
                      maxLength: 500,
                      onChange: (e) => o(r.key, { description: e.target.value }),
                    }),
                  }),
                  (0, Z.jsx)(y, {
                    label: i(`repairOrders.part`),
                    className: `py-2`,
                    children:
                      r.itemType === `REPAIR_ORDER_ITEM_TYPE_PART`
                        ? (0, Z.jsx)(G, {
                            id: `ro-item-${r.key}`,
                            placeholder: i(`inventory.searchPlaceholder`),
                            selected: r.itemRefId ? { id: r.itemRefId, label: r.itemLabel ?? r.itemRefId } : null,
                            onSelect: (e) => o(r.key, { itemRefId: e?.id, itemLabel: e?.label }),
                            search: async (t) =>
                              (await W.list(e, { query: t, page: 1, pageSize: 20 })).items.map((e) => ({
                                id: e.id ?? ``,
                                label: e.sku ?? ``,
                                sublabel: e.name,
                              })),
                          })
                        : (0, Z.jsx)(`span`, { className: `text-muted-foreground`, children: `—` }),
                  }),
                  (0, Z.jsx)(y, {
                    numeric: !0,
                    label: i(`repairOrders.quantity`),
                    className: `py-2`,
                    children: (0, Z.jsx)(N, {
                      'aria-label': `${i(`repairOrders.quantity`)} ${a + 1}`,
                      type: `number`,
                      min: 0.01,
                      step: 0.01,
                      value: r.quantity,
                      onChange: (e) => o(r.key, { quantity: e.target.value }),
                      className: `num text-right`,
                    }),
                  }),
                  (0, Z.jsx)(y, {
                    numeric: !0,
                    label: i(`repairOrders.unitPrice`),
                    className: `py-2`,
                    children: (0, Z.jsx)(N, {
                      'aria-label': `${i(`repairOrders.unitPrice`)} ${a + 1}`,
                      type: `number`,
                      min: 0,
                      step: 1e3,
                      value: r.unitPrice,
                      onChange: (e) => o(r.key, { unitPrice: e.target.value }),
                      className: `num text-right`,
                    }),
                  }),
                  (0, Z.jsx)(y, {
                    numeric: !0,
                    label: i(`repairOrders.lineTotal`),
                    children: (0, Z.jsx)(M, { text: R(Number(r.quantity || 0) * Number(r.unitPrice || 0)) }),
                  }),
                  n &&
                    (0, Z.jsx)(y, {
                      actions: !0,
                      children: (0, Z.jsx)(F, {
                        size: `icon-sm`,
                        label: `${i(`common.delete`)} ${a + 1}`,
                        icon: (0, Z.jsx)(g, { 'aria-hidden': !0 }),
                        disabled: t.length <= 1,
                        onClick: () => s(r.key),
                      }),
                    }),
                ],
              },
              r.key,
            ),
          ),
        }),
      ],
    }),
  })
}
export { ae as RepairOrderFormPage }
