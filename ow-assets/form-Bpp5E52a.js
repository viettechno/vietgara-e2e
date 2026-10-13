function e(e, t) {
  return String(e.get(t) ?? ``).trim()
}
function t(e, t) {
  return e.get(t) === `on`
}
function n(e, t) {
  return e.getAll(t).map(String)
}
export { e as n, n as r, t }
