import { i as e, n as t } from './api-lC4u2sZi.js'
import { m as n } from './index-CbGLOUZk.js'
var r = {
  list: async (e) => (await t.get(`${n(e)}/staff`)).data ?? [],
  update: (e, r, i) => t.patch(`${n(e)}/staff/${encodeURIComponent(r)}`, i),
  remove: (e, r) => t.delete(`${n(e)}/staff/${encodeURIComponent(r)}`),
  lookup: (r, i) => t.get(`${n(r)}/staff-candidates${e({ query: i })}`),
  invitations: async (r, i) => (await t.get(`${n(r)}/invitations${e({ status: i })}`)).data ?? [],
  invite: (e, r, i) => t.post(`${n(e)}/invitations`, { userId: r, groupIds: i }),
  revoke: (e, r) => t.post(`${n(e)}/invitations/${encodeURIComponent(r)}/revoke`),
}
function i(e) {
  return [`garages`, e, `staff`]
}
function a(e) {
  return [`garages`, e, `invitations`]
}
export { r as n, i as r, a as t }
