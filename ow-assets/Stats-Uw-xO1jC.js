import { Dt as e, O as t, Y as n } from './api-lC4u2sZi.js'
var r = e()
function i({ children: e, className: t }) {
  return (0, r.jsx)(`dl`, {
    className: n(
      `grid grid-cols-1 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:divide-x sm:divide-y-0`,
      t,
    ),
    children: e,
  })
}
function a({ label: e, value: i, hint: a, loading: o, tone: s = `default` }) {
  return (0, r.jsxs)(`div`, {
    className: `px-5 py-4`,
    children: [
      (0, r.jsx)(`dt`, { className: `text-caption text-muted-foreground`, children: e }),
      (0, r.jsxs)(`dd`, {
        className: `mt-1`,
        children: [
          o
            ? (0, r.jsx)(t, { className: `mt-2 h-7 w-28` })
            : (0, r.jsx)(`span`, {
                className: n(
                  `num text-title`,
                  s === `warning` && `text-warning-subtle-foreground`,
                  s === `destructive` && `text-destructive-subtle-foreground`,
                ),
                children: i,
              }),
          a && !o && (0, r.jsx)(`span`, { className: `mt-0.5 block text-caption text-muted-foreground`, children: a }),
        ],
      }),
    ],
  })
}
function o({ value: e, max: t, label: i }) {
  let a = t > 0 ? Math.min(e / t, 1) : 0
  return (0, r.jsx)(`div`, {
    role: `meter`,
    'aria-label': i,
    'aria-valuemin': 0,
    'aria-valuemax': t,
    'aria-valuenow': e,
    className: `h-1.5 w-full overflow-hidden rounded-full bg-muted`,
    children: (0, r.jsx)(`div`, {
      className: n(
        `h-full rounded-full transition-[width] duration-300`,
        a >= 1 ? `bg-destructive` : a >= 0.8 ? `bg-warning` : `bg-primary`,
      ),
      style: { width: `${a * 100}%` },
    }),
  })
}
export { a as n, i as r, o as t }
