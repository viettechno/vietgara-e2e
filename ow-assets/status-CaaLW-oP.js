var e = [
  `REPAIR_ORDER_STATUS_OPEN`,
  `REPAIR_ORDER_STATUS_IN_PROGRESS`,
  `REPAIR_ORDER_STATUS_WAITING_ON_PARTS`,
  `REPAIR_ORDER_STATUS_COMPLETED`,
]
function t(e) {
  switch (e) {
    case `REPAIR_ORDER_STATUS_IN_PROGRESS`:
      return `info`
    case `REPAIR_ORDER_STATUS_WAITING_ON_PARTS`:
      return `pending`
    case `REPAIR_ORDER_STATUS_COMPLETED`:
      return `active`
    default:
      return `neutral`
  }
}
function n(e) {
  return `repairOrders.status.${e ?? `REPAIR_ORDER_STATUS_OPEN`}`
}
export { n, t as r, e as t }
