// Central place reading the environment (see .env.example / README
// "Environments"). Nothing else in the codebase should read process.env
// directly, so every place that needs an address goes through here.
export const env = {
  webBaseUrl: process.env.WEB_BASE_URL ?? 'http://localhost:8000',
  // Trailing slash matters: relative request paths (no leading slash, see
  // src/api/http.ts) resolve against this per normal URL rules, and a
  // missing trailing slash would drop the last path segment (here, /api).
  apiBaseUrl: ensureTrailingSlash(process.env.API_BASE_URL ?? 'http://localhost:8000/api'),
  mailpitUrl: process.env.MAILPIT_URL ?? 'http://localhost:8025',
  platformAdminEmail: process.env.PLATFORM_ADMIN_EMAIL ?? 'qa.admin@vietgara.test',
  testAccountPassword: process.env.TEST_ACCOUNT_PASSWORD ?? 'Qa@123456',
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}
