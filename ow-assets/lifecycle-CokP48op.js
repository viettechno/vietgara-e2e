import { i as e, n as t } from './api-lC4u2sZi.js'
function n(e) {
  return e?.outcome === `DELETE_OUTCOME_DEACTIVATED` ? `deactivated` : `deleted`
}
function r(r) {
  return {
    preview: async () => n(await t.delete(`${r}${e({ dryRun: !0 })}`)),
    remove: async () => n(await t.delete(r)),
    activate: () => t.post(`${r}:activate`),
  }
}
export { r as t }
