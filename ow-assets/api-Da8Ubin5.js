import { n as e } from './api-lC4u2sZi.js'
import { m as t } from './index-CbGLOUZk.js'
var n = {
    permissions: async () => (await e.get(`/permissions`)).data ?? [],
    list: async () => (await e.get(`/roles`)).data ?? [],
    create: (t) => e.post(`/roles`, t),
    update: (t, n) => e.patch(`/roles/${encodeURIComponent(t)}`, n),
    remove: (t) => e.delete(`/roles/${encodeURIComponent(t)}`),
  },
  r = {
    list: async (n) => (await e.get(`${t(n)}/staff-groups`)).data ?? [],
    create: (n, r) => e.post(`${t(n)}/staff-groups`, r),
    update: (n, r, i) => e.patch(`${t(n)}/staff-groups/${encodeURIComponent(r)}`, i),
    remove: (n, r) => e.delete(`${t(n)}/staff-groups/${encodeURIComponent(r)}`),
  },
  i = [`roles`],
  a = [`permissions`]
function o(e) {
  return [`garages`, e, `staff-groups`]
}
export { i as a, n as i, o as n, a as r, r as t }
