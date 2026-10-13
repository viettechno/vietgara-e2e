import { At as e, Dt as t, Et as n, L as r, M as i, N as a, Ot as o, P as s, R as c, S as l } from './api-lC4u2sZi.js'
import { t as ee } from './useMutation-YmV9sVwE.js'
import { t as te } from './rotate-ccw-LOO4idQV.js'
import { t as ne } from './Choice-C8tAQzDN.js'
import { n as u, t as d } from './Modal-BAMT8Cnj.js'
import { a as f, i as p, n as m, o as h, r as g, s as re } from './Table-dqUq80Ez.js'
import {
  C as _,
  Ct as v,
  D as ie,
  F as y,
  J as b,
  M as x,
  N as S,
  P as ae,
  S as C,
  U as w,
  V as oe,
  W as T,
  j as E,
} from './index-CbGLOUZk.js'
import { t as D } from './PageHeader-HSPIRw-a.js'
import { t as O } from './Crumbs-CL4a3zqe.js'
import { a as k, i as A, r as j } from './api-Da8Ubin5.js'
var M = e(o(), 1),
  se = new Set([`quote`, `repair_order`, `inventory`, `billing`, `report`])
function N(e) {
  let t = new Map()
  for (let { permission: n, module: r = ``, action: i } of e) {
    if (!n) continue
    let e = t.get(r) ?? { module: r }
    ;(i === `read` ? (e.read = n) : i === `write` && (e.write = n), t.set(r, e))
  }
  return [...t.values()]
}
function P(e, t, n, r) {
  let i = new Set(e)
  return (r ? (i.add(n), n === t.write && t.read && i.add(t.read)) : (i.delete(n), n === t.read && t.write && i.delete(t.write)), i)
}
function F(e, t) {
  let n = new Set(e)
  for (let e of t) e.write && e.read && n.has(e.write) && n.add(e.read)
  return n
}
function I(e, t) {
  let n = 0
  for (let r of e) t.has(r) || n++
  for (let r of t) e.has(r) || n++
  return n
}
var L = t()
function R(e, t) {
  return { name: e?.name ?? ``, description: e?.description ?? ``, permissions: F(e?.permissions ?? [], t) }
}
function z() {
  let { roleId: e } = y(),
    t = v({ queryKey: k, queryFn: A.list }),
    n = v({ queryKey: j, queryFn: A.permissions, staleTime: 1 / 0 })
  if (!t.data || !n.data) {
    let e = t.error ? t : n
    return (0, L.jsx)(i, {
      children: (0, L.jsx)(C, { isLoading: t.isLoading || n.isLoading, error: e.error, onRetry: () => void e.refetch() }),
    })
  }
  let r = e ? t.data.find((t) => t.id === e) : null
  return r === void 0
    ? (0, L.jsx)(E, { to: `/roles`, replace: !0 })
    : (0, L.jsx)(B, { role: r, roles: t.data, rows: N(n.data) }, e ?? `new`)
}
function B({ role: e, roles: t, rows: o }) {
  let { t: v } = l(),
    y = n(),
    C = ae(),
    E = S(),
    [j, N] = (0, M.useState)(() => R(e, o)),
    [z, B] = (0, M.useState)(j.name),
    [V, H] = (0, M.useState)(j.description),
    [U, W] = (0, M.useState)(j.permissions),
    [G, K] = (0, M.useState)(() => (E.state?.created ? v(`roles.editor.created`) : ``)),
    q = (0, M.useRef)(!1),
    J = I(U, j.permissions) + Number(z.trim() !== j.name) + Number(V.trim() !== j.description),
    Y = J > 0,
    X = x(({ currentLocation: e, nextLocation: t }) => Y && !q.current && e.pathname !== t.pathname)
  ;(0, M.useEffect)(() => {
    if (!Y) return
    let e = (e) => e.preventDefault()
    return (window.addEventListener(`beforeunload`, e), () => window.removeEventListener(`beforeunload`, e))
  }, [Y])
  let Z = ee({
      mutationFn: () => {
        let t = { name: z.trim(), description: V.trim(), permissions: [...U] }
        return e ? A.update(e.id ?? ``, t) : A.create(t)
      },
      onSuccess: async (t) => {
        if ((await y.invalidateQueries({ queryKey: k }), !e)) {
          ;((q.current = !0), C(`/roles/${t.id}/edit`, { replace: !0, state: { created: !0 } }))
          return
        }
        let n = R(t, o)
        ;(N(n), B(n.name), H(n.description), W(n.permissions), K(v(`common.saved`)))
      },
    }),
    ce = (e, t, n) => {
      ;(W((r) => P(r, e, t, n)), K(``))
    },
    le = () => {
      ;(B(j.name), H(j.description), W(j.permissions))
    },
    ue = (e) => {
      ;(e.preventDefault(), Z.mutate())
    },
    Q = e?.groupCount ?? 0,
    $ = e?.isDefault && e.defaultPermissions?.length ? F(e.defaultPermissions, o) : null
  return (0, L.jsxs)(i, {
    children: [
      (0, L.jsx)(D, {
        breadcrumb: (0, L.jsx)(O, {
          items: [{ label: v(`roles.editor.breadcrumb`), to: `/roles` }, { label: e ? e.name : v(`roles.createTitle`) }],
        }),
        title: v(e ? `roles.editTitle` : `roles.createTitle`),
        description: v(`roles.editor.description`),
        action:
          e &&
          (0, L.jsxs)(`div`, {
            className: `flex items-center gap-2`,
            children: [
              (0, L.jsx)(`label`, {
                htmlFor: `role-picker`,
                className: `whitespace-nowrap text-body text-muted-foreground`,
                children: v(`roles.editor.selectRole`),
              }),
              (0, L.jsx)(T, {
                id: `role-picker`,
                wrapperClassName: `min-w-44`,
                value: e.id,
                onChange: (e) => C(`/roles/${e.target.value}/edit`),
                children: t.map((e) => (0, L.jsx)(`option`, { value: e.id, children: e.name }, e.id)),
              }),
            ],
          }),
      }),
      G && !Y && (0, L.jsx)(_, { tone: `success`, title: G }),
      Z.error && (0, L.jsx)(_, { tone: `error`, title: ie(v, Z.error) }),
      (0, L.jsxs)(`form`, {
        className: `flex flex-col gap-6`,
        onSubmit: ue,
        children: [
          (0, L.jsx)(a, {
            children: (0, L.jsxs)(s, {
              className: `grid gap-4 md:grid-cols-2`,
              children: [
                (0, L.jsx)(b, {
                  label: v(`common.name`),
                  required: !0,
                  children: (0, L.jsx)(w, { required: !0, maxLength: 100, value: z, onChange: (e) => B(e.target.value) }),
                }),
                (0, L.jsx)(b, {
                  label: v(`common.description`),
                  children: (0, L.jsx)(w, { maxLength: 500, value: V, onChange: (e) => H(e.target.value) }),
                }),
              ],
            }),
          }),
          e &&
            (0, L.jsxs)(`div`, {
              className: `flex flex-wrap items-center justify-between gap-3`,
              children: [
                (0, L.jsx)(`p`, {
                  className: `text-body text-muted-foreground`,
                  children: Q ? v(`roles.editor.impact`, { count: Q }) : v(`roles.editor.impactNone`),
                }),
                $ &&
                  (0, L.jsxs)(c, {
                    variant: `outline`,
                    size: `sm`,
                    title: v(`roles.editor.resetHint`),
                    onClick: () => {
                      $ && (W($), K(``))
                    },
                    disabled: I(U, $) === 0 || Z.isPending,
                    children: [(0, L.jsx)(te, { 'aria-hidden': !0 }), ` `, v(`roles.editor.resetDefault`)],
                  }),
              ],
            }),
          (0, L.jsx)(a, {
            children: (0, L.jsxs)(m, {
              stack: !1,
              caption: v(`roles.title`),
              children: [
                (0, L.jsx)(f, {
                  children: (0, L.jsxs)(`tr`, {
                    children: [
                      (0, L.jsx)(h, { children: v(`roles.editor.module`) }),
                      (0, L.jsx)(h, { children: v(`roles.editor.read`) }),
                      (0, L.jsx)(h, { children: v(`roles.editor.write`) }),
                    ],
                  }),
                }),
                (0, L.jsx)(g, {
                  children: o.map((e) => {
                    let t = se.has(e.module)
                    return (0, L.jsxs)(
                      re,
                      {
                        className: t ? `text-muted-foreground` : void 0,
                        children: [
                          (0, L.jsx)(`th`, {
                            scope: `row`,
                            className: `min-w-40 px-4 py-2.5 text-left align-middle text-body font-medium`,
                            children: (0, L.jsxs)(`span`, {
                              className: `inline-flex flex-wrap items-center gap-2`,
                              children: [v(`roles.modules.${e.module}`), t && (0, L.jsx)(oe, { children: v(`roles.editor.comingSoon`) })],
                            }),
                          }),
                          [e.read, e.write].map((t, n) =>
                            (0, L.jsx)(
                              p,
                              {
                                className: `py-2.5`,
                                children: t
                                  ? (0, L.jsx)(ne, {
                                      checked: U.has(t),
                                      onChange: (n) => ce(e, t, n.target.checked),
                                      label: v(`permission.${t}`),
                                      wrapperClassName: `items-center`,
                                    })
                                  : (0, L.jsxs)(`span`, {
                                      className: `text-muted-foreground`,
                                      title: v(`roles.editor.none`),
                                      children: [`—`, (0, L.jsx)(`span`, { className: `sr-only`, children: v(`roles.editor.none`) })],
                                    }),
                              },
                              n,
                            ),
                          ),
                        ],
                      },
                      e.module,
                    )
                  }),
                }),
              ],
            }),
          }),
          (0, L.jsxs)(r, {
            children: [
              (0, L.jsx)(`span`, {
                className: `text-body text-muted-foreground`,
                'aria-live': `polite`,
                children: Y ? v(`roles.editor.changes`, { count: J }) : v(`roles.editor.noChanges`),
              }),
              (0, L.jsxs)(`div`, {
                className: `flex gap-2`,
                children: [
                  (0, L.jsx)(c, { variant: `outline`, onClick: le, disabled: !Y || Z.isPending, children: v(`roles.editor.undo`) }),
                  (0, L.jsx)(c, {
                    type: `submit`,
                    variant: `primary`,
                    disabled: !Y || !z.trim(),
                    loading: Z.isPending,
                    children: Z.isPending ? v(`common.saving`) : v(`common.save`),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      X.state === `blocked` &&
        (0, L.jsx)(d, {
          title: v(`roles.editor.discardTitle`),
          description: v(`roles.editor.discardBody`),
          onClose: () => X.reset(),
          children: (0, L.jsxs)(u, {
            children: [
              (0, L.jsx)(c, { variant: `outline`, onClick: () => X.reset(), children: v(`common.cancel`) }),
              (0, L.jsx)(c, { variant: `destructive`, onClick: () => X.proceed(), children: v(`roles.editor.discard`) }),
            ],
          }),
        }),
    ],
  })
}
export { z as RoleEditPage }
