import { At as e, Dt as t, Et as n, F as r, M as i, N as a, Ot as o, P as s, R as c, S as l, r as u, t as d } from './api-lC4u2sZi.js'
import { t as f } from './useMutation-YmV9sVwE.js'
import { t as p } from './ban-DfdGjpju.js'
import { t as m } from './StatusBadge-DknRod1K.js'
import { n as h, t as g } from './api-BOlXkYhw.js'
import { t as _ } from './pencil-DC9AcF2N.js'
import { t as v } from './plus-CTDUdFcD.js'
import { t as y } from './Choice-C8tAQzDN.js'
import { n as b, t as x } from './Modal-BAMT8Cnj.js'
import { a as S, i as C, n as w, o as T, r as E, s as ee } from './Table-dqUq80Ez.js'
import { t as te } from './Stats-Uw-xO1jC.js'
import {
  C as D,
  Ct as O,
  D as k,
  F as A,
  I as j,
  J as M,
  K as N,
  R as P,
  S as F,
  U as I,
  W as L,
  X as R,
  _ as ne,
  bt as z,
  f as B,
  j as V,
  y as H,
  z as U,
} from './index-CbGLOUZk.js'
import { t as re } from './PageHeader-HSPIRw-a.js'
import { t as ie } from './Crumbs-CL4a3zqe.js'
import { n as ae } from './api-yVqfsw1B.js'
import { n as W, r as G, t as K } from './taxProfilesApi-CFBO1Viz.js'
import { n as q, t as oe } from './BillToSummary-DYpHlS0o.js'
import { n as J, t as Y } from './api-BvpQE47F.js'
import { t as se } from './api-CAXop4Lo.js'
import { n as X, t as ce } from './status-B1g7KuSk.js'
var Z = e(o(), 1),
  Q = t()
function le({ garageId: e, settlement: t, customerId: n, onClose: r, onSave: i }) {
  let { t: a } = l(),
    [o, s] = (0, Z.useState)(t.billingParty?.taxProfileId ?? ``),
    [u, f] = (0, Z.useState)(!!t.invoiceRequested),
    [p, m] = (0, Z.useState)(null),
    [h, g] = (0, Z.useState)(!1),
    _ = O({ queryKey: [...G(e, n ?? ``), { includeInactive: !1 }], queryFn: () => W.list(e, n ?? ``), enabled: !!n }),
    v = o ? (_.data ?? []).find((e) => e.id === o) : void 0,
    S = o === t.billingParty?.taxProfileId ? t.billingParty : v,
    C = K(o ? S : void 0),
    w = async (e) => {
      ;(e.preventDefault(), g(!0), m(null))
      let n = { invoiceRequested: u }
      o !== void 0 && o !== (t.billingParty?.taxProfileId ?? ``) && (n.billingParty = { taxProfileId: o })
      try {
        await i(n)
      } catch (e) {
        ;(m(e), g(!1))
      }
    },
    T = p instanceof d && p.code === `INVOICE_DATA_INCOMPLETE`
  return (0, Q.jsx)(x, {
    title: a(`billing.settlementTitle`),
    description: a(`billing.settlementDescription`),
    error: p ? (T ? a(`billing.invoiceIncomplete`, { fields: C.map((e) => a(`billing.fields.${e}`)).join(`, `) }) : k(a, p)) : ``,
    onClose: r,
    children: (0, Q.jsxs)(`form`, {
      onSubmit: w,
      className: `flex flex-col gap-4`,
      children: [
        (0, Q.jsx)(q, { garageId: e, customerId: n, value: o, onChange: s }),
        (0, Q.jsx)(y, { checked: u, onChange: (e) => f(e.target.checked), label: a(`billing.invoiceRequested`) }),
        u &&
          C.length > 0 &&
          (0, Q.jsx)(`p`, {
            className: `text-caption text-warning-subtle-foreground`,
            children: a(`billing.invoiceIncomplete`, { fields: C.map((e) => a(`billing.fields.${e}`)).join(`, `) }),
          }),
        (0, Q.jsxs)(b, {
          children: [
            (0, Q.jsx)(c, { variant: `outline`, onClick: r, children: a(`common.cancel`) }),
            (0, Q.jsx)(c, { type: `submit`, variant: `primary`, loading: h, children: a(h ? `common.saving` : `common.save`) }),
          ],
        }),
      ],
    }),
  })
}
function $(e) {
  return Math.max(0, Number(e.totalAmount ?? 0) - Number(e.paidAmount ?? 0))
}
function ue({ settlement: e, onClose: t, onSave: n }) {
  let { t: r } = l(),
    [i, a] = (0, Z.useState)(``),
    [o, s] = (0, Z.useState)(`PAYMENT_METHOD_CASH`),
    [u, d] = (0, Z.useState)(``),
    [f, p] = (0, Z.useState)(``),
    [m, h] = (0, Z.useState)(``),
    [g, _] = (0, Z.useState)(``),
    [v, y] = (0, Z.useState)(null),
    [S, C] = (0, Z.useState)(!1),
    w = $(e)
  return (0, Q.jsx)(x, {
    title: r(`settlements.recordPayment`),
    description: r(`settlements.recordPaymentDescription`, { due: H(w) }),
    error: v ? k(r, v) : ``,
    onClose: t,
    children: (0, Q.jsxs)(`form`, {
      onSubmit: async (e) => {
        ;(e.preventDefault(), C(!0), y(null))
        try {
          await n({
            amount: i,
            method: o,
            note: u || void 0,
            payerName: f.trim() || void 0,
            payerAddress: m.trim() || void 0,
            reason: g.trim() || void 0,
          })
        } catch (e) {
          ;(y(e), C(!1))
        }
      },
      className: `flex flex-col gap-4`,
      children: [
        (0, Q.jsx)(M, {
          label: r(`settlements.amount`),
          required: !0,
          hint: r(`settlements.amountHint`, { due: H(w) }),
          children: (0, Q.jsx)(I, {
            type: `number`,
            required: !0,
            min: 1,
            max: w,
            step: 1,
            value: i,
            onChange: (e) => a(e.target.value),
            className: `num`,
          }),
        }),
        (0, Q.jsx)(M, {
          label: r(`settlements.method`),
          children: (0, Q.jsxs)(L, {
            value: o,
            onChange: (e) => s(e.target.value),
            children: [
              (0, Q.jsx)(`option`, { value: `PAYMENT_METHOD_CASH`, children: r(`settlements.methods.CASH`) }),
              (0, Q.jsx)(`option`, { value: `PAYMENT_METHOD_BANK_TRANSFER`, children: r(`settlements.methods.BANK_TRANSFER`) }),
              (0, Q.jsx)(`option`, { value: `PAYMENT_METHOD_ONLINE`, children: r(`settlements.methods.ONLINE`) }),
            ],
          }),
        }),
        (0, Q.jsx)(M, {
          label: r(`settlements.payerName`),
          hint: r(`settlements.payerNameHint`, { name: e.customerName ?? `` }),
          children: (0, Q.jsx)(I, { maxLength: 255, value: f, onChange: (e) => p(e.target.value) }),
        }),
        (0, Q.jsx)(M, {
          label: r(`settlements.payerAddress`),
          children: (0, Q.jsx)(I, { maxLength: 500, value: m, onChange: (e) => h(e.target.value) }),
        }),
        (0, Q.jsx)(M, {
          label: r(`settlements.reason`),
          hint: r(`settlements.reasonHint`, { number: e.number ?? `` }),
          children: (0, Q.jsx)(I, { maxLength: 500, value: g, onChange: (e) => _(e.target.value) }),
        }),
        (0, Q.jsx)(M, {
          label: r(`common.note`),
          children: (0, Q.jsx)(N, { rows: 2, maxLength: 500, value: u, onChange: (e) => d(e.target.value) }),
        }),
        (0, Q.jsxs)(b, {
          children: [
            (0, Q.jsx)(c, { variant: `outline`, onClick: t, children: r(`common.cancel`) }),
            (0, Q.jsx)(c, {
              type: `submit`,
              variant: `primary`,
              loading: S,
              disabled: w <= 0 || Number(i) <= 0 || Number(i) > w,
              children: r(S ? `common.saving` : `settlements.recordPayment`),
            }),
          ],
        }),
      ],
    }),
  })
}
function de({ voucherNumber: e, onClose: t, onVoid: n }) {
  let { t: r } = l(),
    [i, a] = (0, Z.useState)(``),
    [o, s] = (0, Z.useState)(null),
    [u, d] = (0, Z.useState)(!1)
  return (0, Q.jsx)(x, {
    title: r(`settlements.voidPayment`),
    description: r(`settlements.voidPaymentDescription`, { number: e }),
    error: o ? k(r, o) : ``,
    onClose: t,
    children: (0, Q.jsxs)(`form`, {
      onSubmit: async (e) => {
        ;(e.preventDefault(), d(!0), s(null))
        try {
          await n(i.trim())
        } catch (e) {
          ;(s(e), d(!1))
        }
      },
      className: `flex flex-col gap-4`,
      children: [
        (0, Q.jsx)(M, {
          label: r(`settlements.voidReason`),
          required: !0,
          children: (0, Q.jsx)(N, { rows: 3, required: !0, maxLength: 500, value: i, onChange: (e) => a(e.target.value) }),
        }),
        (0, Q.jsxs)(b, {
          children: [
            (0, Q.jsx)(c, { variant: `outline`, onClick: t, children: r(`common.cancel`) }),
            (0, Q.jsx)(c, {
              type: `submit`,
              variant: `destructive`,
              loading: u,
              disabled: i.trim() === ``,
              children: r(u ? `common.saving` : `settlements.voidPayment`),
            }),
          ],
        }),
      ],
    }),
  })
}
var fe = {
  PAYMENT_METHOD_CASH: `settlements.methods.CASH`,
  PAYMENT_METHOD_BANK_TRANSFER: `settlements.methods.BANK_TRANSFER`,
  PAYMENT_METHOD_ONLINE: `settlements.methods.ONLINE`,
}
function pe() {
  let { settlementId: e } = A(),
    t = n(),
    { activeGarage: r, isLoading: a, can: o } = B(),
    s = r?.id ?? ``,
    c = o(`PERMISSION_BILLING_WRITE`),
    l = O({ queryKey: [...J(s), e], queryFn: () => Y.get(s, e ?? ``), enabled: !!(s && e) })
  if (a) return null
  if (!s) return (0, Q.jsx)(V, { to: `/settlements`, replace: !0 })
  if (!l.data)
    return (0, Q.jsx)(i, {
      children: (0, Q.jsx)(F, { isLoading: l.isLoading, error: l.error, onRetry: () => void l.refetch(), skeleton: `detail` }),
    })
  let u = l.data
  return (0, Q.jsx)(me, {
    garageId: s,
    settlement: u,
    canWrite: c,
    onChanged: () => {
      ;(t.invalidateQueries({ queryKey: J(s) }), l.refetch())
    },
  })
}
function me({ garageId: e, settlement: t, canWrite: n, onChanged: o }) {
  let { t: d } = l(),
    [y, b] = (0, Z.useState)(!1),
    [x, A] = (0, Z.useState)(null),
    [M, N] = (0, Z.useState)(!1),
    [F, I] = (0, Z.useState)(u),
    L = f({ mutationFn: () => g.exportSettlementReceiptPdf(e, t.id ?? ``, `${t.number}.pdf`) }),
    B = f({
      mutationFn: (n) => Y.recordPayment(e, t.id ?? ``, n, F),
      onSuccess: () => {
        ;(o(), I(u()), b(!1), j.success(d(`settlements.paymentRecorded`)))
      },
    }),
    V = f({ mutationFn: (n) => g.exportPaymentVoucherPdf(e, t.id ?? ``, n.id ?? ``, `${n.voucherNumber ?? n.id}.pdf`) }),
    W = f({
      mutationFn: ({ payment: n, reason: r }) => Y.voidPayment(e, t.id ?? ``, n.id ?? ``, r),
      onSuccess: () => {
        ;(o(), A(null), j.success(d(`settlements.paymentVoided`)))
      },
    }),
    G = O({
      queryKey: [`garages`, e, `repair-orders`, t.repairOrderId],
      queryFn: () => se.get(e, t.repairOrderId ?? ``),
      enabled: M && !!t.repairOrderId,
    }),
    K = O({
      queryKey: [`garages`, e, `vehicles`, G.data?.vehicleId],
      queryFn: () => ae.get(e, G.data?.vehicleId ?? ``),
      enabled: !!G.data?.vehicleId,
    }),
    q = f({
      mutationFn: (n) => Y.updateBilling(e, t.id ?? ``, n),
      onSuccess: () => {
        ;(o(), N(!1), j.success(d(`common.saved`)))
      },
    }),
    J = Number(t.paidAmount ?? 0),
    $ = Number(t.totalAmount ?? 0)
  return (0, Q.jsxs)(i, {
    children: [
      (0, Q.jsx)(re, {
        breadcrumb: (0, Q.jsx)(ie, { items: [{ label: d(`settlements.title`), to: `/settlements` }, { label: t.number }] }),
        title: t.number ?? ``,
        meta: (0, Q.jsx)(m, { tone: X(t.status), label: d(ce(t.status)) }),
        description: (0, Q.jsxs)(`span`, {
          className: `inline-flex flex-wrap items-center gap-2`,
          children: [t.customerName, (0, Q.jsx)(U, { children: t.vehicleLicensePlate ?? `` })],
        }),
        action: (0, Q.jsxs)(c, {
          variant: `outline`,
          loading: L.isPending,
          onClick: () => L.mutate(),
          children: [(0, Q.jsx)(h, { 'aria-hidden': !0 }), ` `, d(`settlements.exportReceipt`)],
        }),
      }),
      L.error && (0, Q.jsx)(D, { tone: `error`, title: k(d, L.error) }),
      B.error && (0, Q.jsx)(D, { tone: `error`, title: k(d, B.error) }),
      V.error && (0, Q.jsx)(D, { tone: `error`, title: k(d, V.error) }),
      (0, Q.jsxs)(`div`, {
        className: `grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]`,
        children: [
          (0, Q.jsx)(`div`, {
            className: `flex flex-col gap-6`,
            children: (0, Q.jsxs)(a, {
              children: [
                (0, Q.jsx)(r, {
                  title: d(`settlements.payments`),
                  actions:
                    n &&
                    (0, Q.jsxs)(c, {
                      variant: `outline`,
                      size: `sm`,
                      onClick: () => b(!0),
                      children: [(0, Q.jsx)(v, { 'aria-hidden': !0 }), ` `, d(`settlements.recordPayment`)],
                    }),
                }),
                (t.payments ?? []).length === 0
                  ? (0, Q.jsx)(`p`, {
                      className: `px-5 py-8 text-center text-body text-muted-foreground`,
                      children: d(`settlements.noPayments`),
                    })
                  : (0, Q.jsxs)(w, {
                      caption: d(`settlements.payments`),
                      children: [
                        (0, Q.jsx)(S, {
                          children: (0, Q.jsxs)(`tr`, {
                            children: [
                              (0, Q.jsx)(T, { children: d(`common.createdAt`) }),
                              (0, Q.jsx)(T, { children: d(`settlements.voucherNumber`) }),
                              (0, Q.jsx)(T, { children: d(`settlements.method`) }),
                              (0, Q.jsx)(T, { numeric: !0, children: d(`settlements.amount`) }),
                              (0, Q.jsx)(T, { children: d(`settlements.payer`) }),
                              (0, Q.jsx)(T, { children: d(`settlements.collector`) }),
                              (0, Q.jsx)(T, { children: d(`common.note`) }),
                              (0, Q.jsx)(T, { children: (0, Q.jsx)(`span`, { className: `sr-only`, children: d(`common.actions`) }) }),
                            ],
                          }),
                        }),
                        (0, Q.jsx)(E, {
                          children: (t.payments ?? []).map((e) =>
                            (0, Q.jsxs)(
                              ee,
                              {
                                className: e.voided ? `text-muted-foreground` : void 0,
                                children: [
                                  (0, Q.jsx)(C, { primary: !0, label: d(`common.createdAt`), className: `num`, children: ne(e.createdAt) }),
                                  (0, Q.jsxs)(C, {
                                    label: d(`settlements.voucherNumber`),
                                    className: `num`,
                                    children: [
                                      e.voucherNumber || `—`,
                                      e.voided && (0, Q.jsx)(`span`, { className: `ml-2 text-caption`, children: d(`settlements.voided`) }),
                                    ],
                                  }),
                                  (0, Q.jsx)(C, { label: d(`settlements.method`), children: d(fe[e.method ?? `PAYMENT_METHOD_CASH`]) }),
                                  (0, Q.jsx)(C, {
                                    numeric: !0,
                                    label: d(`settlements.amount`),
                                    className: e.voided ? `line-through` : void 0,
                                    children: (0, Q.jsx)(P, { text: H(e.amount) }),
                                  }),
                                  (0, Q.jsxs)(C, {
                                    label: d(`settlements.payer`),
                                    children: [
                                      (0, Q.jsx)(`span`, { className: `block`, children: e.payerName || `—` }),
                                      e.payerAddress &&
                                        (0, Q.jsx)(`span`, {
                                          className: `block text-caption text-muted-foreground`,
                                          children: e.payerAddress,
                                        }),
                                      e.reason &&
                                        (0, Q.jsx)(`span`, { className: `block text-caption text-muted-foreground`, children: e.reason }),
                                    ],
                                  }),
                                  (0, Q.jsx)(C, { label: d(`settlements.collector`), children: e.collectorName || `—` }),
                                  (0, Q.jsx)(C, {
                                    label: d(`common.note`),
                                    className: `text-muted-foreground`,
                                    children: e.voided ? d(`settlements.voidedBecause`, { reason: e.voidReason ?? `` }) : e.note || `—`,
                                  }),
                                  (0, Q.jsx)(C, {
                                    label: d(`common.actions`),
                                    children: (0, Q.jsxs)(`span`, {
                                      className: `inline-flex gap-0.5`,
                                      children: [
                                        (0, Q.jsx)(R, {
                                          size: `icon-sm`,
                                          label: `${d(`settlements.exportVoucher`)}: ${e.voucherNumber ?? ``}`,
                                          icon: (0, Q.jsx)(z, { 'aria-hidden': !0 }),
                                          onClick: () => V.mutate(e),
                                        }),
                                        n &&
                                          !e.voided &&
                                          (0, Q.jsx)(R, {
                                            size: `icon-sm`,
                                            label: `${d(`settlements.voidPayment`)}: ${e.voucherNumber ?? ``}`,
                                            icon: (0, Q.jsx)(p, { 'aria-hidden': !0 }),
                                            onClick: () => A(e),
                                          }),
                                      ],
                                    }),
                                  }),
                                ],
                              },
                              e.id,
                            ),
                          ),
                        }),
                      ],
                    }),
              ],
            }),
          }),
          (0, Q.jsx)(`aside`, {
            children: (0, Q.jsx)(a, {
              children: (0, Q.jsxs)(s, {
                className: `flex flex-col gap-4`,
                children: [
                  (0, Q.jsxs)(`div`, {
                    children: [
                      (0, Q.jsx)(`p`, { className: `text-caption text-muted-foreground`, children: d(`settlements.total`) }),
                      (0, Q.jsx)(`p`, { className: `mt-1 text-display`, children: (0, Q.jsx)(P, { text: H(t.totalAmount) }) }),
                    ],
                  }),
                  (0, Q.jsxs)(`div`, {
                    children: [
                      (0, Q.jsxs)(`div`, {
                        className: `flex items-center justify-between`,
                        children: [
                          (0, Q.jsx)(`p`, { className: `text-caption text-muted-foreground`, children: d(`billing.billTo`) }),
                          n &&
                            (0, Q.jsx)(R, {
                              size: `icon-sm`,
                              label: d(`billing.change`),
                              icon: (0, Q.jsx)(_, { 'aria-hidden': !0 }),
                              onClick: () => N(!0),
                            }),
                        ],
                      }),
                      (0, Q.jsx)(`div`, { className: `mt-1 text-body`, children: (0, Q.jsx)(oe, { party: t.billingParty }) }),
                      (0, Q.jsx)(`p`, {
                        className: `mt-1.5 text-caption text-muted-foreground`,
                        children: d(t.invoiceRequested ? `billing.invoiceYes` : `billing.invoiceNo`),
                      }),
                    ],
                  }),
                  (0, Q.jsxs)(`div`, {
                    children: [
                      (0, Q.jsx)(te, { value: J, max: $, label: d(`settlements.payments`) }),
                      (0, Q.jsxs)(`p`, {
                        className: `mt-1.5 text-caption text-muted-foreground`,
                        children: [(0, Q.jsx)(P, { text: H(J) }), ` / `, (0, Q.jsx)(P, { text: H($) })],
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      y && (0, Q.jsx)(ue, { settlement: t, onClose: () => b(!1), onSave: (e) => B.mutateAsync(e) }),
      M &&
        (0, Q.jsx)(le, {
          garageId: e,
          settlement: t,
          customerId: K.data?.customerId,
          onClose: () => N(!1),
          onSave: (e) => q.mutateAsync(e),
        }),
      x &&
        (0, Q.jsx)(de, {
          voucherNumber: x.voucherNumber ?? ``,
          onClose: () => A(null),
          onVoid: (e) => W.mutateAsync({ payment: x, reason: e }),
        }),
    ],
  })
}
export { pe as SettlementDetailPage }
