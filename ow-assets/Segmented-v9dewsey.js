import { At as e, Dt as t, Ot as n, Y as r } from './api-lC4u2sZi.js'
import { a as i, i as a, r as o, t as s } from './dist-ToKkLyYu.js'
import { $ as c, Q as l, Z as u, lt as d } from './index-CbGLOUZk.js'
var f = e(n(), 1),
  p = t(),
  m = Object.defineProperty,
  h = (e, t) => m(e, `name`, { value: t, configurable: !0 }),
  g = `Toggle`,
  _ = f.forwardRef(
    h(function (e, t) {
      let { pressed: n, defaultPressed: r, onPressedChange: a, ...c } = e,
        [l, u] = s({ prop: n, onChange: a, defaultProp: r ?? !1, caller: g })
      return (0, p.jsx)(i.button, {
        type: `button`,
        'aria-pressed': l,
        'data-state': l ? `on` : `off`,
        'data-disabled': e.disabled ? `` : void 0,
        ...c,
        ref: t,
        onClick: o(e.onClick, () => {
          e.disabled || u(!l)
        }),
      })
    }, `Toggle`),
  ),
  v = Object.defineProperty,
  y = (e, t) => v(e, `name`, { value: t, configurable: !0 }),
  b = `ToggleGroup`,
  x = { Single: `single`, Multiple: `multiple` },
  [S, C] = a(b, [c]),
  w = c(),
  T = f.forwardRef(
    y(function (e, t) {
      let { type: n, ...r } = e
      if (n === x.Single) return (0, p.jsx)(O, { role: `radiogroup`, ...r, ref: t })
      if (n === x.Multiple) return (0, p.jsx)(k, { role: `toolbar`, ...r, ref: t })
      throw Error(`Missing prop \`type\` expected on \`${b}\``)
    }, `ToggleGroup`),
  ),
  [E, D] = S(b),
  O = f.forwardRef(
    y(function (e, t) {
      let { value: n, defaultValue: r, onValueChange: i = y(() => {}, `onValueChange`), ...a } = e,
        [o, c] = s({ prop: n, defaultProp: r ?? ``, onChange: i, caller: b })
      return (0, p.jsx)(E, {
        scope: e.__scopeToggleGroup,
        type: x.Single,
        value: f.useMemo(() => (o ? [o] : []), [o]),
        onItemActivate: c,
        onItemDeactivate: f.useCallback(() => c(``), [c]),
        children: (0, p.jsx)(M, { ...a, ref: t }),
      })
    }, `ToggleGroupImplSingle`),
  ),
  k = f.forwardRef(
    y(function (e, t) {
      let { value: n, defaultValue: r, onValueChange: i = y(() => {}, `onValueChange`), ...a } = e,
        [o, c] = s({ prop: n, defaultProp: r ?? [], onChange: i, caller: b }),
        l = f.useCallback((e) => c((t = []) => [...t, e]), [c]),
        u = f.useCallback((e) => c((t = []) => t.filter((t) => t !== e)), [c])
      return (0, p.jsx)(E, {
        scope: e.__scopeToggleGroup,
        type: x.Multiple,
        value: o,
        onItemActivate: l,
        onItemDeactivate: u,
        children: (0, p.jsx)(M, { ...a, ref: t }),
      })
    }, `ToggleGroupImplMultiple`),
  ),
  [A, j] = S(b),
  M = f.forwardRef(
    y(function (e, t) {
      let { __scopeToggleGroup: n, disabled: r = !1, rovingFocus: a = !0, orientation: o, dir: s, loop: c = !0, ...l } = e,
        f = w(n),
        m = d(s),
        h = { dir: m, ...l }
      return (0, p.jsx)(A, {
        scope: n,
        rovingFocus: a,
        disabled: r,
        children: a
          ? (0, p.jsx)(u, { asChild: !0, ...f, orientation: o, dir: m, loop: c, children: (0, p.jsx)(i.div, { ...h, ref: t }) })
          : (0, p.jsx)(i.div, { ...h, ref: t }),
      })
    }, `ToggleGroupImpl`),
  ),
  N = `ToggleGroupItem`,
  P = f.forwardRef(
    y(function (e, t) {
      let n = D(N, e.__scopeToggleGroup),
        r = j(N, e.__scopeToggleGroup),
        i = w(e.__scopeToggleGroup),
        a = n.value.includes(e.value),
        o = r.disabled || e.disabled,
        s = { ...e, pressed: a, disabled: o },
        c = f.useRef(null)
      return r.rovingFocus
        ? (0, p.jsx)(l, { asChild: !0, ...i, focusable: !o, active: a, ref: c, children: (0, p.jsx)(F, { ...s, ref: t }) })
        : (0, p.jsx)(F, { ...s, ref: t })
    }, `ToggleGroupItem`),
  ),
  F = f.forwardRef(
    y(function (e, t) {
      let { __scopeToggleGroup: n, value: r, ...i } = e,
        a = D(N, n),
        o = { role: `radio`, 'aria-checked': e.pressed, 'aria-pressed': void 0 },
        s = a.type === x.Single ? o : void 0
      return (0, p.jsx)(_, {
        ...s,
        ...i,
        ref: t,
        onPressedChange: (e) => {
          e ? a.onItemActivate(r) : a.onItemDeactivate(r)
        },
      })
    }, `ToggleGroupItemImpl`),
  )
function I({ value: e, onValueChange: t, options: n, label: i, disabled: a, className: o }) {
  return (0, p.jsx)(T, {
    type: `single`,
    value: e,
    onValueChange: (e) => e && t(e),
    'aria-label': i,
    disabled: a,
    className: r(`inline-flex w-fit rounded-md border border-input bg-muted p-0.5`, o),
    children: n.map((e) =>
      (0, p.jsx)(
        P,
        {
          value: e.value,
          className: `inline-flex h-7 items-center rounded-sm px-3 text-body font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-surface data-[state=on]:text-foreground data-[state=on]:shadow-sm pointer-coarse:min-h-10`,
          children: e.label,
        },
        e.value,
      ),
    ),
  })
}
export { I as t }
