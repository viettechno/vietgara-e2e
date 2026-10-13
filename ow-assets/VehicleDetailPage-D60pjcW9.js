import { At as e, Dt as t, Et as n, I as r, M as i, N as a, Ot as o, R as s, S as c, q as l } from './api-lC4u2sZi.js'
import { n as u, t as d } from './VehicleFormModal-Bq-J6gjN.js'
import { t as f } from './pencil-DC9AcF2N.js'
import { t as p } from './CustomerPicker-BBeIuV2B.js'
import { n as m, t as h } from './Modal-BAMT8Cnj.js'
import { a as g, i as _, n as v, o as y, r as b, s as x } from './Table-dqUq80Ez.js'
import {
  A as S,
  C,
  Ct as w,
  D as T,
  F as E,
  I as D,
  J as O,
  K as k,
  R as A,
  S as j,
  V as M,
  _ as N,
  f as P,
  pt as F,
  y as I,
  z as L,
} from './index-CbGLOUZk.js'
import { t as R } from './PageHeader-HSPIRw-a.js'
import { n as z } from './form-Bpp5E52a.js'
import { t as B } from './Crumbs-CL4a3zqe.js'
import { t as V } from './EmptyState-B6htI9zs.js'
import { n as H, r as U } from './api-yVqfsw1B.js'
import { t as W } from './FormModal-O5Cwhy1v.js'
var G = l(`arrow-right-left`, [
    [`path`, { d: `m16 3 4 4-4 4`, key: `1x1c3m` }],
    [`path`, { d: `M20 7H4`, key: `zbl0bi` }],
    [`path`, { d: `m8 21-4-4 4-4`, key: `h9nckh` }],
    [`path`, { d: `M4 17h16`, key: `g4d7ey` }],
  ]),
  K = e(o(), 1),
  q = t()
function J({ garageId: e, vehicle: t, onClose: n, onSave: r }) {
  let { t: i } = c(),
    [a, o] = (0, K.useState)(null),
    [l, u] = (0, K.useState)(``),
    [d, f] = (0, K.useState)(null),
    [g, _] = (0, K.useState)(!1),
    v = async (e) => {
      if ((e.preventDefault(), a?.id)) {
        ;(_(!0), f(null))
        try {
          await r({ customerId: a.id, reason: l.trim() })
        } catch (e) {
          ;(f(e), _(!1))
        }
      }
    },
    y = a?.id === t.customerId
  return (0, q.jsx)(h, {
    title: i(`vehicles.owner.title`, { plate: t.licensePlate }),
    description: i(`vehicles.owner.description`, { owner: t.customerName }),
    error: d ? T(i, d) : ``,
    onClose: n,
    children: (0, q.jsxs)(`form`, {
      onSubmit: v,
      className: `flex flex-col gap-4`,
      children: [
        (0, q.jsx)(O, {
          label: i(`vehicles.owner.newOwner`),
          required: !0,
          error: y ? i(`vehicles.owner.same`) : void 0,
          children: (0, q.jsx)(p, { garageId: e, selected: a, onSelect: o }),
        }),
        (0, q.jsx)(O, {
          label: i(`vehicles.owner.reason`),
          children: (0, q.jsx)(k, { rows: 2, maxLength: 500, value: l, onChange: (e) => u(e.target.value) }),
        }),
        (0, q.jsxs)(m, {
          children: [
            (0, q.jsx)(s, { variant: `outline`, onClick: n, children: i(`common.cancel`) }),
            (0, q.jsx)(s, {
              type: `submit`,
              variant: `primary`,
              disabled: !a || y,
              loading: g,
              children: i(g ? `common.saving` : `vehicles.owner.submit`),
            }),
          ],
        }),
      ],
    }),
  })
}
var Y = [
  { value: `VEHICLE_IDENTITY_FIELD_LICENSE_PLATE`, labelKey: `vehicles.plate` },
  { value: `VEHICLE_IDENTITY_FIELD_VIN`, labelKey: `vehicles.vin` },
  { value: `VEHICLE_IDENTITY_FIELD_ENGINE_NUMBER`, labelKey: `vehicles.engine` },
  { value: `VEHICLE_IDENTITY_FIELD_MAKE`, labelKey: `vehicles.make` },
  { value: `VEHICLE_IDENTITY_FIELD_MODEL`, labelKey: `vehicles.model` },
  { value: `VEHICLE_IDENTITY_FIELD_YEAR`, labelKey: `vehicles.year` },
]
function X({ vehicle: e, onClose: t, onSave: n }) {
  let { t: r } = c()
  return (0, q.jsx)(W, {
    title: r(`vehicles.correct.title`, { plate: e.licensePlate }),
    description: r(`vehicles.correct.description`),
    fields: [
      {
        name: `field`,
        label: r(`vehicles.correct.field`),
        type: `select`,
        options: Y.map((e) => ({ value: e.value, label: r(e.labelKey) })),
      },
      { name: `value`, label: r(`vehicles.correct.value`), hint: r(`vehicles.correct.valueHint`), maxLength: 50 },
      { name: `reason`, label: r(`vehicles.correct.reason`), type: `textarea`, required: !0, maxLength: 500 },
    ],
    values: { field: Y[0].value },
    submitLabel: r(`vehicles.correct.submit`),
    onClose: t,
    onSave: (e) => n({ field: z(e, `field`), value: z(e, `value`), reason: z(e, `reason`) }),
  })
}
var Z = {
  VEHICLE_HISTORY_ENTRY_TYPE_QUOTE: `/quotes`,
  VEHICLE_HISTORY_ENTRY_TYPE_REPAIR_ORDER: `/repair-orders`,
  VEHICLE_HISTORY_ENTRY_TYPE_SETTLEMENT: `#`,
}
function Q() {
  let { t: e } = c(),
    { vehicleId: t = `` } = E(),
    o = n(),
    { activeGarage: l, can: p } = P(),
    m = l?.id ?? ``,
    h = p(`PERMISSION_CUSTOMER_WRITE`),
    T = p(`PERMISSION_CUSTOMER_CORRECT`),
    [O, k] = (0, K.useState)(null),
    z = w({ queryKey: [...U(m), t], queryFn: () => H.get(m, t), enabled: !!m }),
    W = w({ queryKey: [...U(m), t, `history`], queryFn: () => H.history(m, t), enabled: !!m })
  if (!z.data)
    return (0, q.jsx)(i, {
      children: (0, q.jsx)(j, { isLoading: z.isLoading, error: z.error, onRetry: () => void z.refetch(), skeleton: `detail` }),
    })
  let Y = z.data,
    Q = Y.editable === !1,
    $ = () => {
      ;(o.invalidateQueries({ queryKey: U(m) }), o.invalidateQueries({ queryKey: [`garages`, m, `customers`] }))
    }
  return (0, q.jsxs)(i, {
    children: [
      (0, q.jsx)(R, {
        breadcrumb: (0, q.jsx)(B, { items: [{ label: Y.customerName, to: `/customers/${Y.customerId}` }, { label: Y.licensePlate }] }),
        title: (0, q.jsx)(L, { className: `px-2.5 py-0.5 text-subheading`, children: Y.licensePlate ?? `` }),
        description: [Y.make, Y.model, Y.year].filter(Boolean).join(` `),
        action:
          (h || T) &&
          (0, q.jsxs)(`span`, {
            className: `inline-flex flex-wrap gap-2`,
            children: [
              h &&
                (0, q.jsxs)(s, {
                  variant: `outline`,
                  onClick: () => k(`edit`),
                  children: [(0, q.jsx)(f, { 'aria-hidden': !0 }), ` `, e(`common.edit`)],
                }),
              T &&
                (0, q.jsxs)(s, {
                  variant: `outline`,
                  onClick: () => k(`correct`),
                  children: [(0, q.jsx)(F, { 'aria-hidden': !0 }), ` `, e(`vehicles.correct.action`)],
                }),
              T &&
                (0, q.jsxs)(s, {
                  variant: `outline`,
                  onClick: () => k(`owner`),
                  children: [(0, q.jsx)(G, { 'aria-hidden': !0 }), ` `, e(`vehicles.owner.action`)],
                }),
            ],
          }),
      }),
      Q &&
        (0, q.jsx)(C, {
          tone: `info`,
          title: e(`vehicles.lockedTitle`),
          children: (0, q.jsxs)(`span`, {
            className: `inline-flex items-center gap-1.5`,
            children: [
              (0, q.jsx)(u, { className: `size-4`, 'aria-hidden': !0 }),
              e(T ? `vehicles.lockedCanCorrect` : `vehicles.lockedAskManager`),
            ],
          }),
        }),
      (0, q.jsxs)(r, {
        title: e(`vehicles.history`),
        children: [
          (0, q.jsx)(j, { isLoading: W.isLoading, error: W.error, onRetry: () => void W.refetch() }),
          W.data && W.data.length === 0 && (0, q.jsx)(a, { children: (0, q.jsx)(V, { message: e(`vehicles.historyEmpty`), compact: !0 }) }),
          W.data &&
            W.data.length > 0 &&
            (0, q.jsx)(a, {
              children: (0, q.jsxs)(v, {
                caption: e(`vehicles.history`),
                children: [
                  (0, q.jsx)(g, {
                    children: (0, q.jsxs)(`tr`, {
                      children: [
                        (0, q.jsx)(y, { children: e(`quotes.number`) }),
                        (0, q.jsx)(y, { children: e(`vehicles.historyType`) }),
                        (0, q.jsx)(y, { children: e(`common.status`) }),
                        (0, q.jsx)(y, { numeric: !0, children: e(`quotes.total`) }),
                        (0, q.jsx)(y, { children: e(`common.createdAt`) }),
                      ],
                    }),
                  }),
                  (0, q.jsx)(b, {
                    children: W.data.map((t) =>
                      (0, q.jsxs)(
                        x,
                        {
                          children: [
                            (0, q.jsx)(_, {
                              primary: !0,
                              label: e(`quotes.number`),
                              children: t.type
                                ? (0, q.jsx)(S, {
                                    to: `${Z[t.type]}/${t.entityId}`,
                                    className: `hover:text-primary-subtle-foreground hover:underline`,
                                    children: t.number,
                                  })
                                : t.number,
                            }),
                            (0, q.jsx)(_, {
                              label: e(`vehicles.historyType`),
                              children: e(`vehicles.historyTypes.${t.type ?? `VEHICLE_HISTORY_ENTRY_TYPE_QUOTE`}`),
                            }),
                            (0, q.jsx)(_, { label: e(`common.status`), children: (0, q.jsx)(M, { children: t.status }) }),
                            (0, q.jsx)(_, { numeric: !0, label: e(`quotes.total`), children: (0, q.jsx)(A, { text: I(t.totalAmount) }) }),
                            (0, q.jsx)(_, {
                              label: e(`common.createdAt`),
                              className: `num text-muted-foreground`,
                              children: N(t.occurredAt),
                            }),
                          ],
                        },
                        `${t.type}-${t.entityId}`,
                      ),
                    ),
                  }),
                ],
              }),
            }),
        ],
      }),
      O === `edit` &&
        (0, q.jsx)(d, {
          vehicle: Y,
          ownerName: Y.customerName ?? ``,
          onClose: () => k(null),
          onSave: async (n) => {
            ;(await H.update(m, t, n), $(), D.success(e(`common.saved`)), k(null))
          },
        }),
      O === `correct` &&
        (0, q.jsx)(X, {
          vehicle: Y,
          onClose: () => k(null),
          onSave: async (n) => {
            ;(await H.correct(m, t, n), $(), D.success(e(`vehicles.correct.done`)), k(null))
          },
        }),
      O === `owner` &&
        (0, q.jsx)(J, {
          garageId: m,
          vehicle: Y,
          onClose: () => k(null),
          onSave: async (n) => {
            ;(await H.changeOwner(m, t, n), $(), D.success(e(`vehicles.owner.done`)), k(null))
          },
        }),
    ],
  })
}
export { Q as VehicleDetailPage }
