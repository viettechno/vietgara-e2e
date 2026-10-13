import { At as e, Dt as t, Et as n, M as r, N as i, Ot as a, R as o, S as s } from './api-lC4u2sZi.js'
import { t as c } from './StatusBadge-DknRod1K.js'
import { t as l } from './plus-CTDUdFcD.js'
import { t as u } from './ConsentBadge-bZQurBMB.js'
import { n as d } from './Choice-C8tAQzDN.js'
import { a as f, i as p, n as m, o as h, r as g, s as _ } from './Table-dqUq80Ez.js'
import { A as v, D as y, G as b, I as x, S, f as C, gt as w } from './index-CbGLOUZk.js'
import { t as T } from './PageHeader-HSPIRw-a.js'
import { t as E } from './EmptyState-B6htI9zs.js'
import { t as D } from './DeleteOrDeactivateDialog-6iREBBMO.js'
import { t as O } from './RowActions-Ubkh3T0m.js'
import { a as k, o as A, r as j, t as M } from './LinkStatusBadge-EfUbWhIc.js'
import { n as N, t as P } from './usePagedQuery-l3G6ju52.js'
import { t as F } from './useDebouncedValue-BuAekAoL.js'
var I = e(a(), 1),
  L = t()
function R() {
  let { t: e } = s(),
    t = n(),
    { activeGarage: a, can: R } = C(),
    z = a?.id ?? ``,
    B = R(`PERMISSION_CUSTOMER_WRITE`),
    [V, H] = (0, I.useState)(``),
    [U, W] = (0, I.useState)(null),
    [G, K] = (0, I.useState)(null),
    [q, J] = (0, I.useState)(!1),
    Y = F(V.trim()),
    X = P([...A(z), { debounced: Y, includeInactive: q }], (e) => k.list(z, { query: Y, page: e, includeInactive: q }), !!z)
  if (!z) return (0, L.jsx)(E, { message: e(`common.selectGarageFirst`) })
  let Z = () => void t.invalidateQueries({ queryKey: A(z) }),
    Q = async (t) => {
      try {
        ;(await k.lifecycle(z, t.id ?? ``).activate(), x.success(e(`lifecycle.activated`, { subject: t.fullName })), Z())
      } catch (t) {
        x.error(y(e, t))
      }
    },
    $ =
      B &&
      (0, L.jsxs)(o, {
        variant: `primary`,
        onClick: () => W(`new`),
        children: [(0, L.jsx)(l, { 'aria-hidden': !0 }), ` `, e(`customers.new`)],
      })
  return (0, L.jsxs)(r, {
    children: [
      (0, L.jsx)(T, {
        title: e(`customers.title`),
        description: e(`customers.description`),
        action: X.data?.items.length === 0 && !Y ? void 0 : $,
      }),
      (0, L.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row sm:items-center`,
        children: [
          (0, L.jsx)(`div`, {
            className: `flex-1`,
            children: (0, L.jsx)(b, {
              icon: (0, L.jsx)(w, {}),
              'aria-label': e(`common.search`),
              value: V,
              onChange: (e) => H(e.target.value),
              onClear: () => H(``),
              clearLabel: e(`ui.clear`),
              placeholder: e(`customers.searchPlaceholder`),
            }),
          }),
          (0, L.jsxs)(`label`, {
            className: `flex items-center gap-2 text-body text-muted-foreground`,
            children: [(0, L.jsx)(d, { checked: q, onCheckedChange: J, label: e(`lifecycle.showInactive`) }), e(`lifecycle.showInactive`)],
          }),
        ],
      }),
      (0, L.jsx)(S, { isLoading: X.isLoading, error: X.error, onRetry: () => void X.refetch() }),
      X.data &&
        X.data.items.length === 0 &&
        (0, L.jsx)(i, {
          children: Y
            ? (0, L.jsx)(E, {
                kind: `search`,
                title: e(`ui.noResults`),
                message: e(`customers.empty`),
                action: (0, L.jsx)(o, { variant: `outline`, onClick: () => H(``), children: e(`ui.clearFilters`) }),
                compact: !0,
              })
            : (0, L.jsx)(E, { message: e(`customers.empty`), action: $ }),
        }),
      X.data &&
        X.data.items.length > 0 &&
        (0, L.jsxs)(i, {
          children: [
            (0, L.jsxs)(m, {
              caption: e(`customers.title`),
              children: [
                (0, L.jsx)(f, {
                  children: (0, L.jsxs)(`tr`, {
                    children: [
                      (0, L.jsx)(h, { children: e(`customers.fullName`) }),
                      (0, L.jsx)(h, { children: e(`common.phone`) }),
                      (0, L.jsx)(h, { children: e(`common.email`) }),
                      (0, L.jsx)(h, { numeric: !0, children: e(`nav.vehicles`) }),
                      (0, L.jsx)(h, { children: e(`customers.consentColumn`) }),
                      B &&
                        (0, L.jsx)(h, {
                          className: `w-px`,
                          children: (0, L.jsx)(`span`, { className: `sr-only`, children: e(`common.actions`) }),
                        }),
                    ],
                  }),
                }),
                (0, L.jsx)(g, {
                  children: X.data.items.map((t) =>
                    (0, L.jsxs)(
                      _,
                      {
                        children: [
                          (0, L.jsxs)(p, {
                            primary: !0,
                            label: e(`customers.fullName`),
                            children: [
                              (0, L.jsx)(v, {
                                to: `/customers/${t.id}`,
                                className: `hover:text-primary-subtle-foreground hover:underline`,
                                children: t.fullName,
                              }),
                              t.isActive === !1 &&
                                (0, L.jsx)(`span`, {
                                  className: `ml-2 inline-block align-middle`,
                                  children: (0, L.jsx)(c, { tone: `neutral`, label: e(`common.inactive`) }),
                                }),
                              t.linkStatus &&
                                (0, L.jsx)(`span`, {
                                  className: `ml-2 inline-block align-middle`,
                                  children: (0, L.jsx)(M, { status: t.linkStatus }),
                                }),
                            ],
                          }),
                          (0, L.jsx)(p, { label: e(`common.phone`), className: `num`, children: t.phone || `—` }),
                          (0, L.jsx)(p, {
                            label: e(`common.email`),
                            className: `max-w-64 truncate text-muted-foreground`,
                            children: t.email || `—`,
                          }),
                          (0, L.jsx)(p, { numeric: !0, label: e(`nav.vehicles`), children: t.vehicleCount ?? 0 }),
                          (0, L.jsx)(p, {
                            label: e(`customers.consentColumn`),
                            children: (0, L.jsx)(u, { granted: !!t.personalDataConsent }),
                          }),
                          B &&
                            (0, L.jsx)(p, {
                              actions: !0,
                              children: (0, L.jsx)(O, {
                                subject: t.fullName ?? ``,
                                onEdit: () => W(t),
                                onDelete: () => K(t),
                                onActivate: t.isActive === !1 ? () => void Q(t) : void 0,
                              }),
                            }),
                        ],
                      },
                      t.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, L.jsx)(N, { page: X.page, pageSize: X.data.pageSize, total: X.data.total, onPageChange: X.setPage }),
          ],
        }),
      U &&
        (0, L.jsx)(j, {
          customer: U === `new` ? null : U,
          onClose: () => W(null),
          onSave: async (t) => {
            ;(U === `new` ? await k.create(z, t) : await k.update(z, U.id ?? ``, t), Z(), x.success(e(`common.saved`)), W(null))
          },
        }),
      G &&
        (0, L.jsx)(D, {
          subject: G.fullName ?? ``,
          detail: G.vehicleCount ? e(`customers.deleteVehicles`, { count: G.vehicleCount }) : void 0,
          previewKey: [`customers`, z, G.id],
          preview: k.lifecycle(z, G.id ?? ``).preview,
          remove: k.lifecycle(z, G.id ?? ``).remove,
          onClose: () => K(null),
          onDone: Z,
        }),
    ],
  })
}
export { R as CustomersPage }
