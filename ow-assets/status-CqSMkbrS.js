function e(e) {
  switch (e) {
    case `QUOTE_STATUS_SENT`:
      return `info`
    case `QUOTE_STATUS_APPROVED`:
      return `active`
    case `QUOTE_STATUS_REJECTED`:
      return `danger`
    default:
      return `neutral`
  }
}
function t(e) {
  return `quotes.status.${e ?? `QUOTE_STATUS_DRAFT`}`
}
export { e as n, t }
