function e(e) {
  return { items: e.data ?? [], total: e.pagination?.total ?? 0, page: e.pagination?.page ?? 1, pageSize: e.pagination?.pageSize ?? 20 }
}
export { e as t }
