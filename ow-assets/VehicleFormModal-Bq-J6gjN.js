import { Dt as e, S as t, q as n } from './api-lC4u2sZi.js'
import { St as r } from './index-CbGLOUZk.js'
import { n as i } from './form-Bpp5E52a.js'
import { t as a } from './FormModal-O5Cwhy1v.js'
var o = n(`lock`, [
    [`rect`, { width: `18`, height: `11`, x: `3`, y: `11`, rx: `2`, ry: `2`, key: `1w4ew1` }],
    [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }],
  ]),
  s = e(),
  c = {
    VEHICLE_IDENTITY_FIELD_LICENSE_PLATE: `licensePlate`,
    VEHICLE_IDENTITY_FIELD_VIN: `vin`,
    VEHICLE_IDENTITY_FIELD_ENGINE_NUMBER: `engineNumber`,
    VEHICLE_IDENTITY_FIELD_MAKE: `make`,
    VEHICLE_IDENTITY_FIELD_MODEL: `model`,
    VEHICLE_IDENTITY_FIELD_YEAR: `year`,
  }
function l({ vehicle: e, ownerName: n, onClose: o, onSave: l }) {
  let { t: u } = t(),
    d = new Set((e?.lockedFields ?? []).map((e) => c[e]))
  return (0, s.jsx)(a, {
    titleId: `vehicle-form`,
    icon: (0, s.jsx)(r, { size: 22 }),
    title: u(e ? `vehicles.editTitle` : `vehicles.createTitle`),
    description: `${u(`vehicles.customer`)}: ${n}${d.size > 0 ? ` — ${u(`vehicles.lockedHint`)}` : ``}`,
    fields: [
      { name: `licensePlate`, label: u(`vehicles.plate`), placeholder: `51F-123.45`, required: !0, maxLength: 20 },
      { name: `make`, label: u(`vehicles.make`), placeholder: `Toyota`, maxLength: 100 },
      { name: `model`, label: u(`vehicles.model`), placeholder: `Vios`, maxLength: 100 },
      { name: `year`, label: u(`vehicles.year`), type: `number`, min: 1886, max: new Date().getFullYear() + 1 },
      { name: `vin`, label: u(`vehicles.vin`), maxLength: 50 },
      { name: `engineNumber`, label: u(`vehicles.engine`), maxLength: 50 },
    ].map((e) => (d.has(e.name) ? { ...e, disabled: !0, hint: u(`vehicles.fieldLocked`) } : e)),
    values: e
      ? { licensePlate: e.licensePlate, make: e.make, model: e.model, year: e.year || ``, vin: e.vin, engineNumber: e.engineNumber }
      : void 0,
    submitLabel: u(e ? `common.save` : `common.create`),
    onClose: o,
    onSave: (e) => {
      let t = {
        licensePlate: i(e, `licensePlate`),
        make: i(e, `make`),
        model: i(e, `model`),
        year: Number(i(e, `year`)) || 0,
        vin: i(e, `vin`),
        engineNumber: i(e, `engineNumber`),
      }
      for (let e of d) delete t[e]
      return l(t)
    },
  })
}
export { o as n, l as t }
