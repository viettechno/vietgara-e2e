import { At as e, Dt as t, Et as n, M as r, N as i, Ot as a, P as o, R as s, S as c, q as l } from './api-lC4u2sZi.js'
import { t as u } from './useMutation-YmV9sVwE.js'
import { t as d } from './ban-DfdGjpju.js'
import { t as f } from './rotate-ccw-LOO4idQV.js'
import { t as p } from './trash-DZQxI2eA.js'
import { t as m } from './Choice-C8tAQzDN.js'
import { a as h, i as g, n as _, o as v, r as y, s as b } from './Table-dqUq80Ez.js'
import {
  B as x,
  C as S,
  Ct as C,
  D as w,
  F as T,
  I as E,
  J as D,
  S as O,
  U as k,
  W as A,
  g as j,
  h as M,
  p as N,
  x as ee,
} from './index-CbGLOUZk.js'
import { t as P } from './PageHeader-HSPIRw-a.js'
import { n as F, t as I } from './form-Bpp5E52a.js'
import { t as L } from './Crumbs-CL4a3zqe.js'
import { t as R } from './ConfirmDialog-2Cqs5W6F.js'
var z = l(`image-up`, [
    [`path`, { d: `M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21`, key: `9csbqa` }],
    [`path`, { d: `m14 19.5 3-3 3 3`, key: `9vmjn0` }],
    [`path`, { d: `M17 22v-5.5`, key: `1aa6fl` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2`, key: `af1f0g` }],
  ]),
  B = e(a(), 1),
  V = t(),
  H = [`MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`],
  U = [`image/png`, `image/jpeg`, `image/webp`],
  W = 1048576
function G() {
  let { garageId: e = `` } = T(),
    t = C({ queryKey: [...j, e], queryFn: () => M.get(e) })
  return t.data
    ? (0, V.jsx)(q, { garage: t.data })
    : (0, V.jsx)(r, {
        children: (0, V.jsx)(O, { isLoading: t.isLoading, error: t.error, onRetry: () => void t.refetch(), skeleton: `detail` }),
      })
}
function K({ title: e, children: t }) {
  return (0, V.jsxs)(`section`, {
    className: `grid gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8`,
    children: [(0, V.jsx)(`h2`, { className: `text-subheading`, children: e }), (0, V.jsx)(`div`, { className: `min-w-0`, children: t })],
  })
}
function q({ garage: e }) {
  let { t } = c(),
    n = e.id ?? ``,
    i = !!e.access?.owner,
    a = i || !!e.access?.permissions?.includes(`PERMISSION_GARAGE_WRITE`)
  return (0, V.jsxs)(r, {
    className: `gap-8`,
    children: [
      (0, V.jsx)(P, {
        breadcrumb: (0, V.jsx)(L, { items: [{ label: t(`nav.garages`), to: `/garages` }, { label: e.name }] }),
        title: t(`garages.settings`),
        description: t(`garages.settingsDescription`),
      }),
      e.status === `GARAGE_STATUS_INACTIVE` && (0, V.jsx)(S, { tone: `warning`, title: t(`garages.inactiveNotice`) }),
      !a && (0, V.jsx)(S, { tone: `info`, title: t(`errors.PERMISSION_DENIED`) }),
      (0, V.jsx)(K, {
        title: t(`garages.profile`),
        children: (0, V.jsx)(Q, {
          garage: e,
          title: t(`garages.profile`),
          disabled: !a,
          build: J,
          children: (0, V.jsxs)(`div`, {
            className: `grid gap-4 sm:grid-cols-2`,
            children: [
              (0, V.jsx)($, { name: `name`, label: t(`garages.name`), value: e.name, required: !0, maxLength: 255 }),
              (0, V.jsx)($, { name: `taxCode`, label: t(`common.taxCode`), value: e.taxCode, maxLength: 20 }),
              (0, V.jsx)($, { name: `address`, label: t(`common.address`), value: e.address, maxLength: 500, className: `sm:col-span-2` }),
              (0, V.jsx)($, { name: `phone`, label: t(`common.phone`), value: e.phone, type: `tel` }),
              (0, V.jsx)($, { name: `email`, label: t(`common.email`), value: e.email, type: `email` }),
            ],
          }),
        }),
      }),
      (0, V.jsx)(K, {
        title: t(`garages.legalProfile`),
        children: (0, V.jsxs)(Q, {
          garage: e,
          title: t(`garages.legalProfile`),
          disabled: !a,
          build: Y,
          children: [
            (0, V.jsx)(`p`, { className: `mb-4 text-body text-muted-foreground`, children: t(`garages.legalProfileHint`) }),
            (0, V.jsxs)(`div`, {
              className: `grid gap-4 sm:grid-cols-2`,
              children: [
                (0, V.jsx)($, {
                  name: `legalName`,
                  label: t(`garages.legalName`),
                  value: e.legalName,
                  maxLength: 255,
                  className: `sm:col-span-2`,
                }),
                (0, V.jsx)($, {
                  name: `legalAddress`,
                  label: t(`garages.legalAddress`),
                  value: e.legalAddress,
                  maxLength: 500,
                  className: `sm:col-span-2`,
                }),
                (0, V.jsx)($, { name: `representative`, label: t(`garages.representative`), value: e.representative, maxLength: 255 }),
                (0, V.jsx)($, { name: `bankName`, label: t(`suppliers.bankName`), value: e.bank?.bankName, maxLength: 100 }),
                (0, V.jsx)($, { name: `accountNumber`, label: t(`suppliers.accountNumber`), value: e.bank?.accountNumber, maxLength: 50 }),
                (0, V.jsx)($, { name: `accountHolder`, label: t(`suppliers.accountHolder`), value: e.bank?.accountHolder, maxLength: 255 }),
              ],
            }),
          ],
        }),
      }),
      (0, V.jsx)(K, {
        title: t(`garages.configuration`),
        children: (0, V.jsx)(Q, {
          garage: e,
          title: t(`garages.configuration`),
          disabled: !a,
          build: X,
          children: (0, V.jsxs)(`div`, {
            className: `grid gap-4 sm:grid-cols-2`,
            children: [
              (0, V.jsx)($, { name: `timezone`, label: t(`garages.timezone`), value: e.timezone, required: !0, hint: `Asia/Ho_Chi_Minh` }),
              (0, V.jsx)($, { name: `currency`, label: t(`garages.currency`), value: e.currency, required: !0, maxLength: 3, hint: `VND` }),
              (0, V.jsx)($, {
                name: `quote`,
                label: t(`garages.quoteTemplate`),
                value: e.numbering?.quote,
                hint: t(`garages.templateHint`),
              }),
              (0, V.jsx)($, { name: `repairOrder`, label: t(`garages.repairOrderTemplate`), value: e.numbering?.repairOrder }),
              (0, V.jsx)($, { name: `settlement`, label: t(`garages.settlementTemplate`), value: e.numbering?.settlement }),
              (0, V.jsx)($, {
                name: `paymentVoucher`,
                label: t(`garages.paymentVoucherTemplate`),
                value: e.numbering?.paymentVoucher,
                hint: t(`garages.paymentVoucherTemplateHint`),
              }),
              (0, V.jsx)(D, {
                label: t(`garages.defaultApprovalMode`),
                hint: t(`garages.defaultApprovalModeHint`),
                className: `sm:col-span-2`,
                children: (0, V.jsxs)(A, {
                  name: `approvalMode`,
                  defaultValue: e.defaultQuoteApprovalMode ?? `QUOTE_APPROVAL_MODE_LINK`,
                  children: [
                    (0, V.jsx)(`option`, { value: `QUOTE_APPROVAL_MODE_LINK`, children: t(`quotes.approvalMode.LINK`) }),
                    (0, V.jsx)(`option`, { value: `QUOTE_APPROVAL_MODE_MANUAL`, children: t(`quotes.approvalMode.MANUAL`) }),
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
      (0, V.jsx)(K, {
        title: t(`garages.operatingHours`),
        children: (0, V.jsx)(Q, {
          garage: e,
          title: t(`garages.operatingHours`),
          disabled: !a,
          build: Z,
          flush: !0,
          children: (0, V.jsx)(te, { hours: e.operatingHours ?? [] }),
        }),
      }),
      (0, V.jsx)(K, {
        title: t(`garages.logo`),
        children: (0, V.jsx)(ne, { garageId: n, name: e.name, logoUrl: e.logoUrl, disabled: !a }),
      }),
      i && (0, V.jsx)(K, { title: t(`common.status`), children: (0, V.jsx)(re, { garage: e }) }),
    ],
  })
}
function J(e) {
  return { name: F(e, `name`), address: F(e, `address`), phone: F(e, `phone`), email: F(e, `email`), taxCode: F(e, `taxCode`) }
}
function Y(e) {
  return {
    legalName: F(e, `legalName`),
    legalAddress: F(e, `legalAddress`),
    representative: F(e, `representative`),
    bank: { bankName: F(e, `bankName`), accountNumber: F(e, `accountNumber`), accountHolder: F(e, `accountHolder`) },
  }
}
function X(e) {
  return {
    timezone: F(e, `timezone`),
    currency: F(e, `currency`).toUpperCase(),
    numbering: Object.fromEntries(
      Object.entries({
        quote: F(e, `quote`),
        repairOrder: F(e, `repairOrder`),
        settlement: F(e, `settlement`),
        paymentVoucher: F(e, `paymentVoucher`),
      }).filter(([, e]) => e),
    ),
    defaultQuoteApprovalMode: F(e, `approvalMode`),
  }
}
function Z(e) {
  return {
    operatingHours: H.map((t) => {
      let n = !I(e, `${t}-open`)
      return n ? { day: t, closed: n } : { day: t, closed: n, open: F(e, `${t}-from`), close: F(e, `${t}-to`) }
    }),
  }
}
function Q({ garage: e, title: t, disabled: r, build: a, children: o, flush: l }) {
  let { t: d } = c(),
    f = n(),
    p = u({
      mutationFn: (t) => M.update(e.id ?? ``, t),
      onSuccess: (t) => {
        ;(f.setQueryData([...j, e.id], t), f.invalidateQueries({ queryKey: j, exact: !0 }), E.success(d(`common.saved`)))
      },
    })
  return (0, V.jsx)(i, {
    children: (0, V.jsxs)(`form`, {
      onSubmit: (e) => {
        ;(e.preventDefault(), p.mutate(a(new FormData(e.currentTarget))))
      },
      'aria-label': t,
      children: [
        (0, V.jsx)(`fieldset`, { disabled: r || p.isPending, className: l ? `` : `p-5 max-sm:p-4`, children: o }),
        p.error && (0, V.jsx)(`div`, { className: `px-5 pb-4`, children: (0, V.jsx)(S, { tone: `error`, title: w(d, p.error) }) }),
        !r &&
          (0, V.jsx)(`div`, {
            className: `flex justify-end border-t border-border bg-surface-sunken px-5 py-3`,
            children: (0, V.jsx)(s, {
              type: `submit`,
              variant: `primary`,
              loading: p.isPending,
              children: p.isPending ? d(`common.saving`) : d(`common.save`),
            }),
          }),
      ],
    }),
  })
}
function $({ name: e, label: t, value: n, type: r = `text`, required: i, maxLength: a, hint: o, className: s }) {
  return (0, V.jsx)(D, {
    label: t,
    hint: o,
    required: i,
    className: s,
    children: (0, V.jsx)(k, { name: e, type: r, defaultValue: n ?? ``, required: i, maxLength: a }),
  })
}
function te({ hours: e }) {
  let { t } = c()
  return (0, V.jsxs)(_, {
    stack: !1,
    caption: t(`garages.operatingHours`),
    children: [
      (0, V.jsx)(h, {
        children: (0, V.jsxs)(`tr`, {
          children: [
            (0, V.jsx)(v, { children: t(`garages.day`) }),
            (0, V.jsx)(v, { children: t(`garages.workday`) }),
            (0, V.jsx)(v, { children: t(`garages.opens`) }),
            (0, V.jsx)(v, { children: t(`garages.closes`) }),
          ],
        }),
      }),
      (0, V.jsx)(y, {
        children: H.map((n) => {
          let r = e.find((e) => e.day === n),
            i = r ? !r.closed : n !== `SUNDAY`
          return (0, V.jsxs)(
            b,
            {
              children: [
                (0, V.jsx)(g, { primary: !0, className: `whitespace-nowrap`, children: t(`garages.days.${n}`) }),
                (0, V.jsx)(g, {
                  children: (0, V.jsx)(m, {
                    name: `${n}-open`,
                    defaultChecked: i,
                    'aria-label': `${t(`garages.days.${n}`)}: ${t(`garages.workday`)}`,
                    label: (0, V.jsx)(`span`, { className: `sr-only`, children: t(`garages.workday`) }),
                  }),
                }),
                (0, V.jsx)(g, {
                  className: `py-1.5`,
                  children: (0, V.jsx)(k, {
                    type: `time`,
                    name: `${n}-from`,
                    defaultValue: r?.open || `08:00`,
                    'aria-label': `${t(`garages.days.${n}`)}: ${t(`garages.opens`)}`,
                    className: `num w-28`,
                  }),
                }),
                (0, V.jsx)(g, {
                  className: `py-1.5`,
                  children: (0, V.jsx)(k, {
                    type: `time`,
                    name: `${n}-to`,
                    defaultValue: r?.close || `17:30`,
                    'aria-label': `${t(`garages.days.${n}`)}: ${t(`garages.closes`)}`,
                    className: `num w-28`,
                  }),
                }),
              ],
            },
            n,
          )
        }),
      }),
    ],
  })
}
function ne({ garageId: e, name: t, logoUrl: r, disabled: a }) {
  let { t: l } = c(),
    d = n(),
    [f, m] = (0, B.useState)(``),
    h = (t) => {
      ;(d.setQueryData([...j, e], t), d.invalidateQueries({ queryKey: j, exact: !0 }), E.success(l(`common.saved`)))
    },
    g = u({ mutationFn: async (t) => M.uploadLogo(e, await N(t), t.type), onSuccess: h, onError: (e) => m(w(l, e)) }),
    _ = u({ mutationFn: () => M.deleteLogo(e), onSuccess: h, onError: (e) => m(w(l, e)) })
  return (0, V.jsx)(i, {
    children: (0, V.jsxs)(o, {
      className: `flex flex-wrap items-center gap-5`,
      children: [
        (0, V.jsx)(x, { shape: `square`, className: `size-20 text-heading`, initials: ee(t), src: r || void 0 }),
        (0, V.jsxs)(`div`, {
          className: `flex min-w-0 flex-1 basis-64 flex-col gap-3`,
          children: [
            (0, V.jsx)(`p`, { className: `text-body text-muted-foreground`, children: l(`garages.logoHint`) }),
            f && (0, V.jsx)(S, { tone: `error`, title: f }),
            !a &&
              (0, V.jsxs)(`div`, {
                className: `flex flex-wrap gap-2`,
                children: [
                  (0, V.jsx)(s, {
                    asChild: !0,
                    variant: `outline`,
                    size: `sm`,
                    children: (0, V.jsxs)(`label`, {
                      className: `cursor-pointer`,
                      children: [
                        (0, V.jsx)(z, { 'aria-hidden': !0 }),
                        ` `,
                        l(`garages.uploadLogo`),
                        (0, V.jsx)(`input`, {
                          type: `file`,
                          accept: U.join(`,`),
                          onChange: (e) => {
                            let t = e.target.files?.[0]
                            if (((e.target.value = ``), t)) {
                              if ((m(``), !U.includes(t.type) || t.size > W)) {
                                m(l(`errors.INVALID_LOGO`))
                                return
                              }
                              g.mutate(t)
                            }
                          },
                          disabled: g.isPending,
                          className: `sr-only`,
                        }),
                      ],
                    }),
                  }),
                  r &&
                    (0, V.jsxs)(s, {
                      variant: `outline`,
                      size: `sm`,
                      loading: _.isPending,
                      onClick: () => _.mutate(),
                      children: [(0, V.jsx)(p, { 'aria-hidden': !0 }), ` `, l(`garages.removeLogo`)],
                    }),
                ],
              }),
          ],
        }),
      ],
    }),
  })
}
function re({ garage: e }) {
  let { t } = c(),
    r = n(),
    [a, l] = (0, B.useState)(!1),
    u = e.status === `GARAGE_STATUS_INACTIVE`
  return (0, V.jsxs)(i, {
    children: [
      (0, V.jsxs)(o, {
        className: `flex flex-wrap items-center justify-between gap-4`,
        children: [
          (0, V.jsxs)(`div`, {
            children: [
              (0, V.jsx)(`p`, { className: `text-body font-medium`, children: t(u ? `common.inactive` : `common.active`) }),
              (0, V.jsx)(`p`, {
                className: `mt-0.5 text-body text-muted-foreground`,
                children: t(u ? `garages.activateConfirm` : `garages.deactivateConfirm`, { name: e.name }),
              }),
            ],
          }),
          (0, V.jsxs)(s, {
            variant: u ? `primary` : `outline`,
            className: u ? `` : `border-destructive/50 text-destructive-subtle-foreground hover:bg-destructive-subtle`,
            onClick: () => l(!0),
            children: [
              u ? (0, V.jsx)(f, { 'aria-hidden': !0 }) : (0, V.jsx)(d, { 'aria-hidden': !0 }),
              ` `,
              t(u ? `garages.activate` : `garages.deactivate`),
            ],
          }),
        ],
      }),
      a &&
        (0, V.jsx)(R, {
          title: t(u ? `garages.activate` : `garages.deactivate`),
          description: t(u ? `garages.activateConfirm` : `garages.deactivateConfirm`, { name: e.name }),
          confirmLabel: t(u ? `garages.activate` : `garages.deactivate`),
          danger: !u,
          onClose: () => l(!1),
          onConfirm: async () => {
            let t = await M.update(e.id ?? ``, { status: u ? `GARAGE_STATUS_ACTIVE` : `GARAGE_STATUS_INACTIVE` })
            ;(r.setQueryData([...j, e.id], t), await r.invalidateQueries({ queryKey: j, exact: !0 }))
          },
        }),
    ],
  })
}
export { G as GarageSettingsPage }
