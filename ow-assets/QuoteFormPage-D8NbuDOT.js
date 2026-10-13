import { At as e, Dt as t, Et as n, F as r, L as i, M as a, N as o, Ot as s, P as c, R as l, S as u, q as d } from './api-lC4u2sZi.js'
import { t as f } from './useMutation-YmV9sVwE.js'
import { t as p } from './StatusBadge-DknRod1K.js'
import { n as m, t as ee } from './api-BOlXkYhw.js'
import { t as te } from './plus-CTDUdFcD.js'
import { t as h } from './trash-DZQxI2eA.js'
import { t as ne } from './CustomerPicker-BBeIuV2B.js'
import { t as g } from './Segmented-v9dewsey.js'
import { a as _, i as v, n as y, o as b, r as x, s as S } from './Table-dqUq80Ez.js'
import {
  A as re,
  C,
  Ct as w,
  D as T,
  F as E,
  I as D,
  J as O,
  K as ie,
  P as k,
  R as A,
  S as j,
  U as M,
  W as N,
  X as P,
  f as F,
  j as I,
  y as L,
} from './index-CbGLOUZk.js'
import { t as ae } from './PageHeader-HSPIRw-a.js'
import { t as R } from './Crumbs-CL4a3zqe.js'
import { n as oe, t as se } from './api-yVqfsw1B.js'
import { t as ce } from './ConfirmDialog-2Cqs5W6F.js'
import { n as z, r as B } from './api-T2kamPX_.js'
import { t as le } from './SearchSelect-DQkPP5cW.js'
import { n as ue, t as de } from './BillToSummary-DYpHlS0o.js'
import { n as fe, t as pe } from './status-CqSMkbrS.js'
var me = d(`copy`, [
    [`rect`, { width: `14`, height: `14`, x: `8`, y: `8`, rx: `2`, ry: `2`, key: `17jyea` }],
    [`path`, { d: `M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`, key: `zix9uf` }],
  ]),
  V = e(s(), 1),
  H = t(),
  U = 0
function W() {
  return ((U += 1), { key: `new-${U}`, itemType: `QUOTE_ITEM_TYPE_LABOR`, description: ``, quantity: `1`, unitPrice: `0` })
}
function he(e) {
  return (e.lines ?? []).map((e) => ({
    key: e.id ?? W().key,
    itemType: e.itemType ?? `QUOTE_ITEM_TYPE_LABOR`,
    description: e.description ?? ``,
    quantity: e.quantity ?? `1`,
    unitPrice: e.unitPrice ?? `0`,
  }))
}
function G(e) {
  return e.reduce((e, t) => e + Number(t.quantity || 0) * Number(t.unitPrice || 0), 0)
}
function K() {
  let { t: e } = u(),
    { quoteId: t } = E(),
    r = k(),
    i = n(),
    { activeGarage: o, isLoading: s, can: c } = F(),
    l = o?.id ?? ``,
    d = c(`PERMISSION_QUOTE_WRITE`),
    f = w({ queryKey: [...B(l), t], queryFn: () => z.get(l, t ?? ``), enabled: !!(l && t) })
  if (s) return null
  if (!l) return (0, H.jsx)(I, { to: `/quotes`, replace: !0 })
  if (t && !f.data)
    return (0, H.jsx)(a, {
      children: (0, H.jsx)(j, { isLoading: f.isLoading, error: f.error, onRetry: () => void f.refetch(), skeleton: `detail` }),
    })
  let p = () => i.invalidateQueries({ queryKey: B(l) })
  return (0, H.jsx)(
    q,
    {
      garageId: l,
      quote: f.data ?? null,
      canWrite: d,
      onSaved: (n) => {
        ;(p(), D.success(e(`common.saved`)), t || r(`/quotes/${n.id}`, { replace: !0 }))
      },
      onChanged: p,
      onDeleted: () => {
        ;(p(), r(`/quotes`, { replace: !0 }))
      },
    },
    t ?? `new`,
  )
}
function q({ garageId: e, quote: t, canWrite: n, onSaved: r, onChanged: s, onDeleted: d }) {
  let { t: _ } = u(),
    v = !t || t.status === `QUOTE_STATUS_DRAFT`,
    [y, b] = (0, V.useState)(t?.customerId ? { id: t.customerId, fullName: t.customerName ?? `` } : null),
    [x, S] = (0, V.useState)(t?.vehicleId ? { id: t.vehicleId, label: t.vehicleLicensePlate ?? `` } : null),
    [w, E] = (0, V.useState)(t ? (t.billingParty?.taxProfileId ?? ``) : void 0),
    [k, j] = (0, V.useState)(!1),
    [M, N] = (0, V.useState)(t?.approvalMode ?? `QUOTE_APPROVAL_MODE_LINK`),
    [F, I] = (0, V.useState)(t?.notes ?? ``),
    [B, U] = (0, V.useState)(t ? he(t) : [W()]),
    [K, q] = (0, V.useState)(!1),
    [J, ve] = (0, V.useState)(null),
    Y = f({
      mutationFn: () => {
        let n = {
            customerId: y?.id ?? ``,
            vehicleId: x?.id ?? ``,
            approvalMode: M,
            notes: F,
            lines: B.map((e) => ({ itemType: e.itemType, description: e.description, quantity: e.quantity, unitPrice: e.unitPrice })),
          },
          r = w !== void 0 && (!t || k) ? { ...n, billingParty: { taxProfileId: w } } : n
        return t ? z.update(e, t.id ?? ``, r) : z.create(e, r)
      },
      onSuccess: r,
    }),
    X = f({
      mutationFn: () => z.send(e, t?.id ?? ``),
      onSuccess: (e) => {
        ;(s(), ve({ publicUrl: e.publicUrl, emailed: e.emailed }))
      },
    }),
    Z = f({ mutationFn: () => z.convert(e, t?.id ?? ``), onSuccess: s }),
    Q = f({ mutationFn: () => ee.exportQuotePdf(e, t?.id ?? ``, `${t?.number}.pdf`) }),
    ye = !!(y && x && B.length > 0 && B.every((e) => e.description.trim())),
    $ = [Y.error, X.error, Z.error, Q.error].filter(Boolean)
  return (0, H.jsxs)(a, {
    children: [
      (0, H.jsx)(ae, {
        breadcrumb: (0, H.jsx)(R, { items: [{ label: _(`quotes.title`), to: `/quotes` }, { label: t ? t.number : _(`quotes.new`) }] }),
        title: t ? (t.number ?? ``) : _(`quotes.new`),
        meta: t && (0, H.jsx)(p, { tone: fe(t.status), label: _(pe(t.status)) }),
        description: v ? _(`quotes.formDescription`) : void 0,
        action:
          t &&
          (0, H.jsxs)(l, {
            variant: `outline`,
            loading: Q.isPending,
            onClick: () => Q.mutate(),
            children: [(0, H.jsx)(m, { 'aria-hidden': !0 }), ` `, _(`quotes.exportPdf`)],
          }),
      }),
      $.length > 0 && (0, H.jsx)(C, { tone: `error`, title: T(_, $[0]) }),
      J &&
        (0, H.jsx)(C, {
          tone: J.emailed ? `success` : `warning`,
          title: J.emailed ? _(`quotes.emailedNotice`) : _(`quotes.notEmailedNotice`),
          children:
            J.publicUrl &&
            (0, H.jsxs)(`div`, {
              className: `mt-2 flex items-center gap-2`,
              children: [
                (0, H.jsx)(`code`, {
                  className: `min-w-0 flex-1 truncate rounded-sm bg-surface px-2 py-1 font-mono text-caption text-foreground`,
                  children: J.publicUrl,
                }),
                (0, H.jsx)(P, {
                  variant: `outline`,
                  size: `icon-sm`,
                  label: _(`quotes.copyLink`),
                  icon: (0, H.jsx)(me, { 'aria-hidden': !0 }),
                  onClick: () => {
                    ;(navigator.clipboard.writeText(J.publicUrl ?? ``), D.success(_(`quotes.linkCopied`)))
                  },
                }),
              ],
            }),
        }),
      (0, H.jsx)(o, {
        children: (0, H.jsxs)(c, {
          className: `grid gap-5 md:grid-cols-2`,
          children: [
            (0, H.jsx)(O, {
              label: _(`quotes.customer`),
              required: !0,
              children: (0, H.jsx)(ne, {
                garageId: e,
                disabled: !v || !n,
                canWrite: n,
                selected: y,
                onSelect: (e) => {
                  ;(b(e), e?.id !== y?.id && (S(null), E(void 0), j(!1)))
                },
              }),
            }),
            (0, H.jsx)(O, {
              label: _(`quotes.vehicle`),
              required: !0,
              children: (0, H.jsx)(le, {
                placeholder: _(`vehicles.searchPlaceholder`),
                disabled: !v || !n || !y,
                selected: x,
                onSelect: S,
                search: async (t) =>
                  y
                    ? (await oe.list(e, { customerId: y.id, query: t, page: 1, pageSize: 20 })).items.map((e) => ({
                        id: e.id ?? ``,
                        label: e.licensePlate ?? ``,
                        sublabel: se(e),
                      }))
                    : [],
              }),
            }),
            v && n
              ? (0, H.jsx)(ue, {
                  garageId: e,
                  customerId: y?.id,
                  value: w,
                  allowDefault: !t || w === void 0,
                  onChange: (e) => {
                    ;(E(e), j(!0))
                  },
                })
              : (0, H.jsx)(O, {
                  label: _(`billing.billTo`),
                  children: (0, H.jsx)(`div`, { className: `py-1.5`, children: (0, H.jsx)(de, { party: t?.billingParty }) }),
                }),
            (0, H.jsxs)(`div`, {
              className: `flex flex-col gap-1.5`,
              children: [
                (0, H.jsx)(`span`, { id: `approval-label`, className: `text-body font-medium`, children: _(`quotes.approvalMode.label`) }),
                (0, H.jsx)(g, {
                  label: _(`quotes.approvalMode.label`),
                  value: M,
                  onValueChange: N,
                  disabled: !v || !n,
                  options: [
                    { value: `QUOTE_APPROVAL_MODE_LINK`, label: _(`quotes.approvalMode.LINK`) },
                    { value: `QUOTE_APPROVAL_MODE_MANUAL`, label: _(`quotes.approvalMode.MANUAL`) },
                  ],
                }),
                (0, H.jsx)(`p`, {
                  className: `text-caption text-muted-foreground`,
                  children: _(`quotes.approvalMode.${M === `QUOTE_APPROVAL_MODE_MANUAL` ? `MANUAL` : `LINK`}Hint`),
                }),
              ],
            }),
            (0, H.jsx)(O, {
              label: _(`common.note`),
              className: `md:col-span-2`,
              children: (0, H.jsx)(ie, { rows: 2, maxLength: 2e3, disabled: !v || !n, value: F, onChange: (e) => I(e.target.value) }),
            }),
          ],
        }),
      }),
      (0, H.jsx)(_e, { lines: B, editable: v && n, onChange: U }),
      v &&
        n &&
        (0, H.jsxs)(i, {
          children: [
            (0, H.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, H.jsxs)(l, {
                  variant: `outline`,
                  onClick: () => U((e) => [...e, W()]),
                  children: [(0, H.jsx)(te, { 'aria-hidden': !0 }), ` `, _(`quotes.addLine`)],
                }),
                t &&
                  (0, H.jsxs)(l, {
                    variant: `ghost`,
                    className: `text-destructive-subtle-foreground`,
                    onClick: () => q(!0),
                    children: [(0, H.jsx)(h, { 'aria-hidden': !0 }), ` `, _(`common.delete`)],
                  }),
              ],
            }),
            (0, H.jsxs)(`div`, {
              className: `flex items-center gap-3`,
              children: [
                (0, H.jsx)(`span`, { className: `text-heading`, children: (0, H.jsx)(A, { text: L(G(B)) }) }),
                t &&
                  (0, H.jsx)(l, {
                    variant: `outline`,
                    loading: X.isPending,
                    onClick: () => X.mutate(),
                    children: X.isPending ? _(`common.saving`) : _(`quotes.send`),
                  }),
                (0, H.jsx)(l, {
                  variant: `primary`,
                  disabled: !ye,
                  loading: Y.isPending,
                  onClick: () => Y.mutate(),
                  children: Y.isPending ? _(`common.saving`) : _(`common.save`),
                }),
              ],
            }),
          ],
        }),
      !v &&
        t?.status !== `QUOTE_STATUS_SENT` &&
        (0, H.jsxs)(i, {
          children: [
            (0, H.jsx)(`span`, { className: `text-heading`, children: (0, H.jsx)(A, { text: L(t?.totalAmount) }) }),
            t?.status === `QUOTE_STATUS_APPROVED` &&
              n &&
              (0, H.jsx)(l, {
                variant: `primary`,
                loading: Z.isPending,
                onClick: () => Z.mutate(),
                children: Z.isPending ? _(`common.saving`) : _(`quotes.convert`),
              }),
          ],
        }),
      Z.data?.repairOrderId &&
        (0, H.jsx)(C, {
          tone: `success`,
          title: _(`quotes.convertedNotice`),
          action: (0, H.jsx)(l, {
            asChild: !0,
            variant: `outline`,
            size: `sm`,
            children: (0, H.jsx)(re, { to: `/repair-orders/${Z.data.repairOrderId}`, children: _(`quotes.viewRepairOrder`) }),
          }),
        }),
      t?.status === `QUOTE_STATUS_SENT` && n && (0, H.jsx)(ge, { garageId: e, quote: t, onDecided: s }),
      K &&
        t &&
        (0, H.jsx)(ce, {
          title: _(`common.delete`),
          description: _(`quotes.deleteConfirm`, { number: t.number }),
          confirmLabel: _(`common.delete`),
          danger: !0,
          onClose: () => q(!1),
          onConfirm: () => z.remove(e, t.id ?? ``),
          onDone: d,
        }),
    ],
  })
}
function ge({ garageId: e, quote: t, onDecided: n }) {
  let { t: i } = u(),
    [a, s] = (0, V.useState)(Object.fromEntries((t.lines ?? []).map((e) => [e.id ?? ``, !0]))),
    d = f({
      mutationFn: () =>
        z.recordDecision(
          e,
          t.id ?? ``,
          (t.lines ?? []).map((e) => ({ lineId: e.id ?? ``, approved: a[e.id ?? ``] ?? !1 })),
        ),
      onSuccess: () => {
        ;(n(), D.success(i(`common.saved`)))
      },
    })
  return (0, H.jsxs)(o, {
    children: [
      (0, H.jsx)(r, { title: i(`quotes.recordDecision`), description: i(`quotes.recordDecisionHint`) }),
      (0, H.jsxs)(c, {
        className: `flex flex-col gap-4`,
        children: [
          d.error && (0, H.jsx)(C, { tone: `error`, title: T(i, d.error) }),
          (0, H.jsx)(`ul`, {
            className: `divide-y divide-border`,
            children: (t.lines ?? []).map((e) =>
              (0, H.jsxs)(
                `li`,
                {
                  className: `flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-0`,
                  children: [
                    (0, H.jsx)(`span`, { className: `min-w-0 flex-1 text-body`, children: e.description }),
                    (0, H.jsx)(g, {
                      label: e.description ?? ``,
                      value: a[e.id ?? ``] === !1 ? `reject` : `approve`,
                      onValueChange: (t) => s((n) => ({ ...n, [e.id ?? ``]: t === `approve` })),
                      options: [
                        { value: `approve`, label: i(`quotes.approve`) },
                        { value: `reject`, label: i(`quotes.reject`) },
                      ],
                    }),
                  ],
                },
                e.id,
              ),
            ),
          }),
          (0, H.jsx)(`div`, {
            children: (0, H.jsx)(l, {
              variant: `primary`,
              loading: d.isPending,
              onClick: () => d.mutate(),
              children: d.isPending ? i(`common.saving`) : i(`quotes.saveDecision`),
            }),
          }),
        ],
      }),
    ],
  })
}
function _e({ lines: e, editable: t, onChange: n }) {
  let { t: r } = u(),
    i = (t, r) => n(e.map((e) => (e.key === t ? { ...e, ...r } : e))),
    a = (t) => n(e.filter((e) => e.key !== t))
  return (0, H.jsxs)(o, {
    children: [
      (0, H.jsxs)(y, {
        caption: r(`quotes.lineDescription`),
        children: [
          (0, H.jsx)(_, {
            children: (0, H.jsxs)(`tr`, {
              children: [
                (0, H.jsx)(b, { className: `w-36`, children: r(`quotes.itemType`) }),
                (0, H.jsx)(b, { children: r(`quotes.lineDescription`) }),
                (0, H.jsx)(b, { numeric: !0, className: `w-28`, children: r(`quotes.quantity`) }),
                (0, H.jsx)(b, { numeric: !0, className: `w-40`, children: r(`quotes.unitPrice`) }),
                (0, H.jsx)(b, { numeric: !0, children: r(`quotes.lineTotal`) }),
                t &&
                  (0, H.jsx)(b, {
                    className: `w-px`,
                    children: (0, H.jsx)(`span`, { className: `sr-only`, children: r(`common.actions`) }),
                  }),
              ],
            }),
          }),
          (0, H.jsx)(x, {
            children: e.map((n, o) =>
              (0, H.jsxs)(
                S,
                {
                  children: [
                    (0, H.jsx)(v, {
                      label: r(`quotes.itemType`),
                      className: t ? `py-2` : `text-muted-foreground`,
                      children: t
                        ? (0, H.jsxs)(N, {
                            'aria-label': `${r(`quotes.itemType`)} ${o + 1}`,
                            value: n.itemType,
                            onChange: (e) => i(n.key, { itemType: e.target.value }),
                            children: [
                              (0, H.jsx)(`option`, { value: `QUOTE_ITEM_TYPE_LABOR`, children: r(`quotes.labor`) }),
                              (0, H.jsx)(`option`, { value: `QUOTE_ITEM_TYPE_PART`, children: r(`quotes.part`) }),
                            ],
                          })
                        : r(n.itemType === `QUOTE_ITEM_TYPE_PART` ? `quotes.part` : `quotes.labor`),
                    }),
                    (0, H.jsx)(v, {
                      label: r(`quotes.lineDescription`),
                      primary: !t,
                      className: t ? `py-2` : void 0,
                      children: t
                        ? (0, H.jsx)(M, {
                            'aria-label': `${r(`quotes.lineDescription`)} ${o + 1}`,
                            value: n.description,
                            maxLength: 500,
                            onChange: (e) => i(n.key, { description: e.target.value }),
                          })
                        : n.description,
                    }),
                    (0, H.jsx)(v, {
                      numeric: !0,
                      label: r(`quotes.quantity`),
                      className: t ? `py-2` : void 0,
                      children: t
                        ? (0, H.jsx)(M, {
                            'aria-label': `${r(`quotes.quantity`)} ${o + 1}`,
                            type: `number`,
                            min: 0.01,
                            step: 0.01,
                            value: n.quantity,
                            onChange: (e) => i(n.key, { quantity: e.target.value }),
                            className: `num text-right`,
                          })
                        : n.quantity,
                    }),
                    (0, H.jsx)(v, {
                      numeric: !0,
                      label: r(`quotes.unitPrice`),
                      className: t ? `py-2` : void 0,
                      children: t
                        ? (0, H.jsx)(M, {
                            'aria-label': `${r(`quotes.unitPrice`)} ${o + 1}`,
                            type: `number`,
                            min: 0,
                            step: 1e3,
                            value: n.unitPrice,
                            onChange: (e) => i(n.key, { unitPrice: e.target.value }),
                            className: `num text-right`,
                          })
                        : (0, H.jsx)(A, { text: L(n.unitPrice) }),
                    }),
                    (0, H.jsx)(v, {
                      numeric: !0,
                      label: r(`quotes.lineTotal`),
                      children: (0, H.jsx)(A, { text: L(Number(n.quantity || 0) * Number(n.unitPrice || 0)) }),
                    }),
                    t &&
                      (0, H.jsx)(v, {
                        actions: !0,
                        children: (0, H.jsx)(P, {
                          size: `icon-sm`,
                          label: `${r(`common.delete`)} ${o + 1}`,
                          icon: (0, H.jsx)(h, { 'aria-hidden': !0 }),
                          disabled: e.length <= 1,
                          onClick: () => a(n.key),
                        }),
                      }),
                  ],
                },
                n.key,
              ),
            ),
          }),
        ],
      }),
      (0, H.jsxs)(`div`, {
        className: `flex items-center justify-between border-t border-border bg-surface-sunken px-4 py-3`,
        children: [
          (0, H.jsx)(`span`, { className: `text-body font-medium`, children: r(`quotes.total`) }),
          (0, H.jsx)(`span`, { className: `text-heading`, children: (0, H.jsx)(A, { text: L(G(e)) }) }),
        ],
      }),
    ],
  })
}
export { K as QuoteFormPage }
