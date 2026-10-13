import { Dt as e, G as t, U as n, W as r, q as i } from './api-lC4u2sZi.js'
import { V as a } from './index-CbGLOUZk.js'
var o = i(`circle-dot`, [
    [`circle`, { cx: `12`, cy: `12`, r: `1`, key: `41hilf` }],
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
  ]),
  s = i(`clock`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M12 6v6l4 2`, key: `mmk7yg` }],
  ]),
  c = e(),
  l = {
    active: { tone: `success`, icon: r },
    pending: { tone: `warning`, icon: s },
    danger: { tone: `destructive`, icon: t },
    info: { tone: `info`, icon: n },
    neutral: { tone: `neutral`, icon: o },
  }
function u({ tone: e, label: t }) {
  let { tone: n, icon: r } = l[e]
  return (0, c.jsx)(a, { tone: n, icon: (0, c.jsx)(r, { 'aria-hidden': !0 }), children: t })
}
export { u as t }
