import { At as e, Dt as t, Et as n, Ot as r, S as i } from './api-lC4u2sZi.js'
import { t as a } from './StatusBadge-DknRod1K.js'
import { n as o, t as s } from './VehicleFormModal-Bq-J6gjN.js'
import { a as c, i as l, n as u, o as d, r as f, s as p } from './Table-dqUq80Ez.js'
import { A as m, D as h, I as g, z as _ } from './index-CbGLOUZk.js'
import { n as v, r as y } from './api-yVqfsw1B.js'
import { t as b } from './DeleteOrDeactivateDialog-6iREBBMO.js'
import { t as x } from './RowActions-Ubkh3T0m.js'
var S = e(r(), 1),
  C = t()
function w({ garageId: e, vehicles: t, showOwner: r, canWrite: w }) {
  let { t: T } = i(),
    E = n(),
    [D, O] = (0, S.useState)(null),
    [k, A] = (0, S.useState)(null),
    j = () => {
      ;(E.invalidateQueries({ queryKey: y(e) }), E.invalidateQueries({ queryKey: [`garages`, e, `customers`] }))
    },
    M = async (t) => {
      try {
        ;(await v.lifecycle(e, t.id ?? ``).activate(), g.success(T(`lifecycle.activated`, { subject: t.licensePlate })), j())
      } catch (e) {
        g.error(h(T, e))
      }
    }
  return (0, C.jsxs)(C.Fragment, {
    children: [
      (0, C.jsxs)(u, {
        caption: T(`vehicles.title`),
        children: [
          (0, C.jsx)(c, {
            children: (0, C.jsxs)(`tr`, {
              children: [
                (0, C.jsx)(d, { children: T(`vehicles.plate`) }),
                (0, C.jsx)(d, { children: T(`vehicles.make`) }),
                (0, C.jsx)(d, { children: T(`vehicles.model`) }),
                (0, C.jsx)(d, { numeric: !0, children: T(`vehicles.year`) }),
                (0, C.jsx)(d, { children: T(`vehicles.vin`) }),
                r && (0, C.jsx)(d, { children: T(`vehicles.customer`) }),
                w &&
                  (0, C.jsx)(d, {
                    className: `w-px`,
                    children: (0, C.jsx)(`span`, { className: `sr-only`, children: T(`common.actions`) }),
                  }),
              ],
            }),
          }),
          (0, C.jsx)(f, {
            children: t.map((e) =>
              (0, C.jsxs)(
                p,
                {
                  children: [
                    (0, C.jsxs)(l, {
                      primary: !0,
                      label: T(`vehicles.plate`),
                      children: [
                        (0, C.jsx)(m, {
                          to: `/vehicles/${e.id}`,
                          className: `rounded-sm`,
                          'aria-label': e.licensePlate,
                          children: (0, C.jsx)(_, { children: e.licensePlate ?? `` }),
                        }),
                        e.editable === !1 &&
                          (0, C.jsx)(`span`, {
                            className: `ml-2 inline-block align-middle text-muted-foreground`,
                            title: T(`vehicles.lockedTitle`),
                            children: (0, C.jsx)(o, { className: `size-3.5`, 'aria-label': T(`vehicles.lockedTitle`) }),
                          }),
                        e.isActive === !1 &&
                          (0, C.jsx)(`span`, {
                            className: `ml-2 inline-block align-middle`,
                            children: (0, C.jsx)(a, { tone: `neutral`, label: T(`common.inactive`) }),
                          }),
                      ],
                    }),
                    (0, C.jsx)(l, { label: T(`vehicles.make`), children: e.make || `—` }),
                    (0, C.jsx)(l, { label: T(`vehicles.model`), children: e.model || `—` }),
                    (0, C.jsx)(l, { numeric: !0, label: T(`vehicles.year`), children: e.year || `—` }),
                    (0, C.jsx)(l, {
                      label: T(`vehicles.vin`),
                      className: `font-mono text-caption text-muted-foreground`,
                      children: e.vin || `—`,
                    }),
                    r &&
                      (0, C.jsx)(l, {
                        label: T(`vehicles.customer`),
                        children: (0, C.jsx)(m, {
                          to: `/customers/${e.customerId}`,
                          className: `hover:text-primary-subtle-foreground hover:underline`,
                          children: e.customerName,
                        }),
                      }),
                    w &&
                      (0, C.jsx)(l, {
                        actions: !0,
                        children: (0, C.jsx)(x, {
                          subject: e.licensePlate ?? ``,
                          onEdit: () => O(e),
                          onDelete: () => A(e),
                          onActivate: e.isActive === !1 ? () => void M(e) : void 0,
                        }),
                      }),
                  ],
                },
                e.id,
              ),
            ),
          }),
        ],
      }),
      D &&
        (0, C.jsx)(s, {
          vehicle: D,
          ownerName: D.customerName ?? ``,
          onClose: () => O(null),
          onSave: async (t) => {
            ;(await v.update(e, D.id ?? ``, t), j(), O(null))
          },
        }),
      k &&
        (0, C.jsx)(b, {
          subject: k.licensePlate ?? ``,
          previewKey: [`vehicles`, e, k.id],
          preview: v.lifecycle(e, k.id ?? ``).preview,
          remove: v.lifecycle(e, k.id ?? ``).remove,
          onClose: () => A(null),
          onDone: j,
        }),
    ],
  })
}
export { w as t }
