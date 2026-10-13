import { Dt as e, S as t, T as n, Y as r } from './api-lC4u2sZi.js'
import { at as i, ft as a, it as o, nt as s, ot as c, rt as l, st as u, tt as d } from './index-CbGLOUZk.js'
var f = e(),
  p = d,
  m = { sm: `sm:w-[400px]`, md: `sm:w-[480px]`, lg: `sm:w-[720px]` }
function h({ size: e = `md`, closeLabel: t, dismissOnOutsideClick: n = !0, className: o, children: u, onInteractOutside: d, ...p }) {
  return (0, f.jsxs)(c, {
    children: [
      (0, f.jsx)(i, {
        className: `fixed inset-0 z-[60] bg-backdrop data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out`,
      }),
      (0, f.jsxs)(l, {
        onInteractOutside: (e) => {
          ;(n || e.preventDefault(), d?.(e))
        },
        className: r(
          `fixed z-[60] flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg outline-none`,
          `max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[92dvh] max-sm:rounded-t-xl max-sm:data-[state=open]:animate-sheet-bottom-in max-sm:data-[state=closed]:animate-sheet-bottom-out`,
          `sm:left-1/2 sm:top-1/2 sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out`,
          m[e],
          o,
        ),
        ...p,
        children: [
          u,
          (0, f.jsx)(s, {
            'aria-label': t,
            className: `absolute right-3 top-3 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground pointer-coarse:size-11`,
            children: (0, f.jsx)(a, { className: `size-4`, 'aria-hidden': !0 }),
          }),
        ],
      }),
    ],
  })
}
function g({ title: e, description: t }) {
  return (0, f.jsxs)(`div`, {
    className: `px-6 pb-2 pt-6 pr-12`,
    children: [
      (0, f.jsx)(u, { className: `text-subheading`, children: e }),
      t
        ? (0, f.jsx)(o, { className: `mt-1.5 text-body text-muted-foreground`, children: t })
        : (0, f.jsx)(o, { className: `sr-only`, children: typeof e == `string` ? e : `` }),
    ],
  })
}
function _({ className: e, ...t }) {
  return (0, f.jsx)(`div`, { className: r(`min-h-0 flex-1 overflow-y-auto px-6 py-3`, e), ...t })
}
function v({ title: e, description: r, error: i, wide: a, onClose: o, children: s }) {
  let { t: c } = t()
  return (0, f.jsx)(p, {
    open: !0,
    onOpenChange: (e) => !e && o(),
    children: (0, f.jsxs)(h, {
      size: a ? `lg` : `md`,
      closeLabel: c(`common.close`),
      dismissOnOutsideClick: !1,
      children: [
        (0, f.jsx)(g, { title: e, description: r }),
        (0, f.jsxs)(_, { children: [s, i && (0, f.jsx)(n, { tone: `destructive`, title: i, className: `mt-4` })] }),
      ],
    }),
  })
}
function y({ children: e }) {
  return (0, f.jsx)(`div`, {
    className: `-mx-6 -mb-3 mt-5 flex flex-col-reverse gap-2 border-t border-border bg-surface-sunken px-6 py-4 sm:flex-row sm:justify-end`,
    children: e,
  })
}
export { y as n, v as t }
