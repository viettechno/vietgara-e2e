import { At as e, Dt as t, Ot as n, S as r, pt as i } from './api-lC4u2sZi.js'
import { t as a } from './Table-dqUq80Ez.js'
import { Ct as o } from './index-CbGLOUZk.js'
var s = t()
function c({ page: e, pageSize: t, total: n, onPageChange: i }) {
  let { t: o } = r(),
    c = n === 0 ? 0 : (e - 1) * t + 1,
    l = Math.min(e * t, n)
  return (0, s.jsx)(a, {
    page: e,
    pageSize: t,
    total: n,
    onPageChange: i,
    summary: o(`ui.range`, { from: c, to: l, total: n }),
    previousLabel: o(`common.previous`),
    nextLabel: o(`common.nextPage`),
  })
}
var l = e(n(), 1)
function u(e, t, n = !0) {
  let r = JSON.stringify(e),
    [a, s] = (0, l.useState)({ keyText: r, page: 1 }),
    c = a.keyText === r ? a.page : 1
  return {
    ...o({ queryKey: [...e, { page: c }], queryFn: () => t(c), placeholderData: i, enabled: n }),
    page: c,
    setPage: (e) => s({ keyText: r, page: e }),
  }
}
export { c as n, u as t }
