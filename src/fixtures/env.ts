// Central place reading the environment (see .env.example / README
// "Environments"). Nothing else in the codebase should read process.env
// directly, so every place that needs an address goes through here.
export const env = {
  webBaseUrl: process.env.WEB_BASE_URL ?? 'http://localhost:8000',
  // The platform-admin SPA shares Kong with the owner web but on its own
  // host (ci/kong.yml: admin-web-route matches `admin.localhost`), so it
  // needs its own origin, not a path under WEB_BASE_URL.
  adminWebBaseUrl: process.env.ADMIN_WEB_BASE_URL ?? 'http://admin.localhost:8000',
  // Trailing slash matters: relative request paths (no leading slash, see
  // src/api/http.ts) resolve against this per normal URL rules, and a
  // missing trailing slash would drop the last path segment (here, /api).
  apiBaseUrl: ensureTrailingSlash(process.env.API_BASE_URL ?? 'http://localhost:8000/api'),
  mailpitUrl: process.env.MAILPIT_URL ?? 'http://localhost:8025',
  platformAdminEmail: process.env.PLATFORM_ADMIN_EMAIL ?? 'admin@vietgara.test',
  testUserPassword: process.env.TEST_USER_PASSWORD ?? 'Qa@123456',
  // Which `environments` section of the pinned dataset the seed reads
  // passwords from (`stubbed`). Staging keeps only `passwordRef`s there, so
  // the value comes from the TEST_USER_PASSWORD / ADMIN_PASSWORD secrets.
  seedEnv: process.env.SEED_ENV ?? 'stubbed',
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}
