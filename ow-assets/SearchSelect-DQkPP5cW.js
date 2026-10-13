import { At as e, Dt as t, O as n, Ot as r, S as i, Y as a } from './api-lC4u2sZi.js'
import { X as o, Y as s, ft as c, gt as l, q as u } from './index-CbGLOUZk.js'
import { t as d } from './useDebouncedValue-BuAekAoL.js'
var f = e(r(), 1),
  p = t()
function m({ id: e, placeholder: t, disabled: r, selected: m, onSelect: h, search: g }) {
  let { t: _ } = i(),
    v = s(),
    y = e ?? v.id,
    b = (0, f.useId)(),
    [x, S] = (0, f.useState)(``),
    [C, w] = (0, f.useState)(!1),
    [T, E] = (0, f.useState)([]),
    [D, O] = (0, f.useState)(0),
    [k, A] = (0, f.useState)(null),
    j = d(x, 250),
    M = C && k !== j,
    N = (0, f.useRef)(null)
  ;((0, f.useEffect)(() => {
    if (!C) return
    let e = !1
    return (
      g(j.trim())
        .then((t) => {
          e || (E(t), O(0))
        })
        .catch(() => {
          e || E([])
        })
        .finally(() => {
          e || A(j)
        }),
      () => {
        e = !0
      }
    )
  }, [C, j]),
    (0, f.useEffect)(() => {
      if (!C) return
      let e = (e) => {
        N.current?.contains(e.target) || w(!1)
      }
      return (document.addEventListener(`mousedown`, e), () => document.removeEventListener(`mousedown`, e))
    }, [C]))
  let P = (e) => {
    ;(h(e), S(``), w(!1))
  }
  return m
    ? (0, p.jsxs)(`div`, {
        className: `relative`,
        ref: N,
        children: [
          (0, p.jsx)(`input`, {
            id: e,
            readOnly: !0,
            disabled: r,
            value: m.sublabel ? `${m.label} · ${m.sublabel}` : m.label,
            className: a(u, `h-9 truncate font-medium`, !r && `pr-10`),
          }),
          !r &&
            (0, p.jsx)(o, {
              className: `absolute right-0.5 top-0.5`,
              size: `icon-sm`,
              label: `${_(`common.change`)}: ${m.label}`,
              icon: (0, p.jsx)(c, { 'aria-hidden': !0 }),
              onClick: () => h(null),
            }),
        ],
      })
    : (0, p.jsxs)(`div`, {
        className: `relative`,
        ref: N,
        children: [
          (0, p.jsx)(l, {
            className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground`,
            'aria-hidden': !0,
          }),
          (0, p.jsx)(`input`, {
            id: y,
            type: `text`,
            'aria-describedby': v[`aria-describedby`],
            'aria-required': v[`aria-required`],
            role: `combobox`,
            'aria-expanded': C,
            'aria-controls': b,
            'aria-autocomplete': `list`,
            'aria-activedescendant': C && T[D] ? `${b}-${T[D].id}` : void 0,
            autoComplete: `off`,
            value: x,
            disabled: r,
            placeholder: t,
            className: a(u, `h-9 pl-9`),
            onFocus: () => w(!0),
            onChange: (e) => {
              ;(S(e.target.value), w(!0))
            },
            onKeyDown: (e) => {
              e.key === `ArrowDown`
                ? (e.preventDefault(), w(!0), O((e) => Math.min(e + 1, Math.max(T.length - 1, 0))))
                : e.key === `ArrowUp`
                  ? (e.preventDefault(), O((e) => Math.max(e - 1, 0)))
                  : e.key === `Enter` && C && T[D]
                    ? (e.preventDefault(), P(T[D]))
                    : e.key === `Escape` && C && (e.stopPropagation(), w(!1))
            },
          }),
          C &&
            (0, p.jsxs)(`ul`, {
              id: b,
              role: `listbox`,
              className: `absolute z-40 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md`,
              children: [
                M &&
                  (0, p.jsxs)(`li`, {
                    className: `flex flex-col gap-2 p-2`,
                    'aria-busy': `true`,
                    children: [(0, p.jsx)(n, { className: `h-4 w-2/3` }), (0, p.jsx)(n, { className: `h-4 w-1/2` })],
                  }),
                !M &&
                  T.length === 0 &&
                  (0, p.jsx)(`li`, { className: `px-3 py-2.5 text-body text-muted-foreground`, children: _(`common.none`) }),
                !M &&
                  T.map((e, t) =>
                    (0, p.jsxs)(
                      `li`,
                      {
                        id: `${b}-${e.id}`,
                        role: `option`,
                        'aria-selected': t === D,
                        onMouseEnter: () => O(t),
                        onMouseDown: (t) => {
                          ;(t.preventDefault(), P(e))
                        },
                        className: a(`flex cursor-pointer flex-col rounded-md px-3 py-2`, t === D && `bg-accent`),
                        children: [
                          (0, p.jsx)(`span`, { className: `text-body font-medium`, children: e.label }),
                          e.sublabel && (0, p.jsx)(`span`, { className: `text-caption text-muted-foreground`, children: e.sublabel }),
                        ],
                      },
                      e.id,
                    ),
                  ),
              ],
            }),
        ],
      })
}
export { m as t }
