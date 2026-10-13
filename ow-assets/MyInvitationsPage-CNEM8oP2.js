import { At as e, Dt as t, Et as n, M as r, N as i, Ot as a, R as o, S as s } from './api-lC4u2sZi.js'
import { t as c } from './useMutation-YmV9sVwE.js'
import {
  C as l,
  Ct as u,
  D as d,
  F as f,
  P as p,
  S as m,
  _ as h,
  d as g,
  f as _,
  ft as v,
  u as y,
  vt as b,
  xt as x,
} from './index-CbGLOUZk.js'
import { t as S } from './PageHeader-HSPIRw-a.js'
import { t as C } from './Crumbs-CL4a3zqe.js'
import { t as w } from './EmptyState-B6htI9zs.js'
var T = e(a(), 1),
  E = t()
function D() {
  let { t: e } = s(),
    { invitationId: t } = f(),
    n = u({ queryKey: g, queryFn: () => y.list() }),
    a = u({ queryKey: [...g, t], queryFn: () => y.get(t ?? ``), enabled: !!t, retry: !1 }),
    o = t ? (a.data ? [a.data] : []) : (n.data ?? []),
    c = t ? a : n
  return (0, E.jsxs)(r, {
    children: [
      (0, E.jsx)(S, {
        breadcrumb: t
          ? (0, E.jsx)(C, { items: [{ label: e(`nav.invitations`), to: `/invitations` }, { label: e(`invitations.title`) }] })
          : void 0,
        title: e(`invitations.title`),
        description: e(`invitations.description`),
      }),
      t && a.error
        ? (0, E.jsx)(l, { tone: `error`, title: e(`invitations.notFound`) })
        : (0, E.jsx)(m, { isLoading: c.isLoading, error: c.error, onRetry: () => void c.refetch() }),
      !c.isLoading &&
        !c.error &&
        o.length === 0 &&
        (0, E.jsx)(i, { children: (0, E.jsx)(w, { message: e(`invitations.empty`), compact: !0 }) }),
      o.length > 0 &&
        (0, E.jsx)(i, {
          children: (0, E.jsx)(`ul`, {
            className: `divide-y divide-border`,
            children: o.map((e) => (0, E.jsx)(O, { invitation: e }, e.id)),
          }),
        }),
    ],
  })
}
function O({ invitation: e }) {
  let { t } = s(),
    r = p(),
    i = n(),
    { selectGarage: a, refresh: l } = _(),
    [u, f] = (0, T.useState)(``),
    m = c({
      mutationFn: (t) => (t ? y.accept(e.id ?? ``) : y.decline(e.id ?? ``)),
      onSuccess: async (n, o) => {
        ;(await i.invalidateQueries({ queryKey: g }),
          o && (await l(), a(n.garageId ?? ``), f(t(`invitations.accepted`, { garage: e.garageName })), r(`/garages`)))
      },
    }),
    S = e.status === `INVITATION_STATUS_PENDING`
  return (0, E.jsxs)(`li`, {
    className: `flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4`,
    children: [
      (0, E.jsx)(`span`, {
        className: `grid size-10 shrink-0 place-items-center rounded-md bg-primary-subtle text-primary-subtle-foreground`,
        children: (0, E.jsx)(b, { className: `size-5`, 'aria-hidden': !0 }),
      }),
      (0, E.jsxs)(`div`, {
        className: `min-w-0 flex-1 basis-64`,
        children: [
          (0, E.jsx)(`h2`, {
            className: `text-body font-medium`,
            children: t(`invitations.from`, { inviter: e.invitedByName, garage: e.garageName }),
          }),
          (0, E.jsxs)(`p`, {
            className: `mt-0.5 text-body text-muted-foreground`,
            children: [
              t(`invitationStatus.${e.status ?? `INVITATION_STATUS_UNSPECIFIED`}`),
              S && ` · ${t(`staff.expiresAt`, { date: h(e.expiresAt) })}`,
            ],
          }),
          m.error &&
            (0, E.jsx)(`p`, { role: `alert`, className: `mt-1 text-body text-destructive-subtle-foreground`, children: d(t, m.error) }),
          u && (0, E.jsx)(`p`, { role: `status`, className: `mt-1 text-body text-success-subtle-foreground`, children: u }),
        ],
      }),
      S &&
        (0, E.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, E.jsxs)(o, {
              variant: `primary`,
              loading: m.isPending,
              onClick: () => m.mutate(!0),
              children: [(0, E.jsx)(x, { 'aria-hidden': !0 }), ` `, t(`invitations.accept`)],
            }),
            (0, E.jsxs)(o, {
              variant: `outline`,
              disabled: m.isPending,
              onClick: () => m.mutate(!1),
              children: [(0, E.jsx)(v, { 'aria-hidden': !0 }), ` `, t(`invitations.decline`)],
            }),
          ],
        }),
    ],
  })
}
export { D as MyInvitationsPage }
