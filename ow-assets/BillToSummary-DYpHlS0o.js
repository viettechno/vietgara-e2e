import { Dt as e, S as t } from './api-lC4u2sZi.js'
import { Ct as n, J as r, W as i } from './index-CbGLOUZk.js'
import { n as a, r as o } from './taxProfilesApi-CFBO1Viz.js'
var s = e()
function c({ garageId: e, customerId: c, value: l, onChange: u, disabled: d, allowDefault: f, label: p }) {
  let { t: m } = t(),
    h = n({ queryKey: [...o(e, c ?? ``), { includeInactive: !1 }], queryFn: () => a.list(e, c ?? ``), enabled: !!(e && c) }).data ?? [],
    g = h.find((e) => e.id === l),
    _ = g && !(g.taxId && g.address)
  return (0, s.jsx)(r, {
    label: p ?? m(`billing.billTo`),
    hint: m(_ ? `billing.incompleteHint` : `billing.billToHint`),
    children: (0, s.jsxs)(i, {
      disabled: d || !c,
      value: l === void 0 ? `__default` : l,
      onChange: (e) => u(e.target.value === `__default` ? void 0 : e.target.value),
      children: [
        f && (0, s.jsx)(`option`, { value: `__default`, children: m(`billing.defaultProfile`) }),
        (0, s.jsx)(`option`, { value: ``, children: m(`billing.retail`) }),
        h.map((e) =>
          (0, s.jsxs)(
            `option`,
            { value: e.id, children: [e.legalName, e.taxId ? ` · ${e.taxId}` : ``, e.isDefault ? ` (${m(`taxProfiles.default`)})` : ``] },
            e.id,
          ),
        ),
      ],
    }),
  })
}
function l({ party: e }) {
  let { t: n } = t()
  return e?.taxProfileId
    ? (0, s.jsxs)(`span`, {
        className: `flex flex-col`,
        children: [
          (0, s.jsx)(`span`, { className: `font-medium`, children: e.legalName }),
          e.taxId &&
            (0, s.jsxs)(`span`, { className: `text-caption text-muted-foreground`, children: [n(`taxProfiles.taxId`), `: `, e.taxId] }),
          e.address && (0, s.jsx)(`span`, { className: `text-caption text-muted-foreground`, children: e.address }),
        ],
      })
    : (0, s.jsx)(`span`, { className: `text-muted-foreground`, children: n(`billing.retail`) })
}
export { c as n, l as t }
