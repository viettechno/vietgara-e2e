import { A as e, At as t, Dt as n, Et as r, I as i, M as a, N as o, Ot as s, R as c, S as l, q as u } from './api-lC4u2sZi.js'
import { t as d } from './StatusBadge-DknRod1K.js'
import { n as f, r as p, t as m } from './CustomerLinkDialog-CTxNTgXJ.js'
import { t as h } from './VehicleFormModal-Bq-J6gjN.js'
import { t as g } from './pencil-DC9AcF2N.js'
import { t as _ } from './plus-CTDUdFcD.js'
import { t as v } from './rotate-ccw-LOO4idQV.js'
import { t as y } from './ConsentBadge-bZQurBMB.js'
import { n as b } from './Choice-C8tAQzDN.js'
import { a as x, i as S, n as C, o as w, r as T, s as E } from './Table-dqUq80Ez.js'
import { Ct as D, D as O, F as k, I as A, S as j, V as M, _ as N, f as P } from './index-CbGLOUZk.js'
import { t as F } from './PageHeader-HSPIRw-a.js'
import { n as I, t as L } from './form-Bpp5E52a.js'
import { t as R } from './Crumbs-CL4a3zqe.js'
import { t as z } from './EmptyState-B6htI9zs.js'
import { n as B, r as V } from './api-yVqfsw1B.js'
import { t as H } from './FormModal-O5Cwhy1v.js'
import { t as U } from './DeleteOrDeactivateDialog-6iREBBMO.js'
import { t as W } from './RowActions-Ubkh3T0m.js'
import { t as ee } from './VehicleTable-Il6VA6ri.js'
import { a as G, i as te, n as ne, o as K, r as re, t as ie } from './LinkStatusBadge-EfUbWhIc.js'
import { n as q, r as J } from './taxProfilesApi-CFBO1Viz.js'
var ae = u(`link-2-off`, [
    [`path`, { d: `M9 17H7A5 5 0 0 1 7 7`, key: `10o201` }],
    [`path`, { d: `M15 7h2a5 5 0 0 1 4 8`, key: `1d3206` }],
    [`line`, { x1: `8`, x2: `12`, y1: `12`, y2: `12`, key: `rvw6j4` }],
    [`line`, { x1: `2`, x2: `22`, y1: `2`, y2: `22`, key: `a6p6uj` }],
  ]),
  Y = t(s(), 1),
  X = n()
function Z({ profile: e, personalTaken: t, onClose: n, onSave: r }) {
  let { t: i } = l(),
    a = [
      { value: `TAX_PROFILE_KIND_COMPANY`, label: i(`taxProfiles.kind.company`) },
      ...(t ? [] : [{ value: `TAX_PROFILE_KIND_PERSONAL`, label: i(`taxProfiles.kind.personal`) }]),
    ]
  return (0, X.jsx)(H, {
    title: i(e ? `taxProfiles.editTitle` : `taxProfiles.createTitle`),
    fields: [
      ...(e ? [] : [{ name: `kind`, label: i(`taxProfiles.kindLabel`), type: `select`, options: a }]),
      { name: `legalName`, label: i(`taxProfiles.legalName`), required: !0, maxLength: 255 },
      { name: `taxId`, label: i(`taxProfiles.taxId`), hint: i(`taxProfiles.taxIdHint`), maxLength: 17 },
      { name: `address`, label: i(`common.address`), type: `textarea`, maxLength: 500 },
      { name: `invoiceEmail`, label: i(`taxProfiles.invoiceEmail`), type: `email`, maxLength: 255 },
      { name: `isDefault`, label: i(`taxProfiles.isDefault`), type: `checkbox` },
    ],
    values: e ?? { kind: `TAX_PROFILE_KIND_COMPANY` },
    submitLabel: i(e ? `common.save` : `common.create`),
    onClose: n,
    onSave: (t) =>
      r({
        kind: I(t, `kind`) || e?.kind || `TAX_PROFILE_KIND_COMPANY`,
        legalName: I(t, `legalName`),
        taxId: I(t, `taxId`),
        address: I(t, `address`),
        invoiceEmail: I(t, `invoiceEmail`),
        isDefault: L(t, `isDefault`),
      }),
  })
}
function oe({ garageId: e, customerId: t, canWrite: n }) {
  let { t: a } = l(),
    s = r(),
    [u, f] = (0, Y.useState)(!1),
    [p, m] = (0, Y.useState)(null),
    [h, g] = (0, Y.useState)(null),
    v = D({ queryKey: [...J(e, t), { includeInactive: u }], queryFn: () => q.list(e, t, u), enabled: !!(e && t) }),
    y = () => void s.invalidateQueries({ queryKey: J(e, t) }),
    k = async (n) => {
      try {
        let r = await q.lifecycle(e, t, n.id ?? ``).activate()
        ;(A.success(a(`lifecycle.activated`, { subject: r.legalName })), y())
      } catch (e) {
        A.error(O(a, e))
      }
    },
    N = v.data ?? [],
    P = N.some((e) => e.kind === `TAX_PROFILE_KIND_PERSONAL` && e.isActive !== !1)
  return (0, X.jsxs)(i, {
    title: a(`taxProfiles.title`),
    actions: (0, X.jsxs)(`span`, {
      className: `inline-flex flex-wrap items-center gap-3`,
      children: [
        (0, X.jsxs)(`label`, {
          className: `flex items-center gap-2 text-body text-muted-foreground`,
          children: [(0, X.jsx)(b, { checked: u, onCheckedChange: f, label: a(`lifecycle.showInactive`) }), a(`lifecycle.showInactive`)],
        }),
        n &&
          (0, X.jsxs)(c, {
            variant: `outline`,
            size: `sm`,
            onClick: () => m(`new`),
            children: [(0, X.jsx)(_, { 'aria-hidden': !0 }), ` `, a(`taxProfiles.new`)],
          }),
      ],
    }),
    children: [
      (0, X.jsx)(j, { isLoading: v.isLoading, error: v.error, onRetry: () => void v.refetch() }),
      v.data && N.length === 0 && (0, X.jsx)(o, { children: (0, X.jsx)(z, { message: a(`taxProfiles.empty`), compact: !0 }) }),
      N.length > 0 &&
        (0, X.jsx)(o, {
          children: (0, X.jsxs)(C, {
            caption: a(`taxProfiles.title`),
            children: [
              (0, X.jsx)(x, {
                children: (0, X.jsxs)(`tr`, {
                  children: [
                    (0, X.jsx)(w, { children: a(`taxProfiles.legalName`) }),
                    (0, X.jsx)(w, { children: a(`taxProfiles.kindLabel`) }),
                    (0, X.jsx)(w, { children: a(`taxProfiles.taxId`) }),
                    (0, X.jsx)(w, { children: a(`common.address`) }),
                    (0, X.jsx)(w, { children: a(`taxProfiles.invoiceEmail`) }),
                    n &&
                      (0, X.jsx)(w, {
                        className: `w-px`,
                        children: (0, X.jsx)(`span`, { className: `sr-only`, children: a(`common.actions`) }),
                      }),
                  ],
                }),
              }),
              (0, X.jsx)(T, {
                children: N.map((e) =>
                  (0, X.jsxs)(
                    E,
                    {
                      children: [
                        (0, X.jsxs)(S, {
                          primary: !0,
                          label: a(`taxProfiles.legalName`),
                          children: [
                            e.legalName,
                            e.isDefault &&
                              (0, X.jsx)(`span`, {
                                className: `ml-2 inline-block align-middle`,
                                children: (0, X.jsx)(M, { tone: `info`, children: a(`taxProfiles.default`) }),
                              }),
                            e.isActive === !1 &&
                              (0, X.jsx)(`span`, {
                                className: `ml-2 inline-block align-middle`,
                                children: (0, X.jsx)(d, { tone: `neutral`, label: a(`common.inactive`) }),
                              }),
                          ],
                        }),
                        (0, X.jsx)(S, {
                          label: a(`taxProfiles.kindLabel`),
                          children: a(e.kind === `TAX_PROFILE_KIND_PERSONAL` ? `taxProfiles.kind.personal` : `taxProfiles.kind.company`),
                        }),
                        (0, X.jsx)(S, { label: a(`taxProfiles.taxId`), className: `num`, children: e.taxId || `—` }),
                        (0, X.jsx)(S, {
                          label: a(`common.address`),
                          className: `max-w-64 truncate text-muted-foreground`,
                          children: e.address || `—`,
                        }),
                        (0, X.jsx)(S, {
                          label: a(`taxProfiles.invoiceEmail`),
                          className: `text-muted-foreground`,
                          children: e.invoiceEmail || `—`,
                        }),
                        n &&
                          (0, X.jsx)(S, {
                            actions: !0,
                            children: (0, X.jsx)(W, {
                              subject: e.legalName ?? ``,
                              onEdit: () => m(e),
                              onDelete: () => g(e),
                              onActivate: e.isActive === !1 ? () => void k(e) : void 0,
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
        }),
      p &&
        (0, X.jsx)(Z, {
          profile: p === `new` ? null : p,
          personalTaken: P,
          onClose: () => m(null),
          onSave: async (n) => {
            ;(p === `new` ? await q.create(e, t, n) : await q.update(e, t, p.id ?? ``, n), y(), A.success(a(`common.saved`)), m(null))
          },
        }),
      h &&
        (0, X.jsx)(U, {
          subject: h.legalName ?? ``,
          previewKey: [`tax-profiles`, e, h.id],
          preview: q.lifecycle(e, t, h.id ?? ``).preview,
          remove: q.lifecycle(e, t, h.id ?? ``).remove,
          onClose: () => g(null),
          onDone: y,
        }),
    ],
  })
}
function Q() {
  let { t } = l(),
    n = r(),
    { customerId: s = `` } = k(),
    { activeGarage: u, can: x } = P(),
    S = u?.id ?? ``,
    C = x(`PERMISSION_CUSTOMER_WRITE`),
    [w, T] = (0, Y.useState)(!1),
    E = D({ queryKey: [...K(S), s], queryFn: () => G.get(S, s), enabled: !!S }),
    M = D({
      queryKey: [...V(S), { customerId: s, includeInactive: w }],
      queryFn: () => B.list(S, { customerId: s, page: 1, pageSize: 100, includeInactive: w }),
      enabled: !!S,
    }),
    [I, L] = (0, Y.useState)(!1),
    [H, U] = (0, Y.useState)(!1),
    [W, q] = (0, Y.useState)(!1),
    J = () => {
      ;(n.invalidateQueries({ queryKey: K(S) }), n.invalidateQueries({ queryKey: V(S) }))
    },
    Z = async () => {
      try {
        let e = await G.lifecycle(S, s).activate()
        ;(A.success(t(`lifecycle.activated`, { subject: e.fullName })), J())
      } catch (e) {
        A.error(O(t, e))
      }
    },
    Q = async () => {
      try {
        ;(await te.unlink(S, s), A.success(t(`customers.link.unlinked`)), J())
      } catch (e) {
        A.error(O(t, e))
      }
    }
  if (!E.data)
    return (0, X.jsx)(a, {
      children: (0, X.jsx)(j, { isLoading: E.isLoading, error: E.error, onRetry: () => void E.refetch(), skeleton: `detail` }),
    })
  let $ = E.data
  return (0, X.jsxs)(a, {
    children: [
      (0, X.jsx)(F, {
        breadcrumb: (0, X.jsx)(R, { items: [{ label: t(`customers.title`), to: `/customers` }, { label: $.fullName }] }),
        title: $.fullName ?? ``,
        description: t(`customers.detail`),
        action:
          C &&
          (0, X.jsxs)(`span`, {
            className: `inline-flex flex-wrap gap-2`,
            children: [
              $.isActive === !1 &&
                (0, X.jsxs)(c, {
                  variant: `outline`,
                  onClick: () => void Z(),
                  children: [(0, X.jsx)(v, { 'aria-hidden': !0 }), ` `, t(`lifecycle.activate`)],
                }),
              ne($) &&
                (0, X.jsxs)(c, {
                  variant: `outline`,
                  onClick: () => q(!0),
                  children: [(0, X.jsx)(f, { 'aria-hidden': !0 }), ` `, t(`customers.link.request`)],
                }),
              $.linkStatus === `CUSTOMER_USER_LINK_STATUS_REQUESTED` &&
                (0, X.jsxs)(c, {
                  variant: `outline`,
                  onClick: () => q(!0),
                  children: [(0, X.jsx)(p, { 'aria-hidden': !0 }), ` `, t(`customers.link.enterCode`)],
                }),
              $.linkStatus === `CUSTOMER_USER_LINK_STATUS_LINKED` &&
                (0, X.jsxs)(c, {
                  variant: `outline`,
                  onClick: () => void Q(),
                  children: [(0, X.jsx)(ae, { 'aria-hidden': !0 }), ` `, t(`customers.link.unlink`)],
                }),
              (0, X.jsxs)(c, {
                variant: `outline`,
                onClick: () => L(!0),
                children: [(0, X.jsx)(g, { 'aria-hidden': !0 }), ` `, t(`common.edit`)],
              }),
            ],
          }),
      }),
      (0, X.jsx)(e, {
        items: [
          { label: t(`common.phone`), value: $.phone || `—` },
          { label: t(`common.email`), value: $.email || `—` },
          { label: t(`common.address`), value: $.address || `—` },
          {
            label: t(`customers.consentColumn`),
            value: (0, X.jsxs)(`span`, {
              className: `inline-flex flex-wrap items-center gap-2`,
              children: [
                (0, X.jsx)(y, { granted: !!$.personalDataConsent }),
                $.personalDataConsentAt && (0, X.jsx)(`span`, { className: `text-muted-foreground`, children: N($.personalDataConsentAt) }),
              ],
            }),
          },
          { label: t(`customers.link.account`), value: (0, X.jsx)(ie, { status: $.linkStatus }) },
          ...($.isActive === !1
            ? [{ label: t(`common.status`), value: (0, X.jsx)(d, { tone: `neutral`, label: t(`common.inactive`) }) }]
            : []),
          { label: t(`common.createdAt`), value: N($.createdAt) },
        ],
      }),
      (0, X.jsx)(oe, { garageId: S, customerId: s, canWrite: C }),
      (0, X.jsxs)(i, {
        title: t(`nav.vehicles`),
        actions: (0, X.jsxs)(`span`, {
          className: `inline-flex flex-wrap items-center gap-3`,
          children: [
            (0, X.jsxs)(`label`, {
              className: `flex items-center gap-2 text-body text-muted-foreground`,
              children: [
                (0, X.jsx)(b, { checked: w, onCheckedChange: T, label: t(`lifecycle.showInactive`) }),
                t(`lifecycle.showInactive`),
              ],
            }),
            C &&
              (0, X.jsxs)(c, {
                variant: `outline`,
                size: `sm`,
                onClick: () => U(!0),
                children: [(0, X.jsx)(_, { 'aria-hidden': !0 }), ` `, t(`vehicles.new`)],
              }),
          ],
        }),
        children: [
          (0, X.jsx)(j, { isLoading: M.isLoading, error: M.error, onRetry: () => void M.refetch() }),
          M.data &&
            M.data.items.length === 0 &&
            (0, X.jsx)(o, {
              children: (0, X.jsx)(z, {
                message: t(`vehicles.empty`),
                compact: !0,
                action:
                  C &&
                  (0, X.jsxs)(c, {
                    variant: `primary`,
                    onClick: () => U(!0),
                    children: [(0, X.jsx)(_, { 'aria-hidden': !0 }), ` `, t(`vehicles.new`)],
                  }),
              }),
            }),
          M.data &&
            M.data.items.length > 0 &&
            (0, X.jsx)(o, { children: (0, X.jsx)(ee, { garageId: S, vehicles: M.data.items, canWrite: C }) }),
        ],
      }),
      I &&
        (0, X.jsx)(re, {
          customer: $,
          onClose: () => L(!1),
          onSave: async (e) => {
            ;(await G.update(S, s, e), J(), L(!1))
          },
        }),
      W &&
        (0, X.jsx)(m, {
          garageId: S,
          customerId: s,
          customerName: $.fullName ?? ``,
          waiting: $.linkStatus === `CUSTOMER_USER_LINK_STATUS_REQUESTED`,
          onClose: () => q(!1),
          onLinked: () => A.success(t(`customers.link.linked`)),
          onChanged: J,
        }),
      H &&
        (0, X.jsx)(h, {
          vehicle: null,
          ownerName: $.fullName ?? ``,
          onClose: () => U(!1),
          onSave: async (e) => {
            ;(await B.create(S, { ...e, customerId: s }), J(), U(!1))
          },
        }),
    ],
  })
}
export { Q as CustomerDetailPage }
