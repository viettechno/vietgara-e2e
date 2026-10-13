import { Dt as e, G as t, M as n, N as r, P as i, R as a, S as o, q as s } from './api-lC4u2sZi.js'
import { t as c } from './useMutation-YmV9sVwE.js'
import { A as l, C as u, D as d, E as f, I as p, J as m, O as h, U as g, W as _, w as v } from './index-CbGLOUZk.js'
import { t as y } from './PageHeader-HSPIRw-a.js'
import { n as b } from './form-Bpp5E52a.js'
var x = s(`badge-check`, [
    [
      `path`,
      {
        d: `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z`,
        key: `3c2336`,
      },
    ],
    [`path`, { d: `m16 9-5.5 5.5L8 12`, key: `xofnsj` }],
  ]),
  S = e()
function C() {
  let { t: e } = o(),
    { user: s, setUser: C } = v(),
    w = c({
      mutationFn: f.updateMe,
      onSuccess: (t) => {
        ;(C(t), p.success(e(`common.saved`)))
      },
    })
  return s
    ? (0, S.jsxs)(n, {
        children: [
          (0, S.jsx)(y, { title: e(`account.title`), description: e(`account.description`) }),
          (0, S.jsx)(r, {
            className: `max-w-xl`,
            children: (0, S.jsx)(i, {
              children: (0, S.jsxs)(`form`, {
                onSubmit: (e) => {
                  e.preventDefault()
                  let t = new FormData(e.currentTarget)
                  w.mutate({ fullName: b(t, `fullName`), phone: b(t, `phone`), locale: b(t, `locale`) })
                },
                className: `flex flex-col gap-4`,
                children: [
                  (0, S.jsx)(m, {
                    label: e(`common.email`),
                    hint: s.emailVerified
                      ? (0, S.jsxs)(`span`, {
                          className: `inline-flex items-center gap-1 text-success-subtle-foreground`,
                          children: [(0, S.jsx)(x, { className: `size-3.5`, 'aria-hidden': !0 }), ` `, e(`account.emailVerified`)],
                        })
                      : (0, S.jsxs)(`span`, {
                          className: `inline-flex items-center gap-1`,
                          children: [
                            (0, S.jsx)(t, { className: `size-3.5`, 'aria-hidden': !0 }),
                            ` `,
                            e(`account.emailUnverified`),
                            ` —`,
                            ` `,
                            (0, S.jsx)(l, {
                              to: `/verify-email`,
                              className: `font-medium text-primary-subtle-foreground hover:underline`,
                              children: e(`auth.verify.submit`),
                            }),
                          ],
                        }),
                    children: (0, S.jsx)(g, { value: s.email ?? ``, disabled: !0, readOnly: !0 }),
                  }),
                  (0, S.jsx)(m, {
                    label: e(`account.fullName`),
                    required: !0,
                    children: (0, S.jsx)(g, { name: `fullName`, required: !0, maxLength: 255, defaultValue: s.fullName }),
                  }),
                  (0, S.jsx)(m, {
                    label: `${e(`common.phone`)} (${e(`common.optional`)})`,
                    hint: e(`account.phoneHint`),
                    error: h(w.error, `phone`),
                    children: (0, S.jsx)(g, { name: `phone`, type: `tel`, defaultValue: s.phone }),
                  }),
                  (0, S.jsx)(m, {
                    label: e(`account.language`),
                    children: (0, S.jsxs)(_, {
                      name: `locale`,
                      defaultValue: s.locale ?? `LOCALE_VI`,
                      children: [
                        (0, S.jsx)(`option`, { value: `LOCALE_VI`, children: e(`language.vi`) }),
                        (0, S.jsx)(`option`, { value: `LOCALE_EN`, children: e(`language.en`) }),
                      ],
                    }),
                  }),
                  w.error && !h(w.error, `phone`) && (0, S.jsx)(u, { tone: `error`, title: d(e, w.error) }),
                  (0, S.jsx)(`div`, {
                    children: (0, S.jsx)(a, {
                      type: `submit`,
                      variant: `primary`,
                      loading: w.isPending,
                      children: w.isPending ? e(`common.saving`) : e(`common.save`),
                    }),
                  }),
                ],
              }),
            }),
          }),
        ],
      })
    : null
}
export { C as AccountPage }
