// A thin JSON client over Playwright's APIRequestContext, matching the
// conventions of vietgara-web-admin/src/lib/api.ts (same error envelope,
// same REST paths) but built for test setup: it never touches localStorage
// or auto-refreshes -- each ApiClient instance is bound to one bearer token
// for the lifetime of one logical actor (see src/api/client.ts).
import type { APIRequestContext } from '@playwright/test'
import type { ApiErrorBody } from './types.js'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: Array<{ field?: string; issue?: string }>

  constructor(status: number, body: ApiErrorBody | undefined) {
    super(body?.error?.message ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.error?.code ?? 'INTERNAL'
    this.details = body?.error?.details ?? []
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function jsonRequest<T>(
  request: APIRequestContext,
  method: Method,
  path: string,
  options: { token?: string; body?: unknown } = {},
): Promise<T> {
  // A leading slash would resolve against the base URL's *origin*, not its
  // path (standard URL-resolution behaviour) -- silently dropping the
  // `/api` prefix in API_BASE_URL. Every ApiClient method path starts with
  // '/' for readability, so strip it here, in the one place that actually
  // joins against the context's baseURL.
  const relativePath = path.replace(/^\/+/, '')

  const response = await request.fetch(relativePath, {
    method,
    headers: {
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      'Accept-Language': 'en',
    },
    data: options.body,
  })

  if (response.status() === 204) return undefined as T

  const text = await response.text()
  const parsed: unknown = text ? JSON.parse(text) : undefined

  if (!response.ok()) throw new ApiError(response.status(), parsed as ApiErrorBody)

  return parsed as T
}

/** Builds a query string from the non-empty params, same rule as the web admin's `query()`. */
export function query(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}
