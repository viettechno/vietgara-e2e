import { Dt as e, Y as t } from './api-lC4u2sZi.js'
var n = e()
function r({ className: e, compact: r, stack: i = !0, caption: a, children: o, ...s }) {
  return (0, n.jsx)(`div`, {
    className: `overflow-x-auto`,
    children: (0, n.jsxs)(`table`, {
      'data-stack': i ? `` : void 0,
      'data-compact': r ? `` : void 0,
      className: t(`w-full text-left text-body`, e),
      ...s,
      children: [a && (0, n.jsx)(`caption`, { className: `sr-only`, children: a }), o],
    }),
  })
}
var i = ({ className: e, ...r }) => (0, n.jsx)(`thead`, { className: t(`bg-surface-sunken`, e), ...r }),
  a = ({ className: e, ...r }) => (0, n.jsx)(`tbody`, { className: t(`divide-y divide-border`, e), ...r }),
  o = {
    warning: `max-md:shadow-[inset_3px_0_0_0_var(--warning)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--warning)]`,
    destructive: `max-md:shadow-[inset_3px_0_0_0_var(--destructive)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--destructive)]`,
    success: `max-md:shadow-[inset_3px_0_0_0_var(--success)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--success)]`,
    info: `max-md:shadow-[inset_3px_0_0_0_var(--info)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--info)]`,
  }
function s({ className: e, rail: r, ...i }) {
  return (0, n.jsx)(`tr`, { className: t(`transition-colors hover:bg-accent/60 aria-selected:bg-primary-subtle`, r && o[r], e), ...i })
}
function c({ className: e, numeric: r, ...i }) {
  return (0, n.jsx)(`th`, {
    scope: `col`,
    className: t(
      `whitespace-nowrap border-b border-border bg-surface-sunken px-4 py-2.5 text-caption font-medium text-muted-foreground`,
      r && `text-right`,
      e,
    ),
    ...i,
  })
}
function l({ className: e, numeric: r, label: i, primary: a, actions: o, ...s }) {
  return (0, n.jsx)(`td`, {
    'data-label': i,
    'data-primary': a ? `` : void 0,
    'data-actions': o ? `` : void 0,
    className: t(
      `px-4 align-middle text-foreground [table:not([data-compact])_&]:h-12 [table[data-compact]_&]:h-10`,
      r && `num text-right`,
      a && `font-medium`,
      o && `w-px whitespace-nowrap text-right`,
      e,
    ),
    ...s,
  })
}
function u({ page: e, pageSize: t, total: r, onPageChange: i, summary: a, previousLabel: o, nextLabel: s }) {
  let c = Math.max(1, Math.ceil(r / t)),
    l = `inline-flex h-8 items-center rounded-md border border-input bg-surface px-3 text-caption text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface pointer-coarse:min-h-11`
  return (0, n.jsxs)(`nav`, {
    'aria-label': `Pagination`,
    className: `flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3`,
    children: [
      (0, n.jsx)(`p`, { className: `num text-caption text-muted-foreground`, children: a }),
      (0, n.jsxs)(`div`, {
        className: `flex gap-2`,
        children: [
          (0, n.jsx)(`button`, { type: `button`, className: l, onClick: () => i(e - 1), disabled: e <= 1, children: o }),
          (0, n.jsx)(`button`, { type: `button`, className: l, onClick: () => i(e + 1), disabled: e >= c, children: s }),
        ],
      }),
    ],
  })
}
export { i as a, l as i, r as n, c as o, a as r, s, u as t }
