import { A as e, At as t, Dt as n, Et as r, F as i, I as a, M as o, N as s, Ot as c, P as l, R as u, S as d } from './api-lC4u2sZi.js'
import { t as f } from './useMutation-YmV9sVwE.js'
import { t as p } from './StatusBadge-DknRod1K.js'
import { n as m, t as h } from './Modal-BAMT8Cnj.js'
import { t as g } from './Stats-Uw-xO1jC.js'
import {
  C as _,
  D as v,
  I as y,
  J as b,
  R as x,
  S,
  U as C,
  V as w,
  _ as T,
  a as E,
  b as D,
  c as O,
  i as k,
  l as A,
  n as j,
  o as M,
  r as N,
  s as P,
  t as F,
  v as I,
  xt as L,
  y as R,
} from './index-CbGLOUZk.js'
import { t as z } from './PageHeader-HSPIRw-a.js'
import { t as B } from './ConfirmDialog-2Cqs5W6F.js'
var V = t(c(), 1)
function H(e, t) {
  return e(`subscription.limits`, { garages: D(t?.maxGarages), staff: D(t?.maxStaff), transactions: D(t?.maxTransactionsPerDay) })
}
function U(e, t) {
  let n = []
  return ((t?.garages ?? 0) > (e?.maxGarages ?? 0) && n.push(`garages`), (t?.staff ?? 0) > (e?.maxStaff ?? 0) && n.push(`staff`), n)
}
var W = n()
function G({ balance: e }) {
  let { t } = d(),
    n = E().data ?? []
  return Number(e ?? 0) === 0 && n.length === 0
    ? null
    : (0, W.jsxs)(s, {
        children: [
          (0, W.jsx)(i, { title: t(`subscription.credit.title`) }),
          (0, W.jsxs)(l, {
            className: `flex flex-col gap-4`,
            children: [
              (0, W.jsxs)(`p`, {
                className: `text-body`,
                children: [
                  t(`subscription.credit.balance`),
                  ` `,
                  (0, W.jsx)(`strong`, { className: `text-heading`, children: (0, W.jsx)(x, { text: R(e) }) }),
                ],
              }),
              (0, W.jsx)(`p`, { className: `text-caption text-muted-foreground`, children: t(`subscription.credit.hint`) }),
              n.length > 0 &&
                (0, W.jsx)(`ul`, {
                  className: `divide-y divide-border`,
                  children: n.map((e, n) =>
                    (0, W.jsxs)(
                      `li`,
                      {
                        className: `flex flex-wrap items-baseline justify-between gap-2 py-2 text-body`,
                        children: [
                          (0, W.jsxs)(`span`, {
                            children: [
                              t(`subscription.credit.kind.${e.kind ?? `CREDIT_ENTRY_KIND_UNSPECIFIED`}`),
                              e.note ? ` · ${e.note}` : ``,
                            ],
                          }),
                          (0, W.jsxs)(`span`, {
                            className: `num text-muted-foreground`,
                            children: [
                              I(e.createdAt),
                              ` · `,
                              (0, W.jsx)(x, { text: R(e.amount) }),
                              ` →`,
                              ` `,
                              (0, W.jsx)(x, { text: R(e.balanceAfter) }),
                            ],
                          }),
                        ],
                      },
                      `${e.createdAt}-${n}`,
                    ),
                  ),
                }),
            ],
          }),
        ],
      })
}
function K({ value: e, label: t }) {
  let { t: n } = d(),
    [r, i] = (0, V.useState)(!1),
    a = async () => {
      try {
        ;(await navigator.clipboard.writeText(e), i(!0), setTimeout(() => i(!1), 1500))
      } catch {
        i(!1)
      }
    }
  return (0, W.jsx)(u, {
    variant: `ghost`,
    size: `sm`,
    'aria-label': `${n(`common.copy`)} ${t}`,
    onClick: () => void a(),
    children: n(r ? `common.copied` : `common.copy`),
  })
}
var q = [`image/png`, `image/jpeg`, `image/webp`, `application/pdf`]
function J(e) {
  return q.includes(e.type) ? (e.size > 5242880 || e.size === 0 ? `size` : null) : `type`
}
function Y(e) {
  return new Promise((t, n) => {
    let r = new FileReader()
    ;((r.onerror = () => n(r.error)),
      (r.onload = () => {
        let e = String(r.result)
        t(e.slice(e.indexOf(`,`) + 1))
      }),
      r.readAsDataURL(e))
  })
}
function X({ request: e, onClose: t, onSave: n }) {
  let { t: r } = d(),
    i = Number(e.amountDue ?? 0),
    [a, o] = (0, V.useState)(``),
    [s, c] = (0, V.useState)(``),
    [l, f] = (0, V.useState)(``),
    [p, g] = (0, V.useState)(String(i)),
    [_, y] = (0, V.useState)(``),
    [x, S] = (0, V.useState)(() => new Date().toISOString().slice(0, 10)),
    [w, T] = (0, V.useState)(null),
    [E, D] = (0, V.useState)(``),
    [O, k] = (0, V.useState)(null),
    [A, j] = (0, V.useState)(!1),
    M = (e) => {
      if ((T(null), D(``), !e)) return
      let t = J(e)
      if (t) {
        D(r(`subscription.payment.evidenceProblem.${t}`))
        return
      }
      T(e)
    },
    N = i > 0,
    P = N && !w
  return (0, W.jsx)(h, {
    title: r(`subscription.payment.declareTitle`),
    description: r(`subscription.payment.declareDescription`, { amount: R(e.amountDue), reference: e.reference ?? `` }),
    error: O ? v(r, O) : ``,
    onClose: t,
    children: (0, W.jsxs)(`form`, {
      onSubmit: async (e) => {
        if ((e.preventDefault(), P)) {
          D(r(`subscription.payment.evidenceRequired`))
          return
        }
        ;(j(!0), k(null))
        try {
          await n({
            payerName: a.trim(),
            payerBank: s.trim() || void 0,
            payerAccount: l.trim() || void 0,
            transferredAmount: p,
            bankTransactionRef: _.trim() || void 0,
            paidAt: x ? new Date(`${x}T00:00:00`).toISOString() : void 0,
            evidence: w ? { content: await Y(w), contentType: w.type } : void 0,
          })
        } catch (e) {
          ;(k(e), j(!1))
        }
      },
      className: `flex flex-col gap-4`,
      children: [
        (0, W.jsx)(b, {
          label: r(`subscription.payment.payerName`),
          required: !0,
          children: (0, W.jsx)(C, { required: !0, maxLength: 255, value: a, onChange: (e) => o(e.target.value) }),
        }),
        (0, W.jsxs)(`div`, {
          className: `grid gap-4 sm:grid-cols-2`,
          children: [
            (0, W.jsx)(b, {
              label: r(`subscription.payment.payerBank`),
              children: (0, W.jsx)(C, { maxLength: 255, value: s, onChange: (e) => c(e.target.value) }),
            }),
            (0, W.jsx)(b, {
              label: r(`subscription.payment.payerAccount`),
              children: (0, W.jsx)(C, { maxLength: 64, value: l, onChange: (e) => f(e.target.value), className: `num` }),
            }),
          ],
        }),
        (0, W.jsxs)(`div`, {
          className: `grid gap-4 sm:grid-cols-2`,
          children: [
            (0, W.jsx)(b, {
              label: r(`subscription.payment.transferredAmount`),
              required: !0,
              hint: r(`subscription.payment.transferredHint`),
              children: (0, W.jsx)(C, {
                type: `number`,
                required: !0,
                min: 0,
                step: 1,
                value: p,
                onChange: (e) => g(e.target.value),
                className: `num`,
              }),
            }),
            (0, W.jsx)(b, {
              label: r(`subscription.payment.paidAt`),
              children: (0, W.jsx)(C, { type: `date`, value: x, onChange: (e) => S(e.target.value) }),
            }),
          ],
        }),
        (0, W.jsx)(b, {
          label: r(`subscription.payment.bankRef`),
          hint: r(`subscription.payment.bankRefHint`),
          children: (0, W.jsx)(C, { maxLength: 100, value: _, onChange: (e) => y(e.target.value), className: `num` }),
        }),
        (0, W.jsx)(b, {
          label: r(`subscription.payment.evidence`),
          required: N,
          hint: r(N ? `subscription.payment.evidenceHint` : `subscription.payment.noEvidenceNeeded`),
          error: E || void 0,
          children: (0, W.jsx)(C, {
            type: `file`,
            accept: `image/png,image/jpeg,image/webp,application/pdf`,
            onChange: (e) => M(e.target.files?.[0] ?? null),
          }),
        }),
        (0, W.jsxs)(m, {
          children: [
            (0, W.jsx)(u, { variant: `outline`, onClick: t, children: r(`common.cancel`) }),
            (0, W.jsx)(u, {
              type: `submit`,
              variant: `primary`,
              loading: A,
              disabled: a.trim() === `` || p === ``,
              children: r(A ? `common.saving` : `subscription.payment.declare`),
            }),
          ],
        }),
      ],
    }),
  })
}
var Z = {
  PLAN_PAYMENT_STATUS_AWAITING_PAYMENT: `pending`,
  PLAN_PAYMENT_STATUS_SUBMITTED: `info`,
  PLAN_PAYMENT_STATUS_APPROVED: `active`,
  PLAN_PAYMENT_STATUS_REJECTED: `danger`,
  PLAN_PAYMENT_STATUS_CANCELLED: `neutral`,
}
function Q({ request: t }) {
  let { t: n } = d(),
    a = r(),
    [o, c] = (0, V.useState)(!1),
    [m, h] = (0, V.useState)(!1),
    g = () => {
      ;(a.invalidateQueries({ queryKey: k }), a.invalidateQueries({ queryKey: N }), a.invalidateQueries({ queryKey: j }))
    },
    v = f({
      mutationFn: (e) => A.declarePayment(t.id ?? ``, e),
      onSuccess: () => {
        ;(g(), c(!1))
      },
    }),
    y = t.status ?? `PLAN_PAYMENT_STATUS_UNSPECIFIED`,
    b = y === `PLAN_PAYMENT_STATUS_AWAITING_PAYMENT`,
    S = y === `PLAN_PAYMENT_STATUS_SUBMITTED`,
    C = t.instructions,
    w = Number(t.amountDue ?? 0),
    E = Number(t.creditSurplus ?? 0)
  return (0, W.jsxs)(s, {
    children: [
      (0, W.jsx)(i, {
        title: n(`subscription.payment.title`, { name: t.plan?.name ?? `` }),
        actions: (0, W.jsx)(p, { tone: Z[y] ?? `neutral`, label: n(`subscription.payment.status.${y}`) }),
      }),
      (0, W.jsxs)(l, {
        className: `flex flex-col gap-5`,
        children: [
          S &&
            (0, W.jsx)(_, { tone: `info`, title: n(`subscription.payment.waitingTitle`), children: n(`subscription.payment.waitingBody`) }),
          y === `PLAN_PAYMENT_STATUS_REJECTED` &&
            (0, W.jsx)(_, { tone: `error`, title: n(`subscription.payment.rejectedTitle`), children: t.rejectionReason }),
          (0, W.jsx)(e, {
            items: [
              { label: n(`subscription.payment.planPrice`), value: (0, W.jsx)(x, { text: R(t.quotedAmount) }) },
              { label: n(`subscription.payment.creditApplied`), value: (0, W.jsx)(x, { text: `− ${R(t.creditApplied)}` }) },
              {
                label: n(`subscription.payment.amountDue`),
                value: (0, W.jsxs)(`span`, {
                  className: `flex items-center gap-2`,
                  children: [
                    (0, W.jsx)(`strong`, { className: `text-heading`, children: (0, W.jsx)(x, { text: R(t.amountDue) }) }),
                    b && w > 0 && (0, W.jsx)(K, { value: String(w), label: n(`subscription.payment.amountDue`) }),
                  ],
                }),
              },
              ...(E > 0 ? [{ label: n(`subscription.payment.creditSurplus`), value: (0, W.jsx)(x, { text: R(t.creditSurplus) }) }] : []),
              {
                label: n(`subscription.payment.unusedDays`),
                value: n(`subscription.payment.unusedOf`, { unused: t.unusedDays ?? 0, total: t.periodDays ?? 0 }),
              },
            ],
          }),
          b &&
            (0, W.jsxs)(`div`, {
              className: `grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto]`,
              children: [
                (0, W.jsxs)(`div`, {
                  className: `flex flex-col gap-3`,
                  children: [
                    (0, W.jsx)(`p`, {
                      className: `text-body`,
                      children: n(w > 0 ? `subscription.payment.howToPay` : `subscription.payment.coveredByCredit`),
                    }),
                    w > 0 &&
                      C &&
                      (0, W.jsx)(e, {
                        items: [
                          { label: n(`subscription.payment.bank`), value: C.bankName },
                          {
                            label: n(`subscription.payment.account`),
                            value: (0, W.jsxs)(`span`, {
                              className: `flex items-center gap-2`,
                              children: [
                                (0, W.jsx)(`span`, { className: `num`, children: C.accountNumber }),
                                (0, W.jsx)(K, { value: C.accountNumber ?? ``, label: n(`subscription.payment.account`) }),
                              ],
                            }),
                          },
                          { label: n(`subscription.payment.holder`), value: C.accountHolder },
                          ...(C.branch ? [{ label: n(`subscription.payment.branch`), value: C.branch }] : []),
                          {
                            label: n(`subscription.payment.reference`),
                            value: (0, W.jsxs)(`span`, {
                              className: `flex items-center gap-2`,
                              children: [
                                (0, W.jsx)(`strong`, { className: `num`, children: t.reference }),
                                (0, W.jsx)(K, { value: t.reference ?? ``, label: n(`subscription.payment.reference`) }),
                              ],
                            }),
                          },
                        ],
                      }),
                    w > 0 &&
                      (0, W.jsx)(`p`, {
                        className: `text-caption text-muted-foreground`,
                        children: n(`subscription.payment.referenceHint`),
                      }),
                    w > 0 &&
                      C?.transferInstructions &&
                      (0, W.jsx)(`p`, { className: `rounded-md bg-muted px-3 py-2 text-body`, children: C.transferInstructions }),
                  ],
                }),
                w > 0 &&
                  C?.qrUrl &&
                  (0, W.jsxs)(`figure`, {
                    className: `flex flex-col items-center gap-2`,
                    children: [
                      (0, W.jsx)(`img`, {
                        src: C.qrUrl,
                        alt: n(`subscription.payment.qrAlt`),
                        className: `size-44 rounded-md border border-border bg-white p-2`,
                      }),
                      (0, W.jsx)(`figcaption`, {
                        className: `text-caption text-muted-foreground`,
                        children: n(`subscription.payment.qrCaption`),
                      }),
                    ],
                  }),
              ],
            }),
          S &&
            (0, W.jsx)(e, {
              items: [
                { label: n(`subscription.payment.payerName`), value: t.payerName },
                { label: n(`subscription.payment.transferredAmount`), value: (0, W.jsx)(x, { text: R(t.transferredAmount) }) },
                { label: n(`subscription.payment.bankRef`), value: t.bankTransactionRef || `—` },
                { label: n(`subscription.payment.paidAt`), value: T(t.paidAt) },
                { label: n(`subscription.payment.submittedAt`), value: T(t.submittedAt) },
              ],
            }),
          S &&
            t.amountMismatch &&
            (0, W.jsx)(_, {
              tone: `warning`,
              title: n(`subscription.payment.mismatchTitle`),
              children: n(`subscription.payment.mismatchBody`, { amount: R(t.amountDue) }),
            }),
          (0, W.jsxs)(`div`, {
            className: `flex flex-wrap gap-2`,
            children: [
              b && (0, W.jsx)(u, { variant: `primary`, onClick: () => c(!0), children: n(`subscription.payment.declareAction`) }),
              (b || S) && (0, W.jsx)(u, { variant: `outline`, onClick: () => h(!0), children: n(`subscription.payment.cancel`) }),
            ],
          }),
        ],
      }),
      o && (0, W.jsx)(X, { request: t, onClose: () => c(!1), onSave: (e) => v.mutateAsync(e) }),
      m &&
        (0, W.jsx)(B, {
          title: n(`subscription.payment.cancelTitle`),
          description: n(`subscription.payment.cancelBody`),
          confirmLabel: n(`subscription.payment.cancel`),
          danger: !0,
          onClose: () => h(!1),
          onConfirm: () => A.cancelPayment(t.id ?? ``),
          onDone: g,
        }),
    ],
  })
}
var $ = {
  SUBSCRIPTION_STATUS_TRIAL: `info`,
  SUBSCRIPTION_STATUS_ACTIVE: `active`,
  SUBSCRIPTION_STATUS_PAST_DUE: `pending`,
  SUBSCRIPTION_STATUS_SUSPENDED: `danger`,
  SUBSCRIPTION_STATUS_CANCELLED: `danger`,
}
function ee() {
  let { t } = d(),
    n = r(),
    c = P(),
    m = O(),
    [h, g] = (0, V.useState)(null),
    v = M(),
    b = f({
      mutationFn: (e) => A.startPayment(e.id ?? ``, e.id === c.data?.plan?.id ? `PLAN_PAYMENT_KIND_RENEW` : `PLAN_PAYMENT_KIND_CHANGE`),
      onSuccess: (e, r) => {
        ;(n.invalidateQueries({ queryKey: k }),
          n.invalidateQueries({ queryKey: N }),
          n.invalidateQueries({ queryKey: j }),
          y.success(t(`subscription.quoted`, { name: r.name })))
      },
    }),
    C = c.data,
    E = C ? F(C) : null,
    D = C?.openRequest,
    I = D?.status === `PLAN_PAYMENT_STATUS_SUBMITTED`,
    K = D ? void 0 : v.data?.find((e) => e.status === `PLAN_PAYMENT_STATUS_REJECTED` || e.status === `PLAN_PAYMENT_STATUS_APPROVED`),
    q = h ? U(h.limits, C?.usage) : []
  return (0, W.jsxs)(o, {
    children: [
      (0, W.jsx)(z, { title: t(`subscription.title`), description: t(`subscription.description`) }),
      (0, W.jsx)(S, { isLoading: c.isLoading, error: c.error, onRetry: () => void c.refetch(), skeleton: `detail` }),
      E &&
        (0, W.jsx)(_, {
          tone: E.tone,
          title: t(`license.notice.${E.key}.title`, E.params),
          children: t(`license.notice.${E.key}.owner`, E.params),
        }),
      D && (0, W.jsx)(Q, { request: D }),
      K &&
        (0, W.jsx)(_, {
          tone: K.status === `PLAN_PAYMENT_STATUS_APPROVED` ? `success` : `error`,
          title: t(`subscription.payment.decided.${K.status}`, { name: K.plan?.name ?? `` }),
          children: K.status === `PLAN_PAYMENT_STATUS_REJECTED` ? K.rejectionReason : T(K.reviewedAt),
        }),
      C &&
        (0, W.jsxs)(s, {
          children: [
            (0, W.jsx)(i, { title: t(`subscription.plan`) }),
            (0, W.jsxs)(l, {
              className: `grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`,
              children: [
                (0, W.jsxs)(`div`, {
                  className: `flex flex-col gap-4`,
                  children: [
                    (0, W.jsxs)(`div`, {
                      className: `flex flex-wrap items-center gap-3`,
                      children: [
                        (0, W.jsx)(`span`, { className: `text-title`, children: C.plan?.name }),
                        (0, W.jsx)(p, {
                          tone: $[C.status ?? ``] ?? `neutral`,
                          label: t(`subscription.status.${C.status ?? `SUBSCRIPTION_STATUS_UNSPECIFIED`}`),
                        }),
                      ],
                    }),
                    (0, W.jsx)(e, {
                      items: [
                        {
                          label: C.status === `SUBSCRIPTION_STATUS_TRIAL` ? t(`subscription.trialEnd`) : t(`subscription.periodEnd`),
                          value: (0, W.jsx)(`span`, { className: `num`, children: T(C.currentPeriodEnd) }),
                        },
                        ...(C.gracePeriodEnd
                          ? [
                              {
                                label: t(`subscription.graceEnd`),
                                value: (0, W.jsx)(`span`, { className: `num`, children: T(C.gracePeriodEnd) }),
                              },
                            ]
                          : []),
                      ],
                    }),
                  ],
                }),
                (0, W.jsx)(te, { limits: C.plan?.limits, usage: C.usage }),
              ],
            }),
          ],
        }),
      C && (0, W.jsx)(G, { balance: C.creditBalance }),
      (0, W.jsxs)(a, {
        title: t(`subscription.choosePlan`),
        description: t(`subscription.manualPayment`),
        children: [
          (0, W.jsx)(S, { isLoading: m.isLoading, error: m.error, skeleton: `none` }),
          (0, W.jsx)(`div`, {
            className: `grid gap-4 md:grid-cols-2 xl:grid-cols-3`,
            children: m.data
              ?.filter((e) => e.code !== `trial`)
              .map((e) => {
                let n = e.id === C?.plan?.id
                return (0, W.jsxs)(
                  `article`,
                  {
                    className: `flex flex-col gap-4 rounded-lg border bg-surface p-5 ${n ? `border-2 border-primary` : `border-border`}`,
                    children: [
                      (0, W.jsxs)(`div`, {
                        className: `flex items-center justify-between gap-2`,
                        children: [
                          (0, W.jsx)(`h3`, { className: `text-heading`, children: e.name }),
                          n && (0, W.jsx)(w, { tone: `info`, children: t(`common.active`) }),
                        ],
                      }),
                      (0, W.jsxs)(`p`, {
                        className: `flex items-baseline gap-1`,
                        children: [
                          (0, W.jsx)(`span`, { className: `text-display`, children: (0, W.jsx)(x, { text: R(e.price, e.currency) }) }),
                          (0, W.jsx)(`span`, {
                            className: `text-body text-muted-foreground`,
                            children: e.billingCycle === `BILLING_CYCLE_YEARLY` ? t(`subscription.perYear`) : t(`subscription.perMonth`),
                          }),
                        ],
                      }),
                      e.description && (0, W.jsx)(`p`, { className: `text-body text-muted-foreground`, children: e.description }),
                      (0, W.jsx)(`p`, { className: `rounded-md bg-muted px-3 py-2 text-body`, children: H(t, e.limits) }),
                      (0, W.jsx)(`ul`, {
                        className: `flex flex-1 flex-col gap-2`,
                        children: e.features?.map((e) =>
                          (0, W.jsxs)(
                            `li`,
                            {
                              className: `flex items-center gap-2 text-body`,
                              children: [
                                (0, W.jsx)(L, { className: `size-4 shrink-0 text-success-subtle-foreground`, 'aria-hidden': !0 }),
                                ` `,
                                t(`subscription.features.${e}`),
                              ],
                            },
                            e,
                          ),
                        ),
                      }),
                      (0, W.jsx)(u, {
                        variant: n ? `outline` : `primary`,
                        disabled: I,
                        title: I ? t(`subscription.waitingForReview`) : void 0,
                        onClick: () => g(e),
                        children: t(n ? `subscription.renew` : `subscription.choose`),
                      }),
                    ],
                  },
                  e.id,
                )
              }),
          }),
        ],
      }),
      h &&
        q.length > 0 &&
        (0, W.jsx)(B, {
          title: t(`subscription.overLimitTitle`, { name: h.name }),
          description: t(`subscription.overLimitBody`, {
            limits: q.map((e) => t(`subscription.${e}`)).join(`, `),
            allowed: H(t, h.limits),
          }),
          confirmLabel: t(`common.close`),
          onClose: () => g(null),
          onConfirm: () => Promise.resolve(),
        }),
      h &&
        q.length === 0 &&
        (0, W.jsx)(B, {
          title: t(`subscription.confirmTitle`, { name: h.name }),
          description: t(D ? `subscription.confirmReplaceBody` : `subscription.confirmBody`, {
            price: R(h.price, h.currency),
            limits: H(t, h.limits),
          }),
          confirmLabel: t(`subscription.getQuote`),
          onClose: () => g(null),
          onConfirm: () => b.mutateAsync(h),
        }),
    ],
  })
}
function te({ limits: e, usage: t }) {
  let { t: n } = d(),
    r = [
      { label: n(`subscription.garages`), used: t?.garages ?? 0, max: e?.maxGarages ?? 0 },
      { label: n(`subscription.staff`), used: t?.staff ?? 0, max: e?.maxStaff ?? 0 },
      { label: n(`subscription.transactionsToday`), used: t?.transactionsToday ?? 0, max: e?.maxTransactionsPerDay ?? 0 },
    ]
  return (0, W.jsxs)(`div`, {
    className: `flex flex-col gap-3`,
    children: [
      (0, W.jsx)(`p`, { className: `text-caption text-muted-foreground`, children: n(`subscription.usage`) }),
      r.map((e) =>
        (0, W.jsxs)(
          `div`,
          {
            className: `flex flex-col gap-1.5`,
            children: [
              (0, W.jsxs)(`div`, {
                className: `flex items-baseline justify-between text-body`,
                children: [
                  (0, W.jsx)(`span`, { children: e.label }),
                  (0, W.jsxs)(`span`, { className: `num text-muted-foreground`, children: [e.used, ` / `, e.max] }),
                ],
              }),
              (0, W.jsx)(g, { value: e.used, max: e.max, label: e.label }),
            ],
          },
          e.label,
        ),
      ),
    ],
  })
}
export { ee as SubscriptionPage }
