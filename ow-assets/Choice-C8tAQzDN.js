import { At as e, Dt as t, H as n, Ot as r, Y as i } from './api-lC4u2sZi.js'
import { a, i as o, r as s, t as c } from './dist-ToKkLyYu.js'
import { Y as l, et as u } from './index-CbGLOUZk.js'
var d = e(r(), 1),
  f = t(),
  p = Object.defineProperty,
  m = (e, t) => p(e, `name`, { value: t, configurable: !0 }),
  h = `Switch`,
  [g, _] = o(h),
  [v, y] = g(h)
function b(e) {
  let {
      __scopeSwitch: t,
      checked: n,
      children: r,
      defaultChecked: i,
      disabled: a,
      form: o,
      name: s,
      onCheckedChange: l,
      required: u,
      value: p = `on`,
      internal_do_not_use_render: m,
    } = e,
    [g, _] = c({ prop: n, defaultProp: i ?? !1, onChange: l, caller: h }),
    [y, b] = d.useState(null),
    [x, S] = d.useState(null),
    C = d.useRef(!1),
    [w, T] = d.useReducer((e) => e + 1, 0),
    E = {
      checked: g,
      setChecked: _,
      disabled: a,
      control: y,
      setControl: b,
      name: s,
      form: o,
      value: p,
      hasConsumerStoppedPropagationRef: C,
      userInteractionCount: w,
      onUserInteraction: T,
      required: u,
      defaultChecked: i,
      isFormControl: !y || !!o || !!y.closest(`form`),
      bubbleInput: x,
      setBubbleInput: S,
    }
  return (0, f.jsx)(v, { scope: t, ...E, children: O(m) ? m(E) : r })
}
m(b, `SwitchProvider`)
var x = `SwitchTrigger`,
  S = d.forwardRef(
    m(function ({ __scopeSwitch: e, onClick: t, ...r }, i) {
      let {
          control: o,
          form: c,
          value: l,
          disabled: u,
          checked: p,
          required: h,
          setControl: g,
          setChecked: _,
          hasConsumerStoppedPropagationRef: v,
          onUserInteraction: b,
          isFormControl: S,
          bubbleInput: C,
        } = y(x, e),
        w = n(i, g),
        T = d.useRef(p)
      return (
        d.useEffect(() => {
          let e = c ? o?.ownerDocument.getElementById(c) : o?.form
          if (e instanceof HTMLFormElement) {
            let t = m(() => _(T.current), `reset`)
            return (e.addEventListener(`reset`, t), () => e.removeEventListener(`reset`, t))
          }
        }, [o, c, _]),
        (0, f.jsx)(a.button, {
          type: `button`,
          role: `switch`,
          'aria-checked': p,
          'aria-required': h,
          'data-state': k(p),
          'data-disabled': u ? `` : void 0,
          disabled: u,
          value: l,
          ...r,
          ref: w,
          onClick: s(t, (e) => {
            ;(b(), _((e) => !e), C && S && ((v.current = e.isPropagationStopped()), v.current || e.stopPropagation()))
          }),
        })
      )
    }, `SwitchTrigger`),
  ),
  C = d.forwardRef(
    m(function (e, t) {
      let {
        __scopeSwitch: n,
        name: r,
        checked: i,
        defaultChecked: a,
        required: o,
        disabled: s,
        value: c,
        onCheckedChange: l,
        form: u,
        ...d
      } = e
      return (0, f.jsx)(b, {
        __scopeSwitch: n,
        checked: i,
        defaultChecked: a,
        disabled: s,
        required: o,
        onCheckedChange: l,
        name: r,
        form: u,
        value: c,
        internal_do_not_use_render: ({ isFormControl: e }) =>
          (0, f.jsxs)(f.Fragment, {
            children: [(0, f.jsx)(S, { ...d, ref: t, __scopeSwitch: n }), e && (0, f.jsx)(D, { __scopeSwitch: n })],
          }),
      })
    }, `Switch`),
  ),
  w = `SwitchThumb`,
  T = d.forwardRef(
    m(function (e, t) {
      let { __scopeSwitch: n, ...r } = e,
        i = y(w, n)
      return (0, f.jsx)(a.span, { 'data-state': k(i.checked), 'data-disabled': i.disabled ? `` : void 0, ...r, ref: t })
    }, `SwitchThumb`),
  ),
  E = `SwitchBubbleInput`,
  D = d.forwardRef(
    m(function ({ __scopeSwitch: e, onClick: t, ...r }, i) {
      let {
          control: o,
          hasConsumerStoppedPropagationRef: c,
          userInteractionCount: l,
          checked: p,
          defaultChecked: m,
          required: h,
          disabled: g,
          name: _,
          value: v,
          form: b,
          bubbleInput: x,
          setBubbleInput: S,
        } = y(E, e),
        C = n(i, S),
        w = u(o),
        T = d.useRef(!1),
        D = d.useRef(p),
        O = d.useRef(l)
      d.useEffect(() => {
        let e = x
        if (!e) return
        let t = window.HTMLInputElement.prototype,
          n = Object.getOwnPropertyDescriptor(t, `checked`).set,
          r = l !== O.current
        O.current = l
        let i = D.current !== p
        D.current = p
        let a = !(r && c.current)
        if (i && n) {
          T.current = !r
          let t = new Event(`click`, { bubbles: a })
          ;(n.call(e, p), e.dispatchEvent(t), (T.current = !1))
        }
      }, [x, p, c, l])
      let k = d.useRef(p)
      return (0, f.jsx)(a.input, {
        type: `checkbox`,
        'aria-hidden': !0,
        defaultChecked: m ?? k.current,
        required: h,
        disabled: g,
        name: _,
        value: v,
        form: b,
        ...r,
        tabIndex: -1,
        ref: C,
        onClick: s(t, (e) => {
          T.current && e.stopPropagation()
        }),
        style: { ...r.style, ...w, position: `absolute`, pointerEvents: `none`, opacity: 0, margin: 0, transform: `translateX(-100%)` },
      })
    }, `SwitchBubbleInput`),
  )
function O(e) {
  return typeof e == `function`
}
m(O, `isFunction`)
function k(e) {
  return e ? `checked` : `unchecked`
}
m(k, `getState`)
var A = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3.5 8.5 3 3 6-7'/%3E%3C/svg%3E")`,
  j = `radial-gradient(circle, white 0 3px, transparent 3.5px)`
function M({ kind: e, label: t, description: n, className: r, wrapperClassName: a, ...o }) {
  let s = l()
  return (0, f.jsxs)(`label`, {
    className: i(`flex items-start gap-2.5 text-body text-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60`, a),
    children: [
      (0, f.jsx)(`input`, {
        type: e,
        ...s,
        ...o,
        style: { '--mark': e === `checkbox` ? A : j },
        className: i(
          `mt-0.5 size-4 shrink-0 appearance-none border border-input bg-surface bg-(image:--mark) bg-no-repeat bg-[length:0] transition-colors duration-100 hover:border-foreground/50 checked:border-primary checked:bg-primary checked:bg-[length:100%_100%] indeterminate:bg-primary pointer-coarse:size-5`,
          e === `checkbox` ? `rounded-sm` : `rounded-full`,
          r,
        ),
      }),
      (0, f.jsxs)(`span`, {
        className: `min-w-0`,
        children: [t, n && (0, f.jsx)(`span`, { className: `block text-caption text-muted-foreground`, children: n })],
      }),
    ],
  })
}
function N(e) {
  return (0, f.jsx)(M, { kind: `checkbox`, ...e })
}
function P({ checked: e, onCheckedChange: t, label: n, disabled: r, name: i }) {
  return (0, f.jsx)(C, {
    checked: e,
    onCheckedChange: t,
    'aria-label': n,
    disabled: r,
    name: i,
    className: `relative h-5 w-9 shrink-0 rounded-full border border-input bg-muted transition-colors duration-100 data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50`,
    children: (0, f.jsx)(T, {
      className: `block size-3.5 translate-x-0.5 rounded-full bg-foreground shadow-sm transition-transform duration-100 data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground`,
    }),
  })
}
export { P as n, N as t }
