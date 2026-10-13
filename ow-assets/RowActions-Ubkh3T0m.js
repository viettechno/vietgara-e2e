import { Dt as e, S as t } from './api-lC4u2sZi.js'
import { t as n } from './pencil-DC9AcF2N.js'
import { t as r } from './rotate-ccw-LOO4idQV.js'
import { t as i } from './trash-DZQxI2eA.js'
import { X as a } from './index-CbGLOUZk.js'
var o = e()
function s({ subject: e, onEdit: s, onDelete: c, onActivate: l }) {
  let { t: u } = t()
  return (0, o.jsxs)(`span`, {
    className: `inline-flex gap-0.5`,
    children: [
      s && (0, o.jsx)(a, { size: `icon-sm`, label: `${u(`common.edit`)}: ${e}`, icon: (0, o.jsx)(n, { 'aria-hidden': !0 }), onClick: s }),
      l &&
        (0, o.jsx)(a, {
          size: `icon-sm`,
          label: `${u(`lifecycle.activate`)}: ${e}`,
          icon: (0, o.jsx)(r, { 'aria-hidden': !0 }),
          onClick: l,
        }),
      c &&
        !l &&
        (0, o.jsx)(a, { size: `icon-sm`, label: `${u(`common.delete`)}: ${e}`, icon: (0, o.jsx)(i, { 'aria-hidden': !0 }), onClick: c }),
    ],
  })
}
export { s as t }
