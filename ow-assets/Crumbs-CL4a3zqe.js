import { Dt as e, S as t, k as n } from './api-lC4u2sZi.js'
import { A as r } from './index-CbGLOUZk.js'
var i = e()
function a({ items: e }) {
  let { t: a } = t()
  return (0, i.jsx)(n, {
    label: a(`ui.breadcrumb`),
    items: e.map((e) => ({ label: e.label, href: e.to })),
    renderLink: (e) =>
      (0, i.jsx)(r, { to: e.href ?? `#`, className: `rounded-sm hover:text-foreground hover:underline`, children: e.label }),
  })
}
export { a as t }
