import { At as e, Dt as t, Et as n, M as r, N as i, Ot as a, R as o, S as s, i as c, n as l } from './api-lC4u2sZi.js'
import { t as u } from './StatusBadge-DknRod1K.js'
import { t as d } from './plus-CTDUdFcD.js'
import { n as f } from './Choice-C8tAQzDN.js'
import { a as p, i as m, n as h, o as g, r as _, s as v } from './Table-dqUq80Ez.js'
import { D as y, G as b, I as x, S, f as C, gt as w, m as T, yt as E } from './index-CbGLOUZk.js'
import { t as D } from './PageHeader-HSPIRw-a.js'
import { n as O } from './form-Bpp5E52a.js'
import { t as k } from './EmptyState-B6htI9zs.js'
import { t as A } from './lifecycle-CokP48op.js'
import { t as j } from './pagination-CRXyaCrX.js'
import { t as M } from './FormModal-O5Cwhy1v.js'
import { t as N } from './DeleteOrDeactivateDialog-6iREBBMO.js'
import { t as P } from './RowActions-Ubkh3T0m.js'
import { n as F, t as I } from './usePagedQuery-l3G6ju52.js'
import { t as L } from './useDebouncedValue-BuAekAoL.js'
var R = e(a(), 1)
function z(e, t) {
  return `${T(e)}/suppliers${t ? `/${encodeURIComponent(t)}` : ``}`
}
var B = {
  list: async (e, t) => j(await l.get(`${z(e)}${c({ ...t, pageSize: 20 })}`)),
  create: (e, t) => l.post(z(e), t),
  update: (e, t, n) => l.patch(z(e, t), n),
  lifecycle: (e, t) => A(z(e, t)),
}
function V(e) {
  return [`garages`, e, `suppliers`]
}
var H = t()
function U({ supplier: e, onClose: t, onSave: n }) {
  let { t: r } = s()
  return (0, H.jsx)(M, {
    titleId: `supplier-form`,
    icon: (0, H.jsx)(E, { size: 22 }),
    title: r(e ? `suppliers.editTitle` : `suppliers.createTitle`),
    fields: [
      { name: `name`, label: r(`common.name`), required: !0, maxLength: 255 },
      { name: `taxCode`, label: r(`common.taxCode`), maxLength: 20 },
      { name: `contactPerson`, label: r(`suppliers.contactPerson`), maxLength: 255 },
      { name: `phone`, label: r(`common.phone`), type: `tel`, maxLength: 20 },
      { name: `email`, label: r(`common.email`), type: `email`, maxLength: 255 },
      { name: `address`, label: r(`common.address`), type: `textarea`, maxLength: 500 },
      { name: `bankName`, label: r(`suppliers.bankName`), maxLength: 100 },
      { name: `accountNumber`, label: r(`suppliers.accountNumber`), maxLength: 100 },
      { name: `accountHolder`, label: r(`suppliers.accountHolder`), maxLength: 255 },
      { name: `note`, label: r(`common.note`), type: `textarea`, maxLength: 1e3 },
    ],
    values: e ? { name: e.name, taxCode: e.taxCode, note: e.note, ...e.contact, ...e.bank } : void 0,
    submitLabel: r(e ? `common.save` : `common.create`),
    onClose: t,
    onSave: (e) =>
      n({
        name: O(e, `name`),
        taxCode: O(e, `taxCode`),
        contact: { contactPerson: O(e, `contactPerson`), phone: O(e, `phone`), email: O(e, `email`), address: O(e, `address`) },
        bank: { bankName: O(e, `bankName`), accountNumber: O(e, `accountNumber`), accountHolder: O(e, `accountHolder`) },
        note: O(e, `note`),
      }),
  })
}
function W() {
  let { t: e } = s(),
    t = n(),
    { activeGarage: a, can: c } = C(),
    l = a?.id ?? ``,
    T = c(`PERMISSION_SUPPLIER_WRITE`),
    [E, O] = (0, R.useState)(``),
    [A, j] = (0, R.useState)(null),
    [M, z] = (0, R.useState)(null),
    [W, G] = (0, R.useState)(!1),
    K = L(E.trim()),
    q = I([...V(l), { debounced: K, includeInactive: W }], (e) => B.list(l, { query: K, page: e, includeInactive: W }), !!l)
  if (!l) return (0, H.jsx)(k, { message: e(`common.selectGarageFirst`) })
  let J = () => void t.invalidateQueries({ queryKey: V(l) }),
    Y = async (t) => {
      try {
        ;(await B.lifecycle(l, t.id ?? ``).activate(), x.success(e(`lifecycle.activated`, { subject: t.name })), J())
      } catch (t) {
        x.error(y(e, t))
      }
    },
    X = !!K,
    Z =
      T &&
      (0, H.jsxs)(o, {
        variant: `primary`,
        onClick: () => j(`new`),
        children: [(0, H.jsx)(d, { 'aria-hidden': !0 }), ` `, e(`suppliers.new`)],
      })
  return (0, H.jsxs)(r, {
    children: [
      (0, H.jsx)(D, {
        title: e(`suppliers.title`),
        description: e(`suppliers.description`),
        action: q.data?.items.length === 0 && !X ? void 0 : Z,
      }),
      (0, H.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row sm:items-center`,
        children: [
          (0, H.jsx)(`div`, {
            className: `flex-1`,
            children: (0, H.jsx)(b, {
              icon: (0, H.jsx)(w, {}),
              'aria-label': e(`common.search`),
              value: E,
              onChange: (e) => O(e.target.value),
              onClear: () => O(``),
              clearLabel: e(`ui.clear`),
              placeholder: e(`suppliers.searchPlaceholder`),
            }),
          }),
          (0, H.jsxs)(`label`, {
            className: `flex items-center gap-2 text-body text-muted-foreground`,
            children: [(0, H.jsx)(f, { checked: W, onCheckedChange: G, label: e(`lifecycle.showInactive`) }), e(`lifecycle.showInactive`)],
          }),
        ],
      }),
      (0, H.jsx)(S, { isLoading: q.isLoading, error: q.error, onRetry: () => void q.refetch() }),
      q.data &&
        q.data.items.length === 0 &&
        (0, H.jsx)(i, {
          children: X
            ? (0, H.jsx)(k, {
                kind: `search`,
                title: e(`ui.noResults`),
                message: e(`suppliers.empty`),
                action: (0, H.jsx)(o, { variant: `outline`, onClick: () => O(``), children: e(`ui.clearFilters`) }),
                compact: !0,
              })
            : (0, H.jsx)(k, { message: e(`suppliers.empty`), action: Z }),
        }),
      q.data &&
        q.data.items.length > 0 &&
        (0, H.jsxs)(i, {
          children: [
            (0, H.jsxs)(h, {
              caption: e(`suppliers.title`),
              children: [
                (0, H.jsx)(p, {
                  children: (0, H.jsxs)(`tr`, {
                    children: [
                      (0, H.jsx)(g, { children: e(`common.name`) }),
                      (0, H.jsx)(g, { children: e(`suppliers.contactPerson`) }),
                      (0, H.jsx)(g, { children: e(`common.phone`) }),
                      (0, H.jsx)(g, { children: e(`common.email`) }),
                      T &&
                        (0, H.jsx)(g, {
                          className: `w-px`,
                          children: (0, H.jsx)(`span`, { className: `sr-only`, children: e(`common.actions`) }),
                        }),
                    ],
                  }),
                }),
                (0, H.jsx)(_, {
                  children: q.data.items.map((t) =>
                    (0, H.jsxs)(
                      v,
                      {
                        children: [
                          (0, H.jsxs)(m, {
                            primary: !0,
                            label: e(`common.name`),
                            className: `py-2`,
                            children: [
                              (0, H.jsxs)(`span`, {
                                className: `block`,
                                children: [
                                  t.name,
                                  t.isActive === !1 &&
                                    (0, H.jsx)(`span`, {
                                      className: `ml-2 inline-block align-middle`,
                                      children: (0, H.jsx)(u, { tone: `neutral`, label: e(`common.inactive`) }),
                                    }),
                                ],
                              }),
                              t.taxCode &&
                                (0, H.jsx)(`span`, {
                                  className: `num block text-caption font-normal text-muted-foreground`,
                                  children: t.taxCode,
                                }),
                            ],
                          }),
                          (0, H.jsx)(m, { label: e(`suppliers.contactPerson`), children: t.contact?.contactPerson || `—` }),
                          (0, H.jsx)(m, { label: e(`common.phone`), className: `num`, children: t.contact?.phone || `—` }),
                          (0, H.jsx)(m, {
                            label: e(`common.email`),
                            className: `max-w-64 truncate text-muted-foreground`,
                            children: t.contact?.email || `—`,
                          }),
                          T &&
                            (0, H.jsx)(m, {
                              actions: !0,
                              children: (0, H.jsx)(P, {
                                subject: t.name ?? ``,
                                onEdit: () => j(t),
                                onDelete: () => z(t),
                                onActivate: t.isActive === !1 ? () => void Y(t) : void 0,
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
            (0, H.jsx)(F, { page: q.page, pageSize: q.data.pageSize, total: q.data.total, onPageChange: q.setPage }),
          ],
        }),
      A &&
        (0, H.jsx)(U, {
          supplier: A === `new` ? null : A,
          onClose: () => j(null),
          onSave: async (t) => {
            ;(A === `new` ? await B.create(l, t) : await B.update(l, A.id ?? ``, t), J(), x.success(e(`common.saved`)), j(null))
          },
        }),
      M &&
        (0, H.jsx)(N, {
          subject: M.name ?? ``,
          previewKey: [`suppliers`, l, M.id],
          preview: B.lifecycle(l, M.id ?? ``).preview,
          remove: B.lifecycle(l, M.id ?? ``).remove,
          onClose: () => z(null),
          onDone: J,
        }),
    ],
  })
}
export { W as SuppliersPage }
