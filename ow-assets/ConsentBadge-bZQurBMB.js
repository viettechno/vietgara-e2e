import { Dt as e, S as t, q as n } from './api-lC4u2sZi.js'
import { V as r, ht as i } from './index-CbGLOUZk.js'
var a = n(`shield-alert`, [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
        key: `oel41y`,
      },
    ],
    [`path`, { d: `M12 8v4`, key: `1got3b` }],
    [`path`, { d: `M12 16h.01`, key: `1drbdi` }],
  ]),
  o = e()
function s({ granted: e }) {
  let { t: n } = t()
  return (0, o.jsx)(r, {
    tone: e ? `success` : `warning`,
    icon: e ? (0, o.jsx)(i, { 'aria-hidden': !0 }) : (0, o.jsx)(a, { 'aria-hidden': !0 }),
    title: n(`customers.consent`),
    children: n(e ? `customers.consentGiven` : `customers.consentMissing`),
  })
}
export { s as t }
