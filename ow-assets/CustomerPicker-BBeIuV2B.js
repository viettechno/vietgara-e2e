import { At as e, Dt as t, Et as n, O as r, Ot as i, R as a, S as o, Y as s, q as c } from './api-lC4u2sZi.js'
import { n as l, r as u, t as d } from './CustomerLinkDialog-CTxNTgXJ.js'
import { Ct as f, X as p, ft as m, gt as h, q as g } from './index-CbGLOUZk.js'
import { a as _, n as v, o as y, r as b, t as x } from './LinkStatusBadge-EfUbWhIc.js'
import { t as S } from './useDebouncedValue-BuAekAoL.js'
var C = c(`user-plus`, [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
    [`line`, { x1: `19`, x2: `19`, y1: `8`, y2: `14`, key: `1bvyxn` }],
    [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11`, key: `1shjgl` }],
  ]),
  w = e(i(), 1),
  T = t()
function E({ id: e, garageId: t, selected: i, onSelect: c, disabled: E, canWrite: D }) {
  let { t: O } = o(),
    k = n(),
    A = (0, w.useId)(),
    j = (0, w.useRef)(null),
    [M, N] = (0, w.useState)(``),
    [P, F] = (0, w.useState)(!1),
    [I, L] = (0, w.useState)(!1),
    [R, z] = (0, w.useState)(null),
    B = S(M, 250).trim(),
    V = f({ queryKey: [...y(t), `picker`, B], queryFn: () => _.list(t, { query: B, page: 1 }), enabled: P && !!t })
  ;(0, w.useEffect)(() => {
    if (!P) return
    let e = (e) => {
      j.current?.contains(e.target) || F(!1)
    }
    return (document.addEventListener(`mousedown`, e), () => document.removeEventListener(`mousedown`, e))
  }, [P])
  let H = (e) => {
      ;(c(e), N(``), F(!1))
    },
    U = () => void k.invalidateQueries({ queryKey: y(t) }),
    W = async (e) => {
      U()
      let n = await _.get(t, e)
      i?.id === e && c(n)
    },
    G = V.data?.items ?? []
  return (0, T.jsxs)(`div`, {
    className: `relative`,
    ref: j,
    children: [
      i
        ? (0, T.jsxs)(`div`, {
            className: `flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5`,
            children: [
              (0, T.jsxs)(`span`, {
                id: e,
                className: `min-w-0 flex-1 truncate font-medium`,
                children: [
                  i.fullName,
                  i.phone && (0, T.jsxs)(`span`, { className: `font-normal text-muted-foreground`, children: [` · `, i.phone] }),
                ],
              }),
              (0, T.jsx)(x, { status: i.linkStatus }),
              D &&
                !E &&
                v(i) &&
                (0, T.jsxs)(a, {
                  variant: `outline`,
                  size: `sm`,
                  onClick: () => z(i),
                  children: [(0, T.jsx)(l, { 'aria-hidden': !0 }), ` `, O(`customers.link.request`)],
                }),
              D &&
                !E &&
                i.linkStatus === `CUSTOMER_USER_LINK_STATUS_REQUESTED` &&
                (0, T.jsxs)(a, {
                  variant: `outline`,
                  size: `sm`,
                  onClick: () => z(i),
                  children: [(0, T.jsx)(u, { 'aria-hidden': !0 }), ` `, O(`customers.link.enterCode`)],
                }),
              !E &&
                (0, T.jsx)(p, {
                  size: `icon-sm`,
                  label: `${O(`common.change`)}: ${i.fullName}`,
                  icon: (0, T.jsx)(m, { 'aria-hidden': !0 }),
                  onClick: () => c(null),
                }),
            ],
          })
        : (0, T.jsxs)(T.Fragment, {
            children: [
              (0, T.jsx)(h, {
                className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground`,
                'aria-hidden': !0,
              }),
              (0, T.jsx)(`input`, {
                id: e,
                type: `text`,
                role: `combobox`,
                'aria-expanded': P,
                'aria-controls': A,
                'aria-autocomplete': `list`,
                autoComplete: `off`,
                value: M,
                disabled: E,
                placeholder: O(`customers.picker.placeholder`),
                className: s(g, `h-9 pl-9`),
                onFocus: () => F(!0),
                onChange: (e) => {
                  ;(N(e.target.value), F(!0))
                },
                onKeyDown: (e) => {
                  e.key === `Escape` && P && (e.stopPropagation(), F(!1))
                },
              }),
              P &&
                (0, T.jsxs)(`div`, {
                  id: A,
                  className: `absolute z-40 mt-1.5 max-h-96 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md`,
                  children: [
                    V.isLoading &&
                      (0, T.jsxs)(`div`, {
                        className: `flex flex-col gap-2 p-2`,
                        'aria-busy': `true`,
                        children: [(0, T.jsx)(r, { className: `h-4 w-2/3` }), (0, T.jsx)(r, { className: `h-4 w-1/2` })],
                      }),
                    !V.isLoading &&
                      G.length === 0 &&
                      (0, T.jsx)(`p`, { className: `px-3 py-2.5 text-body text-muted-foreground`, children: O(`customers.picker.none`) }),
                    (0, T.jsx)(`ul`, {
                      children: G.map((e) =>
                        (0, T.jsxs)(
                          `li`,
                          {
                            className: `flex flex-wrap items-center gap-2 rounded-md px-3 py-2 hover:bg-accent`,
                            children: [
                              (0, T.jsxs)(`span`, {
                                className: `flex min-w-0 flex-1 flex-col`,
                                children: [
                                  (0, T.jsx)(`span`, { className: `truncate text-body font-medium`, children: e.fullName }),
                                  (0, T.jsx)(`span`, {
                                    className: `truncate text-caption text-muted-foreground`,
                                    children: [e.phone, e.email].filter(Boolean).join(` · `) || `—`,
                                  }),
                                ],
                              }),
                              (0, T.jsx)(x, { status: e.linkStatus }),
                              D &&
                                v(e) &&
                                (0, T.jsxs)(a, {
                                  variant: `ghost`,
                                  size: `sm`,
                                  onClick: () => z(e),
                                  children: [(0, T.jsx)(l, { 'aria-hidden': !0 }), ` `, O(`customers.link.request`)],
                                }),
                              D &&
                                e.linkStatus === `CUSTOMER_USER_LINK_STATUS_REQUESTED` &&
                                (0, T.jsxs)(a, {
                                  variant: `ghost`,
                                  size: `sm`,
                                  onClick: () => z(e),
                                  children: [(0, T.jsx)(u, { 'aria-hidden': !0 }), ` `, O(`customers.link.enterCode`)],
                                }),
                              (0, T.jsx)(a, { variant: `outline`, size: `sm`, onClick: () => H(e), children: O(`customers.picker.use`) }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    }),
                    D &&
                      (0, T.jsx)(`div`, {
                        className: `border-t border-border p-1 pt-1.5`,
                        children: (0, T.jsxs)(a, {
                          variant: `ghost`,
                          size: `sm`,
                          className: `w-full justify-start`,
                          onClick: () => L(!0),
                          children: [
                            (0, T.jsx)(C, { 'aria-hidden': !0 }),
                            B ? O(`customers.picker.createNamed`, { name: B }) : O(`customers.picker.create`),
                          ],
                        }),
                      }),
                  ],
                }),
            ],
          }),
      I &&
        (0, T.jsx)(b, {
          customer: null,
          initialName: B,
          onClose: () => L(!1),
          onSave: async (e) => {
            let n = await _.create(t, e)
            ;(U(), L(!1), H(n))
          },
        }),
      R &&
        (0, T.jsx)(d, {
          garageId: t,
          customerId: R.id ?? ``,
          customerName: R.fullName ?? ``,
          waiting: R.linkStatus === `CUSTOMER_USER_LINK_STATUS_REQUESTED`,
          onClose: () => z(null),
          onLinked: () => void 0,
          onChanged: () => void W(R.id ?? ``),
        }),
    ],
  })
}
export { E as t }
