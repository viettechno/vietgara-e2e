import { At as e, Dt as t, Et as n, I as r, M as i, N as a, Ot as o, R as s, S as c } from './api-lC4u2sZi.js'
import { t as l } from './pencil-DC9AcF2N.js'
import { t as u } from './plus-CTDUdFcD.js'
import { t as d } from './trash-DZQxI2eA.js'
import { a as f, i as p, n as m, o as h, r as g, s as _ } from './Table-dqUq80Ez.js'
import { A as v, Ct as y, I as b, P as x, S, V as C, X as w, f as T, ht as E } from './index-CbGLOUZk.js'
import { t as D } from './PageHeader-HSPIRw-a.js'
import { n as O } from './form-Bpp5E52a.js'
import { t as k } from './FormModal-O5Cwhy1v.js'
import { t as A } from './RowActions-Ubkh3T0m.js'
import { t as j } from './ConfirmDialog-2Cqs5W6F.js'
import { a as M, i as N, n as P, t as F } from './api-Da8Ubin5.js'
var I = e(o(), 1),
  L = t()
function R() {
  let { t: e } = c(),
    t = x(),
    o = n(),
    { activeGarage: R, isOwner: z } = T(),
    B = R?.id ?? ``,
    V = y({ queryKey: M, queryFn: N.list }),
    H = y({ queryKey: P(B), queryFn: () => F.list(B), enabled: !!B && z }),
    [U, W] = (0, I.useState)(null),
    [G, K] = (0, I.useState)(null),
    q = async (t) => {
      let n = { name: O(t, `name`), description: O(t, `description`), roleId: O(t, `roleId`) }
      ;(U === `new` ? await F.create(B, n) : U && (await F.update(B, U.id ?? ``, n)),
        await o.invalidateQueries({ queryKey: P(B) }),
        await o.invalidateQueries({ queryKey: M }),
        b.success(e(`common.saved`)),
        W(null))
    },
    J = async () => {
      ;(G?.kind === `role` && (await N.remove(G.role.id ?? ``)),
        G?.kind === `group` && (await F.remove(B, G.group.id ?? ``)),
        await o.invalidateQueries({ queryKey: M }),
        await o.invalidateQueries({ queryKey: P(B) }))
    }
  return (0, L.jsxs)(i, {
    children: [
      (0, L.jsx)(D, {
        title: e(`roles.title`),
        description: e(`roles.description`),
        action: (0, L.jsx)(s, {
          asChild: !0,
          variant: `primary`,
          children: (0, L.jsxs)(v, { to: `/roles/new`, children: [(0, L.jsx)(u, { 'aria-hidden': !0 }), ` `, e(`roles.new`)] }),
        }),
      }),
      (0, L.jsx)(S, { isLoading: V.isLoading, error: V.error, onRetry: () => void V.refetch() }),
      V.data &&
        (0, L.jsx)(r, {
          title: e(`roles.roles`),
          children: (0, L.jsx)(a, {
            children: (0, L.jsx)(`ul`, {
              className: `divide-y divide-border`,
              children: V.data.map((n) =>
                (0, L.jsxs)(
                  `li`,
                  {
                    className: `flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4`,
                    children: [
                      (0, L.jsx)(`span`, {
                        className: `grid size-9 shrink-0 place-items-center rounded-md bg-primary-subtle text-primary-subtle-foreground`,
                        children: (0, L.jsx)(E, { className: `size-[18px]`, 'aria-hidden': !0 }),
                      }),
                      (0, L.jsxs)(`div`, {
                        className: `min-w-0 flex-1 basis-64`,
                        children: [
                          (0, L.jsxs)(`h3`, {
                            className: `flex flex-wrap items-center gap-2 text-body font-medium`,
                            children: [n.name, ` `, n.isDefault && (0, L.jsx)(C, { children: e(`roles.default`) })],
                          }),
                          n.description &&
                            (0, L.jsx)(`p`, { className: `mt-0.5 text-body text-muted-foreground`, children: n.description }),
                          (0, L.jsxs)(`p`, {
                            className: `mt-0.5 text-caption text-muted-foreground`,
                            children: [
                              e(`staff.permissions`, { count: n.permissions?.length ?? 0 }),
                              ` ·`,
                              ` `,
                              e(`roles.usedBy`, { count: n.groupCount ?? 0 }),
                            ],
                          }),
                        ],
                      }),
                      (0, L.jsxs)(`div`, {
                        className: `flex gap-0.5`,
                        children: [
                          (0, L.jsx)(w, {
                            size: `icon-sm`,
                            label: `${e(`common.edit`)}: ${n.name}`,
                            icon: (0, L.jsx)(l, { 'aria-hidden': !0 }),
                            onClick: () => t(`/roles/${n.id}/edit`),
                          }),
                          (0, L.jsx)(w, {
                            size: `icon-sm`,
                            label: `${e(`common.delete`)}: ${n.name}`,
                            icon: (0, L.jsx)(d, { 'aria-hidden': !0 }),
                            onClick: () => K({ kind: `role`, role: n }),
                          }),
                        ],
                      }),
                    ],
                  },
                  n.id,
                ),
              ),
            }),
          }),
        }),
      z &&
        R &&
        (0, L.jsxs)(r, {
          title: e(`roles.groups`, { garage: R.name }),
          actions: (0, L.jsxs)(s, {
            variant: `outline`,
            size: `sm`,
            onClick: () => W(`new`),
            children: [(0, L.jsx)(u, { 'aria-hidden': !0 }), ` `, e(`roles.newGroup`)],
          }),
          children: [
            (0, L.jsx)(S, { isLoading: H.isLoading, error: H.error }),
            H.data &&
              (0, L.jsx)(a, {
                children: (0, L.jsxs)(m, {
                  caption: e(`roles.groups`, { garage: R.name }),
                  children: [
                    (0, L.jsx)(f, {
                      children: (0, L.jsxs)(`tr`, {
                        children: [
                          (0, L.jsx)(h, { children: e(`common.name`) }),
                          (0, L.jsx)(h, { children: e(`roles.role`) }),
                          (0, L.jsx)(h, { numeric: !0, children: e(`staff.members`) }),
                          (0, L.jsx)(h, {
                            className: `w-px`,
                            children: (0, L.jsx)(`span`, { className: `sr-only`, children: e(`common.actions`) }),
                          }),
                        ],
                      }),
                    }),
                    (0, L.jsx)(g, {
                      children: H.data.map((t) =>
                        (0, L.jsxs)(
                          _,
                          {
                            children: [
                              (0, L.jsxs)(p, {
                                primary: !0,
                                label: e(`common.name`),
                                className: `py-2`,
                                children: [
                                  (0, L.jsx)(`span`, { className: `block`, children: t.name }),
                                  t.description &&
                                    (0, L.jsx)(`span`, {
                                      className: `block text-caption font-normal text-muted-foreground`,
                                      children: t.description,
                                    }),
                                ],
                              }),
                              (0, L.jsx)(p, { label: e(`roles.role`), children: t.roleName }),
                              (0, L.jsx)(p, {
                                numeric: !0,
                                label: e(`staff.members`),
                                children: e(`roles.members`, { count: t.memberCount ?? 0 }),
                              }),
                              (0, L.jsx)(p, {
                                actions: !0,
                                children: (0, L.jsx)(A, {
                                  subject: t.name ?? ``,
                                  onEdit: () => W(t),
                                  onDelete: () => K({ kind: `group`, group: t }),
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
              }),
          ],
        }),
      U &&
        (0, L.jsx)(k, {
          title: e(`roles.groupTitle`),
          fields: [
            { name: `name`, label: e(`common.name`), required: !0, maxLength: 100 },
            { name: `description`, label: e(`common.description`), type: `textarea`, maxLength: 500 },
            {
              name: `roleId`,
              label: e(`roles.role`),
              type: `select`,
              required: !0,
              options: (V.data ?? []).map((e) => ({ value: e.id ?? ``, label: e.name ?? `` })),
            },
          ],
          values: U === `new` ? {} : { ...U },
          submitLabel: e(`common.save`),
          onClose: () => W(null),
          onSave: q,
        }),
      G &&
        (0, L.jsx)(j, {
          title: e(`common.delete`),
          description:
            G.kind === `role` ? e(`roles.deleteConfirm`, { name: G.role.name }) : e(`roles.deleteGroupConfirm`, { name: G.group.name }),
          confirmLabel: e(`common.delete`),
          danger: !0,
          onClose: () => K(null),
          onConfirm: J,
        }),
    ],
  })
}
export { R as RolesPage }
