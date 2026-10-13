import { At as e, Dt as t, Et as n, I as r, M as i, N as a, Ot as o, R as s, S as c, q as l } from './api-lC4u2sZi.js'
import { t as u } from './useMutation-YmV9sVwE.js'
import { t as d } from './ban-DfdGjpju.js'
import { t as f } from './StatusBadge-DknRod1K.js'
import { t as p } from './rotate-ccw-LOO4idQV.js'
import { t as m } from './trash-DZQxI2eA.js'
import { t as h } from './Choice-C8tAQzDN.js'
import { n as g, t as _ } from './Modal-BAMT8Cnj.js'
import { a as v, i as y, n as b, o as x, r as S, s as C } from './Table-dqUq80Ez.js'
import {
  B as w,
  C as T,
  Ct as E,
  D,
  I as O,
  S as k,
  U as A,
  V as j,
  X as M,
  _ as ee,
  f as N,
  gt as P,
  mt as F,
  x as I,
} from './index-CbGLOUZk.js'
import { t as L } from './PageHeader-HSPIRw-a.js'
import { r as R } from './form-Bpp5E52a.js'
import { t as z } from './EmptyState-B6htI9zs.js'
import { t as B } from './ConfirmDialog-2Cqs5W6F.js'
import { n as V, r as H, t as U } from './api-D3jc5Ec0.js'
import { n as W, t as G } from './api-Da8Ubin5.js'
var K = l(`mail-plus`, [
    [`path`, { d: `M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8`, key: `12jkf8` }],
    [`path`, { d: `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7`, key: `1ocrg3` }],
    [`path`, { d: `M19 16v6`, key: `tddt3s` }],
    [`path`, { d: `M16 19h6`, key: `xwg31i` }],
  ]),
  q = l(`user-minus`, [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
    [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11`, key: `1shjgl` }],
  ]),
  J = e(o(), 1),
  Y = t()
function X({ initials: e, size: t }) {
  return (0, Y.jsx)(w, { initials: e, size: t })
}
function Z() {
  let { t: e } = c(),
    t = n(),
    { activeGarage: o, can: l } = N(),
    u = o?.id ?? ``,
    h = l(`PERMISSION_STAFF_WRITE`),
    g = E({ queryKey: H(u), queryFn: () => V.list(u), enabled: !!u }),
    _ = E({ queryKey: W(u), queryFn: () => G.list(u), enabled: !!u }),
    w = E({ queryKey: U(u), queryFn: () => V.invitations(u), enabled: !!u && h }),
    [T, D] = (0, J.useState)(!1),
    [O, A] = (0, J.useState)(null),
    [P, R] = (0, J.useState)(null)
  if (!u) return (0, Y.jsx)(z, { message: e(`common.selectGarageFirst`) })
  let Z = () => {
      ;(t.invalidateQueries({ queryKey: H(u) }), t.invalidateQueries({ queryKey: U(u) }), t.invalidateQueries({ queryKey: W(u) }))
    },
    $ = (t) =>
      (t ?? [])
        .map((e) => _.data?.find((t) => t.id === e)?.name)
        .filter(Boolean)
        .join(`, `) || e(`staff.noGroups`)
  return (0, Y.jsxs)(i, {
    children: [
      (0, Y.jsx)(L, {
        title: e(`staff.title`),
        description: e(`staff.description`),
        action:
          h &&
          (0, Y.jsxs)(s, {
            variant: `primary`,
            onClick: () => D(!0),
            children: [(0, Y.jsx)(K, { 'aria-hidden': !0 }), ` `, e(`staff.invite`)],
          }),
      }),
      (0, Y.jsx)(k, { isLoading: g.isLoading, error: g.error, onRetry: () => void g.refetch() }),
      g.data &&
        (0, Y.jsx)(r, {
          title: e(`staff.members`),
          children: (0, Y.jsxs)(a, {
            children: [
              (0, Y.jsxs)(b, {
                caption: e(`staff.members`),
                children: [
                  (0, Y.jsx)(v, {
                    children: (0, Y.jsxs)(`tr`, {
                      children: [
                        (0, Y.jsx)(x, { children: e(`common.name`) }),
                        (0, Y.jsx)(x, { children: e(`staff.groups`) }),
                        (0, Y.jsx)(x, { children: e(`common.status`) }),
                        (0, Y.jsx)(x, {
                          className: `w-px`,
                          children: (0, Y.jsx)(`span`, { className: `sr-only`, children: e(`common.actions`) }),
                        }),
                      ],
                    }),
                  }),
                  (0, Y.jsx)(S, {
                    children: g.data.map((t) => {
                      let n = t.status !== `STAFF_STATUS_INACTIVE`
                      return (0, Y.jsxs)(
                        C,
                        {
                          children: [
                            (0, Y.jsx)(y, {
                              primary: !0,
                              label: e(`common.name`),
                              className: `py-2`,
                              children: (0, Y.jsxs)(`span`, {
                                className: `flex items-center gap-3`,
                                children: [
                                  (0, Y.jsx)(X, { initials: I(t.fullName) }),
                                  (0, Y.jsxs)(`span`, {
                                    className: `min-w-0 text-left`,
                                    children: [
                                      (0, Y.jsx)(`span`, { className: `block`, children: t.fullName }),
                                      (0, Y.jsx)(`span`, {
                                        className: `block truncate text-caption font-normal text-muted-foreground`,
                                        children: [t.email, t.phone].filter(Boolean).join(` · `),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            (0, Y.jsx)(y, {
                              label: e(`staff.groups`),
                              children: t.owner ? (0, Y.jsx)(j, { tone: `info`, children: e(`staff.owner`) }) : $(t.groupIds),
                            }),
                            (0, Y.jsx)(y, {
                              label: e(`common.status`),
                              children: (0, Y.jsx)(f, {
                                tone: n ? `active` : `neutral`,
                                label: e(n ? `common.active` : `common.inactive`),
                              }),
                            }),
                            (0, Y.jsx)(y, {
                              actions: !0,
                              children:
                                h &&
                                !t.owner &&
                                (0, Y.jsxs)(`span`, {
                                  className: `inline-flex gap-0.5`,
                                  children: [
                                    (0, Y.jsx)(M, {
                                      size: `icon-sm`,
                                      label: `${e(`staff.editGroups`)}: ${t.fullName}`,
                                      icon: (0, Y.jsx)(F, { 'aria-hidden': !0 }),
                                      onClick: () => A(t),
                                    }),
                                    (0, Y.jsx)(M, {
                                      size: `icon-sm`,
                                      label: `${e(n ? `staff.deactivate` : `staff.activate`)}: ${t.fullName}`,
                                      icon: n ? (0, Y.jsx)(d, { 'aria-hidden': !0 }) : (0, Y.jsx)(p, { 'aria-hidden': !0 }),
                                      onClick: () => R({ kind: n ? `deactivate` : `activate`, staff: t }),
                                    }),
                                    (0, Y.jsx)(M, {
                                      size: `icon-sm`,
                                      label: `${e(`staff.remove`)}: ${t.fullName}`,
                                      icon: (0, Y.jsx)(q, { 'aria-hidden': !0 }),
                                      onClick: () => R({ kind: `remove`, staff: t }),
                                    }),
                                  ],
                                }),
                            }),
                          ],
                        },
                        t.id,
                      )
                    }),
                  }),
                ],
              }),
              g.data.length <= 1 &&
                (0, Y.jsx)(`p`, {
                  className: `border-t border-border px-4 py-3 text-body text-muted-foreground`,
                  children: e(`staff.empty`),
                }),
            ],
          }),
        }),
      h &&
        (0, Y.jsxs)(r, {
          title: e(`staff.invitations`),
          children: [
            (0, Y.jsx)(k, { isLoading: w.isLoading, error: w.error, skeleton: `none` }),
            w.data?.length === 0 && (0, Y.jsx)(`p`, { className: `text-body text-muted-foreground`, children: e(`staff.noInvitations`) }),
            w.data &&
              w.data.length > 0 &&
              (0, Y.jsx)(a, {
                children: (0, Y.jsxs)(b, {
                  caption: e(`staff.invitations`),
                  children: [
                    (0, Y.jsx)(v, {
                      children: (0, Y.jsxs)(`tr`, {
                        children: [
                          (0, Y.jsx)(x, { children: e(`common.name`) }),
                          (0, Y.jsx)(x, { children: e(`staff.groups`) }),
                          (0, Y.jsx)(x, { children: e(`common.status`) }),
                          (0, Y.jsx)(x, { children: e(`staff.expires`) }),
                          (0, Y.jsx)(x, {
                            className: `w-px`,
                            children: (0, Y.jsx)(`span`, { className: `sr-only`, children: e(`common.actions`) }),
                          }),
                        ],
                      }),
                    }),
                    (0, Y.jsx)(S, {
                      children: w.data.map((t) =>
                        (0, Y.jsxs)(
                          C,
                          {
                            children: [
                              (0, Y.jsxs)(y, {
                                primary: !0,
                                label: e(`common.name`),
                                className: `py-2`,
                                children: [
                                  (0, Y.jsx)(`span`, { className: `block`, children: t.fullName }),
                                  (0, Y.jsx)(`span`, {
                                    className: `block text-caption font-normal text-muted-foreground`,
                                    children: t.email,
                                  }),
                                ],
                              }),
                              (0, Y.jsx)(y, { label: e(`staff.groups`), children: $(t.groupIds) }),
                              (0, Y.jsx)(y, {
                                label: e(`common.status`),
                                children: (0, Y.jsx)(j, {
                                  tone: t.status === `INVITATION_STATUS_PENDING` ? `warning` : `neutral`,
                                  children: e(`invitationStatus.${t.status ?? `INVITATION_STATUS_UNSPECIFIED`}`),
                                }),
                              }),
                              (0, Y.jsx)(y, {
                                label: e(`staff.expires`),
                                className: `num text-muted-foreground`,
                                children: ee(t.expiresAt),
                              }),
                              (0, Y.jsx)(y, {
                                actions: !0,
                                children:
                                  t.status === `INVITATION_STATUS_PENDING` &&
                                  (0, Y.jsxs)(s, {
                                    variant: `outline`,
                                    size: `sm`,
                                    onClick: () => R({ kind: `revoke`, invitation: t }),
                                    children: [(0, Y.jsx)(m, { 'aria-hidden': !0 }), ` `, e(`staff.revoke`)],
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
      T && (0, Y.jsx)(te, { garageId: u, groups: _.data ?? [], onClose: () => D(!1), onDone: Z }),
      O && (0, Y.jsx)(ne, { garageId: u, staff: O, groups: _.data ?? [], onClose: () => A(null), onDone: Z }),
      P &&
        (0, Y.jsx)(B, {
          title: Q(e, P),
          description: P.kind === `remove` ? e(`staff.removeConfirm`, { name: P.staff.fullName }) : Q(e, P),
          confirmLabel: e(`common.confirm`),
          danger: P.kind !== `activate`,
          onClose: () => R(null),
          onConfirm: async () => {
            P &&
              (P.kind === `revoke`
                ? await V.revoke(u, P.invitation.id ?? ``)
                : P.kind === `remove`
                  ? await V.remove(u, P.staff.id ?? ``)
                  : await V.update(u, P.staff.id ?? ``, {
                      status: P.kind === `activate` ? `STAFF_STATUS_ACTIVE` : `STAFF_STATUS_INACTIVE`,
                    }),
              Z())
          },
        }),
    ],
  })
}
function Q(e, t) {
  switch (t.kind) {
    case `revoke`:
      return `${e(`staff.revoke`)}: ${t.invitation.fullName}`
    case `remove`:
      return e(`staff.remove`)
    case `deactivate`:
      return `${e(`staff.deactivate`)}: ${t.staff.fullName}`
    case `activate`:
      return `${e(`staff.activate`)}: ${t.staff.fullName}`
  }
}
function $({ groups: e, selected: t }) {
  let { t: n } = c()
  return e.length === 0
    ? (0, Y.jsx)(`p`, { className: `text-body text-muted-foreground`, children: n(`staff.noGroupsYet`) })
    : (0, Y.jsxs)(`fieldset`, {
        className: `flex flex-col gap-2.5`,
        children: [
          (0, Y.jsx)(`legend`, { className: `mb-1 text-body font-medium`, children: n(`staff.groups`) }),
          e.map((e) =>
            (0, Y.jsx)(
              h,
              { name: `groupIds`, value: e.id, defaultChecked: t.includes(e.id ?? ``), label: e.name, description: e.roleName },
              e.id,
            ),
          ),
        ],
      })
}
function te({ garageId: e, groups: t, onClose: n, onDone: r }) {
  let { t: i } = c(),
    [a, o] = (0, J.useState)(``),
    l = u({ mutationFn: (t) => V.lookup(e, t) }),
    d = u({
      mutationFn: ({ candidate: t, groupIds: n }) => V.invite(e, t.userId ?? ``, n),
      onSuccess: () => {
        ;(r(), n(), O.success(i(`staff.inviteSent`)))
      },
    }),
    f = l.data,
    p = (e) => {
      ;(e.preventDefault(), d.reset(), l.mutate(a.trim()))
    },
    m = (e) => {
      ;(e.preventDefault(), f && d.mutate({ candidate: f, groupIds: R(new FormData(e.currentTarget), `groupIds`) }))
    },
    h = l.error ?? d.error
  return (0, Y.jsxs)(_, {
    title: i(`staff.inviteTitle`),
    description: i(`staff.inviteDescription`),
    error: h ? D(i, h) : ``,
    onClose: n,
    children: [
      (0, Y.jsxs)(`form`, {
        onSubmit: p,
        className: `flex gap-2`,
        children: [
          (0, Y.jsx)(A, {
            'aria-label': i(`staff.lookup`),
            value: a,
            onChange: (e) => o(e.target.value),
            placeholder: i(`staff.lookup`),
            required: !0,
            autoFocus: !0,
          }),
          (0, Y.jsxs)(s, {
            type: `submit`,
            variant: `outline`,
            loading: l.isPending,
            children: [(0, Y.jsx)(P, { 'aria-hidden': !0 }), ` `, i(`staff.find`)],
          }),
        ],
      }),
      f &&
        (0, Y.jsxs)(`form`, {
          onSubmit: m,
          className: `mt-4 flex flex-col gap-4`,
          children: [
            (0, Y.jsxs)(`div`, {
              className: `flex items-center gap-3 rounded-lg border border-border bg-surface-sunken p-3`,
              children: [
                (0, Y.jsx)(X, { initials: I(f.fullName), size: `lg` }),
                (0, Y.jsxs)(`div`, {
                  className: `min-w-0`,
                  children: [
                    (0, Y.jsx)(`p`, { className: `text-body font-medium`, children: f.fullName }),
                    (0, Y.jsx)(`p`, {
                      className: `truncate text-caption text-muted-foreground`,
                      children: [f.email, f.phone].filter(Boolean).join(` · `),
                    }),
                  ],
                }),
              ],
            }),
            f.membership === `CANDIDATE_MEMBERSHIP_MEMBER` && (0, Y.jsx)(T, { tone: `info`, title: i(`staff.candidateMember`) }),
            f.membership === `CANDIDATE_MEMBERSHIP_INVITED` && (0, Y.jsx)(T, { tone: `info`, title: i(`staff.candidateInvited`) }),
            (!f.membership || f.membership === `CANDIDATE_MEMBERSHIP_NONE`) &&
              (0, Y.jsxs)(Y.Fragment, {
                children: [
                  (0, Y.jsx)($, { groups: t, selected: [] }),
                  (0, Y.jsxs)(g, {
                    children: [
                      (0, Y.jsx)(s, { variant: `outline`, onClick: n, children: i(`common.cancel`) }),
                      (0, Y.jsx)(s, { type: `submit`, variant: `primary`, loading: d.isPending, children: i(`staff.sendInvite`) }),
                    ],
                  }),
                ],
              }),
          ],
        }),
    ],
  })
}
function ne({ garageId: e, staff: t, groups: n, onClose: r, onDone: i }) {
  let { t: a } = c(),
    o = u({
      mutationFn: (n) => V.update(e, t.id ?? ``, { groupIds: n }),
      onSuccess: () => {
        ;(i(), r(), O.success(a(`common.saved`)))
      },
    })
  return (0, Y.jsx)(_, {
    title: a(`staff.editGroupsTitle`, { name: t.fullName }),
    error: o.error ? D(a, o.error) : ``,
    onClose: r,
    children: (0, Y.jsxs)(`form`, {
      onSubmit: (e) => {
        ;(e.preventDefault(), o.mutate(R(new FormData(e.currentTarget), `groupIds`)))
      },
      children: [
        (0, Y.jsx)($, { groups: n, selected: t.groupIds ?? [] }),
        (0, Y.jsxs)(g, {
          children: [
            (0, Y.jsx)(s, { variant: `outline`, onClick: r, children: a(`common.cancel`) }),
            (0, Y.jsx)(s, { type: `submit`, variant: `primary`, loading: o.isPending, children: a(`common.save`) }),
          ],
        }),
      ],
    }),
  })
}
export { Z as StaffPage }
