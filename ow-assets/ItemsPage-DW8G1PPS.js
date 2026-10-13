import { At as e, Dt as t, Et as n, M as r, N as i, Ot as a, R as o, S as s, Y as c, q as l } from './api-lC4u2sZi.js'
import { t as u } from './useMutation-YmV9sVwE.js'
import { t as d } from './StatusBadge-DknRod1K.js'
import { n as f, t as p } from './api-BOlXkYhw.js'
import { t as ee } from './plus-CTDUdFcD.js'
import { a as m, i as h, r as g, t as _ } from './dist-ToKkLyYu.js'
import { a as v, i as y, n as b, o as x, r as S, s as C } from './Table-dqUq80Ez.js'
import {
  $ as w,
  C as T,
  D as E,
  G as te,
  I as D,
  Q as ne,
  R as re,
  S as O,
  V as ie,
  W as ae,
  X as k,
  Z as oe,
  _ as se,
  _t as ce,
  b as A,
  f as le,
  gt as ue,
  lt as de,
  ut as fe,
  y as pe,
} from './index-CbGLOUZk.js'
import { t as me } from './PageHeader-HSPIRw-a.js'
import { n as j } from './form-Bpp5E52a.js'
import { t as M } from './EmptyState-B6htI9zs.js'
import { t as N } from './FormModal-O5Cwhy1v.js'
import { t as he } from './RowActions-Ubkh3T0m.js'
import { n as P, t as F } from './usePagedQuery-l3G6ju52.js'
import { t as I } from './useDebouncedValue-BuAekAoL.js'
import { t as L } from './ConfirmDialog-2Cqs5W6F.js'
import { n as R, r as z, t as B } from './api-D2cT5u-u.js'
var V = l(`package-plus`, [
    [`path`, { d: `M12 22V12`, key: `d0xqtd` }],
    [`path`, { d: `M16 17h6`, key: `1ook5g` }],
    [`path`, { d: `M19 14v6`, key: `1ckrd5` }],
    [
      `path`,
      {
        d: `M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955`,
        key: `28k6lz`,
      },
    ],
    [`path`, { d: `M3.29 7 12 12l8.71-5`, key: `19ckod` }],
    [`path`, { d: `m7.5 4.27 8.997 5.148`, key: `9yrvtv` }],
  ]),
  H = l(`triangle-alert`, [
    [`path`, { d: `m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`, key: `wmoenq` }],
    [`path`, { d: `M12 9v4`, key: `juzpu7` }],
    [`path`, { d: `M12 17h.01`, key: `p32p05` }],
  ]),
  U = e(a(), 1),
  W = t(),
  ge = Object.defineProperty,
  G = (e, t) => ge(e, `name`, { value: t, configurable: !0 }),
  K = { Automatic: `automatic`, Manual: `manual` },
  q = `Tabs`,
  [_e, ve] = h(q, [w]),
  J = w(),
  [ye, Y] = _e(q),
  be = U.forwardRef(
    G(function (e, t) {
      let {
          __scopeTabs: n,
          value: r,
          onValueChange: i,
          defaultValue: a,
          orientation: o = `horizontal`,
          dir: s,
          activationMode: c = K.Automatic,
          ...l
        } = e,
        u = de(s),
        [d, f] = _({ prop: r, onChange: i, defaultProp: a ?? ``, caller: q })
      return (0, W.jsx)(ye, {
        scope: n,
        baseId: fe(),
        value: d,
        onValueChange: f,
        orientation: o,
        dir: u,
        activationMode: c,
        children: (0, W.jsx)(m.div, { dir: u, 'data-orientation': o, ...l, ref: t }),
      })
    }, `Tabs`),
  ),
  xe = `TabsList`,
  Se = U.forwardRef(
    G(function (e, t) {
      let { __scopeTabs: n, loop: r = !0, ...i } = e,
        a = Y(xe, n),
        o = J(n)
      return (0, W.jsx)(oe, {
        asChild: !0,
        ...o,
        orientation: a.orientation,
        dir: a.dir,
        loop: r,
        children: (0, W.jsx)(m.div, { role: `tablist`, 'aria-orientation': a.orientation, ...i, ref: t }),
      })
    }, `TabsList`),
  ),
  Ce = `TabsTrigger`,
  X = U.forwardRef(
    G(function (e, t) {
      let { __scopeTabs: n, value: r, disabled: i = !1, ...a } = e,
        o = Y(Ce, n),
        s = J(n),
        c = Z(o.baseId, r),
        l = Q(o.baseId, r),
        u = r === o.value
      return (0, W.jsx)(ne, {
        asChild: !0,
        ...s,
        focusable: !i,
        active: u,
        children: (0, W.jsx)(m.button, {
          type: `button`,
          role: `tab`,
          'aria-selected': u,
          'aria-controls': l,
          'data-state': u ? `active` : `inactive`,
          'data-disabled': i ? `` : void 0,
          disabled: i,
          id: c,
          ...a,
          ref: t,
          onMouseDown: g(e.onMouseDown, (e) => {
            !i && e.button === 0 && e.ctrlKey === !1 ? (e.currentTarget.focus(), o.onValueChange(r)) : e.preventDefault()
          }),
          onKeyDown: g(e.onKeyDown, (e) => {
            i || e.target !== e.currentTarget || ([` `, `Enter`].includes(e.key) && o.onValueChange(r))
          }),
          onFocus: g(e.onFocus, () => {
            let e = o.activationMode !== K.Manual
            !u && !i && e && o.onValueChange(r)
          }),
        }),
      })
    }, `TabsTrigger`),
  )
function Z(e, t) {
  return `${e}-trigger-${t}`
}
G(Z, `makeTriggerId`)
function Q(e, t) {
  return `${e}-content-${t}`
}
G(Q, `makeContentId`)
var we = be
function Te({ className: e, ...t }) {
  return (0, W.jsx)(Se, { className: c(`mb-4 flex gap-5 border-b border-border`, e), ...t })
}
function $({ className: e, ...t }) {
  return (0, W.jsx)(X, {
    className: c(
      `-mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-0.5 py-2.5 text-body font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground pointer-coarse:min-h-11`,
      e,
    ),
    ...t,
  })
}
function Ee({ item: e, onClose: t, onSave: n }) {
  let { t: r } = s()
  return (0, W.jsx)(N, {
    titleId: `item-form`,
    icon: (0, W.jsx)(ce, { size: 22 }),
    title: r(e ? `inventory.editTitle` : `inventory.createTitle`),
    fields: [
      { name: `sku`, label: r(`inventory.sku`), required: !0, maxLength: 50 },
      { name: `name`, label: r(`inventory.name`), required: !0, maxLength: 255 },
      { name: `unit`, label: r(`inventory.unit`), maxLength: 20, placeholder: r(`inventory.unitPlaceholder`) },
      {
        name: `reorderThreshold`,
        label: r(`inventory.reorderThreshold`),
        type: `number`,
        min: 0,
        hint: r(`inventory.reorderThresholdHint`),
      },
    ],
    values: e ? { sku: e.sku, name: e.name, unit: e.unit, reorderThreshold: e.reorderThreshold } : void 0,
    submitLabel: r(e ? `common.save` : `common.create`),
    onClose: t,
    onSave: (e) => n({ sku: j(e, `sku`), name: j(e, `name`), unit: j(e, `unit`), reorderThreshold: Number(j(e, `reorderThreshold`) || 0) }),
  })
}
function De({ item: e, onClose: t, onSave: n }) {
  let { t: r } = s()
  return (0, W.jsx)(N, {
    titleId: `stock-receipt-form`,
    icon: (0, W.jsx)(V, { size: 22 }),
    title: r(`inventory.receiptTitle`, { name: e.name }),
    description: r(`inventory.receiptDescription`, { onHand: e.quantityOnHand, unit: e.unit }),
    fields: [
      { name: `quantity`, label: r(`inventory.receiptQuantity`), type: `number`, required: !0, min: 0.01, step: 0.01 },
      { name: `unitCost`, label: r(`inventory.unitCost`), type: `number`, min: 0 },
    ],
    submitLabel: r(`inventory.receive`),
    onClose: t,
    onSave: (e) => n({ quantity: j(e, `quantity`), unitCost: j(e, `unitCost`) || void 0 }),
  })
}
function Oe() {
  let { t: e } = s(),
    { activeGarage: t, can: n } = le(),
    i = t?.id ?? ``,
    a = n(`PERMISSION_INVENTORY_WRITE`),
    [o, c] = (0, U.useState)(`items`)
  return i
    ? (0, W.jsxs)(r, {
        children: [
          (0, W.jsx)(me, { title: e(`inventory.title`), description: e(`inventory.description`) }),
          (0, W.jsx)(we, {
            value: o,
            onValueChange: (e) => c(e),
            children: (0, W.jsxs)(Te, {
              className: `mb-0`,
              children: [
                (0, W.jsx)($, { value: `items`, children: e(`inventory.tabStockOnHand`) }),
                (0, W.jsx)($, { value: `movements`, children: e(`inventory.tabMovements`) }),
              ],
            }),
          }),
          o === `items` ? (0, W.jsx)(ke, { garageId: i, canWrite: a }) : (0, W.jsx)(je, { garageId: i }),
        ],
      })
    : (0, W.jsx)(M, { message: e(`common.selectGarageFirst`) })
}
function ke({ garageId: e, canWrite: t }) {
  let { t: r } = s(),
    a = n(),
    [c, l] = (0, U.useState)(``),
    [u, d] = (0, U.useState)(null),
    [f, p] = (0, U.useState)(null),
    [m, h] = (0, U.useState)(null),
    g = I(c.trim()),
    _ = F([...R(e), { debounced: g }], (t) => B.list(e, { query: g, page: t }), !!e),
    w = () => void a.invalidateQueries({ queryKey: R(e) }),
    T =
      t &&
      (0, W.jsxs)(o, {
        variant: `primary`,
        onClick: () => d(`new`),
        children: [(0, W.jsx)(ee, { 'aria-hidden': !0 }), ` `, r(`inventory.new`)],
      }),
    E = _.data?.items.filter((e) => Number(e.quantityOnHand ?? 0) <= (e.reorderThreshold ?? 0)).length ?? 0
  return (0, W.jsxs)(W.Fragment, {
    children: [
      (0, W.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row`,
        children: [
          (0, W.jsx)(`div`, {
            className: `flex-1`,
            children: (0, W.jsx)(te, {
              icon: (0, W.jsx)(ue, {}),
              'aria-label': r(`common.search`),
              value: c,
              onChange: (e) => l(e.target.value),
              onClear: () => l(``),
              clearLabel: r(`ui.clear`),
              placeholder: r(`inventory.searchPlaceholder`),
            }),
          }),
          _.data?.items.length === 0 && !g ? null : T,
        ],
      }),
      (0, W.jsx)(O, { isLoading: _.isLoading, error: _.error, onRetry: () => void _.refetch() }),
      _.data &&
        _.data.items.length === 0 &&
        (0, W.jsx)(i, {
          children: g
            ? (0, W.jsx)(M, {
                kind: `search`,
                title: r(`ui.noResults`),
                message: r(`inventory.empty`),
                action: (0, W.jsx)(o, { variant: `outline`, onClick: () => l(``), children: r(`ui.clearFilters`) }),
                compact: !0,
              })
            : (0, W.jsx)(M, { message: r(`inventory.empty`), action: T }),
        }),
      _.data &&
        _.data.items.length > 0 &&
        (0, W.jsxs)(i, {
          children: [
            E > 0 &&
              (0, W.jsxs)(`p`, {
                className: `flex items-center gap-2 border-b border-border bg-warning-subtle px-4 py-2.5 text-body text-warning-subtle-foreground`,
                children: [(0, W.jsx)(H, { className: `size-4`, 'aria-hidden': !0 }), r(`dashboard.lowStockAlert`, { count: E })],
              }),
            (0, W.jsxs)(b, {
              caption: r(`inventory.title`),
              children: [
                (0, W.jsx)(v, {
                  children: (0, W.jsxs)(`tr`, {
                    children: [
                      (0, W.jsx)(x, { children: r(`inventory.sku`) }),
                      (0, W.jsx)(x, { children: r(`inventory.name`) }),
                      (0, W.jsx)(x, { numeric: !0, children: r(`inventory.onHand`) }),
                      (0, W.jsx)(x, { numeric: !0, children: r(`inventory.reorderThreshold`) }),
                      t &&
                        (0, W.jsx)(x, {
                          className: `w-px`,
                          children: (0, W.jsx)(`span`, { className: `sr-only`, children: r(`common.actions`) }),
                        }),
                    ],
                  }),
                }),
                (0, W.jsx)(S, {
                  children: _.data.items.map((e) => {
                    let n = Number(e.quantityOnHand ?? 0) <= (e.reorderThreshold ?? 0)
                    return (0, W.jsxs)(
                      C,
                      {
                        rail: n ? `warning` : void 0,
                        children: [
                          (0, W.jsx)(y, { primary: !0, label: r(`inventory.sku`), className: `font-mono text-caption`, children: e.sku }),
                          (0, W.jsx)(y, { label: r(`inventory.name`), children: e.name }),
                          (0, W.jsx)(y, {
                            numeric: !0,
                            label: r(`inventory.onHand`),
                            children: (0, W.jsxs)(`span`, {
                              className: `inline-flex items-center justify-end gap-2`,
                              children: [
                                n &&
                                  (0, W.jsx)(ie, {
                                    tone: `warning`,
                                    icon: (0, W.jsx)(H, { 'aria-hidden': !0 }),
                                    children: r(`inventory.lowStock`),
                                  }),
                                (0, W.jsxs)(`span`, {
                                  children: [
                                    A(e.quantityOnHand),
                                    ` `,
                                    (0, W.jsx)(`span`, { className: `text-muted-foreground`, children: e.unit }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          (0, W.jsx)(y, {
                            numeric: !0,
                            label: r(`inventory.reorderThreshold`),
                            className: `text-muted-foreground`,
                            children: e.reorderThreshold,
                          }),
                          t &&
                            (0, W.jsx)(y, {
                              actions: !0,
                              children: (0, W.jsxs)(`span`, {
                                className: `inline-flex gap-0.5`,
                                children: [
                                  (0, W.jsx)(k, {
                                    size: `icon-sm`,
                                    label: `${r(`inventory.receive`)}: ${e.sku}`,
                                    icon: (0, W.jsx)(V, { 'aria-hidden': !0 }),
                                    onClick: () => p(e),
                                  }),
                                  (0, W.jsx)(he, { subject: e.sku ?? ``, onEdit: () => d(e), onDelete: () => h(e) }),
                                ],
                              }),
                            }),
                        ],
                      },
                      e.id,
                    )
                  }),
                }),
              ],
            }),
            (0, W.jsx)(P, { page: _.page, pageSize: _.data.pageSize, total: _.data.total, onPageChange: _.setPage }),
          ],
        }),
      u &&
        (0, W.jsx)(Ee, {
          item: u === `new` ? null : u,
          onClose: () => d(null),
          onSave: async (t) => {
            ;(u === `new` ? await B.create(e, t) : await B.update(e, u.id ?? ``, t), w(), D.success(r(`common.saved`)), d(null))
          },
        }),
      f &&
        (0, W.jsx)(De, {
          item: f,
          onClose: () => p(null),
          onSave: async (t) => {
            ;(await B.receiveStock(e, f.id ?? ``, t), w(), a.invalidateQueries({ queryKey: z(e) }), D.success(r(`common.saved`)), p(null))
          },
        }),
      m &&
        (0, W.jsx)(L, {
          title: r(`common.delete`),
          description: r(`inventory.deleteConfirm`, { sku: m.sku }),
          confirmLabel: r(`common.delete`),
          danger: !0,
          onClose: () => h(null),
          onConfirm: () => B.remove(e, m.id ?? ``),
          onDone: w,
        }),
    ],
  })
}
var Ae = [``, `STOCK_TRANSACTION_TYPE_IN`, `STOCK_TRANSACTION_TYPE_OUT`]
function je({ garageId: e }) {
  let { t } = s(),
    [n, r] = (0, U.useState)(``),
    a = F([...z(e), { type: n }], (t) => B.listTransactions(e, { type: n || void 0, page: t }), !!e),
    c = u({ mutationFn: () => p.exportStockMovementsExcel(e, void 0, `stock-movements.xlsx`) })
  return (0, W.jsxs)(W.Fragment, {
    children: [
      (0, W.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row sm:justify-between`,
        children: [
          (0, W.jsx)(ae, {
            wrapperClassName: `sm:w-56`,
            value: n,
            onChange: (e) => r(e.target.value),
            'aria-label': t(`inventory.direction.label`),
            children: Ae.map((e) =>
              (0, W.jsx)(
                `option`,
                { value: e, children: e ? t(`inventory.direction.${e}`) : `${t(`inventory.direction.label`)}: ${t(`common.all`)}` },
                e || `all`,
              ),
            ),
          }),
          (0, W.jsxs)(o, {
            variant: `outline`,
            loading: c.isPending,
            onClick: () => c.mutate(),
            children: [(0, W.jsx)(f, { 'aria-hidden': !0 }), ` `, t(`inventory.exportExcel`)],
          }),
        ],
      }),
      c.error && (0, W.jsx)(T, { tone: `error`, title: E(t, c.error) }),
      (0, W.jsx)(O, { isLoading: a.isLoading, error: a.error, onRetry: () => void a.refetch() }),
      a.data &&
        a.data.items.length === 0 &&
        (0, W.jsx)(i, { children: (0, W.jsx)(M, { message: t(`inventory.movementsEmpty`), compact: !0 }) }),
      a.data &&
        a.data.items.length > 0 &&
        (0, W.jsxs)(i, {
          children: [
            (0, W.jsxs)(b, {
              caption: t(`inventory.tabMovements`),
              children: [
                (0, W.jsx)(v, {
                  children: (0, W.jsxs)(`tr`, {
                    children: [
                      (0, W.jsx)(x, { children: t(`inventory.sku`) }),
                      (0, W.jsx)(x, { children: t(`inventory.name`) }),
                      (0, W.jsx)(x, { children: t(`inventory.direction.label`) }),
                      (0, W.jsx)(x, { numeric: !0, children: t(`inventory.receiptQuantity`) }),
                      (0, W.jsx)(x, { children: t(`inventory.reference`) }),
                      (0, W.jsx)(x, { children: t(`common.createdAt`) }),
                    ],
                  }),
                }),
                (0, W.jsx)(S, {
                  children: a.data.items.map((e) =>
                    (0, W.jsxs)(
                      C,
                      {
                        children: [
                          (0, W.jsx)(y, {
                            primary: !0,
                            label: t(`inventory.sku`),
                            className: `font-mono text-caption`,
                            children: e.itemSku,
                          }),
                          (0, W.jsx)(y, { label: t(`inventory.name`), children: e.itemName }),
                          (0, W.jsx)(y, {
                            label: t(`inventory.direction.label`),
                            children: (0, W.jsx)(d, {
                              tone: e.type === `STOCK_TRANSACTION_TYPE_IN` ? `active` : `neutral`,
                              label: t(`inventory.direction.${e.type ?? `STOCK_TRANSACTION_TYPE_IN`}`),
                            }),
                          }),
                          (0, W.jsx)(y, { numeric: !0, label: t(`inventory.receiptQuantity`), children: A(e.quantity) }),
                          (0, W.jsx)(y, {
                            label: t(`inventory.reference`),
                            className: `text-muted-foreground`,
                            children:
                              e.refType === `STOCK_TRANSACTION_REF_TYPE_REPAIR_ORDER`
                                ? t(`inventory.refRepairOrder`)
                                : (0, W.jsx)(re, { text: pe(e.unitCost) }),
                          }),
                          (0, W.jsx)(y, {
                            label: t(`common.createdAt`),
                            className: `num text-muted-foreground`,
                            children: se(e.createdAt),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, W.jsx)(P, { page: a.page, pageSize: a.data.pageSize, total: a.data.total, onPageChange: a.setPage }),
          ],
        }),
    ],
  })
}
export { Oe as ItemsPage }
