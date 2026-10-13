import { At as e, Dt as t, M as n, N as r, Ot as i, R as a, S as o, q as s } from './api-lC4u2sZi.js'
import { t as c } from './useMutation-YmV9sVwE.js'
import { t as l } from './StatusBadge-DknRod1K.js'
import { t as u } from './plus-CTDUdFcD.js'
import { B as d, I as f, P as p, S as m, V as h, X as g, f as _, h as v, x as y, xt as b } from './index-CbGLOUZk.js'
import { t as x } from './PageHeader-HSPIRw-a.js'
import { n as S } from './form-Bpp5E52a.js'
import { t as C } from './EmptyState-B6htI9zs.js'
import { t as w } from './FormModal-O5Cwhy1v.js'
var T = s(`map-pin`, [
    [`path`, { d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`, key: `1r0f0z` }],
    [`circle`, { cx: `12`, cy: `10`, r: `3`, key: `ilqhr7` }],
  ]),
  E = s(`settings`, [
    [
      `path`,
      {
        d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
        key: `1i5ecw`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
  ]),
  D = e(i(), 1),
  O = t()
function k() {
  let { t: e } = o(),
    t = p(),
    { garages: i, activeGarage: s, isLoading: k, error: A, selectGarage: j, refresh: M } = _(),
    [N, P] = (0, D.useState)(!1),
    F = c({
      mutationFn: v.create,
      onSuccess: async (t) => {
        ;(await M(), t.id && j(t.id), P(!1), f.success(e(`common.saved`)))
      },
    }),
    I = (0, O.jsxs)(a, {
      variant: `primary`,
      onClick: () => P(!0),
      children: [(0, O.jsx)(u, { 'aria-hidden': !0 }), ` `, e(`garages.new`)],
    })
  return (0, O.jsxs)(n, {
    children: [
      (0, O.jsx)(x, { title: e(`garages.title`), description: e(`garages.description`), action: i.length > 0 && I }),
      (0, O.jsx)(m, { isLoading: k, error: A, onRetry: () => void M() }),
      !k && !A && i.length === 0 && (0, O.jsx)(r, { children: (0, O.jsx)(C, { message: e(`garages.empty`), action: I }) }),
      i.length > 0 &&
        (0, O.jsx)(r, {
          children: (0, O.jsx)(`ul`, {
            className: `divide-y divide-border`,
            children: i.map((n) => {
              let r = n.id === s?.id,
                i = n.access?.owner || n.access?.permissions?.includes(`PERMISSION_GARAGE_WRITE`)
              return (0, O.jsxs)(
                `li`,
                {
                  className: `flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 ${r ? `bg-primary-subtle/50` : ``}`,
                  children: [
                    (0, O.jsx)(d, { shape: `square`, size: `lg`, initials: y(n.name), src: n.logoUrl || void 0 }),
                    (0, O.jsxs)(`div`, {
                      className: `min-w-0 flex-1 basis-56`,
                      children: [
                        (0, O.jsxs)(`h2`, {
                          className: `flex flex-wrap items-center gap-2 text-subheading`,
                          children: [
                            n.name,
                            (0, O.jsx)(h, {
                              tone: n.access?.owner ? `info` : `neutral`,
                              children: n.access?.owner ? e(`garages.owner`) : e(`garages.member`),
                            }),
                          ],
                        }),
                        n.address &&
                          (0, O.jsxs)(`p`, {
                            className: `mt-0.5 flex items-center gap-1 text-body text-muted-foreground`,
                            children: [(0, O.jsx)(T, { className: `size-3.5 shrink-0`, 'aria-hidden': !0 }), ` `, n.address],
                          }),
                      ],
                    }),
                    (0, O.jsx)(l, {
                      tone: n.status === `GARAGE_STATUS_INACTIVE` ? `neutral` : `active`,
                      label: n.status === `GARAGE_STATUS_INACTIVE` ? e(`common.inactive`) : e(`common.active`),
                    }),
                    (0, O.jsxs)(`div`, {
                      className: `flex items-center gap-1`,
                      children: [
                        r
                          ? (0, O.jsxs)(`span`, {
                              className: `inline-flex items-center gap-1.5 px-2 text-body text-muted-foreground`,
                              children: [
                                (0, O.jsx)(b, { className: `size-4 text-success-subtle-foreground`, 'aria-hidden': !0 }),
                                ` `,
                                e(`garages.current`),
                              ],
                            })
                          : (0, O.jsx)(a, { variant: `outline`, size: `sm`, onClick: () => j(n.id ?? ``), children: e(`garages.open`) }),
                        i &&
                          (0, O.jsx)(g, {
                            label: `${e(`garages.settings`)}: ${n.name}`,
                            icon: (0, O.jsx)(E, { 'aria-hidden': !0 }),
                            size: `icon-sm`,
                            onClick: () => t(`/garages/${n.id}/settings`),
                          }),
                      ],
                    }),
                  ],
                },
                n.id,
              )
            }),
          }),
        }),
      N &&
        (0, O.jsx)(w, {
          title: e(`garages.createTitle`),
          description: e(`garages.createDescription`),
          fields: [
            { name: `name`, label: e(`garages.name`), required: !0, maxLength: 255 },
            { name: `address`, label: e(`common.address`), maxLength: 500 },
            { name: `phone`, label: e(`common.phone`), type: `tel` },
            { name: `email`, label: e(`common.email`), type: `email` },
            { name: `taxCode`, label: e(`common.taxCode`), maxLength: 20 },
          ],
          submitLabel: e(`common.create`),
          onClose: () => P(!1),
          onSave: (e) =>
            F.mutateAsync({
              name: S(e, `name`),
              address: S(e, `address`),
              phone: S(e, `phone`),
              email: S(e, `email`),
              taxCode: S(e, `taxCode`),
            }),
        }),
    ],
  })
}
export { k as GaragesPage }
