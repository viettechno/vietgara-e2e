function e(e) {
  switch (e) {
    case `SETTLEMENT_STATUS_PAID`:
      return `active`
    case `SETTLEMENT_STATUS_PARTIALLY_PAID`:
      return `info`
    default:
      return `pending`
  }
}
function t(e) {
  return `settlements.status.${e ?? `SETTLEMENT_STATUS_PENDING`}`
}
export { e as n, t }
