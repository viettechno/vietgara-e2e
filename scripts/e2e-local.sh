#!/usr/bin/env bash
# Runs the whole E2E suite on this machine against images built from your own checkouts.
#
#   scripts/e2e-local.sh [playwright arguments]      (or: make e2e-local ARGS="…")
#
# 1. Finds out what the Docker daemon runs (linux/arm64 on an Apple-silicon Mac, linux/amd64 on an Intel
#    machine or a typical Linux box) and builds the three images for exactly that, so nothing is emulated.
# 2. Starts ci/compose.yml with those images (tag `local`), seeds the baseline, runs the suite, and removes the
#    stack and its data again.
#
# The backend and the two web apps are built from the checkouts next to this repository.
#
# Settings (environment variables):
#   BACKEND_DIR, OWNER_WEB_DIR, ADMIN_WEB_DIR   where the checkouts are (default: ../vietgara-backend, ...)
#   PLATFORM       force a target, e.g. linux/amd64 to test the image that production runs (slow: emulated)
#   SKIP_BUILD=1   reuse the images tagged `local`, after checking that they are for this platform
#   KEEP=1         leave the stack running afterwards (http://localhost:8000, Mailpit on :8025)
#   GREP           only the scenarios whose title matches, e.g. GREP=E2E-IAM-001
#   KONG_PROXY_PORT, MAILPIT_UI_PORT, PG_PORT   host ports (default 8000, 8025, 15432)
set -euo pipefail

cd "$(dirname "$0")/.."
parent=$(cd .. && pwd)

BACKEND_DIR=${BACKEND_DIR:-$parent/vietgara-backend}
OWNER_WEB_DIR=${OWNER_WEB_DIR:-$parent/vietgara-owner-web}
ADMIN_WEB_DIR=${ADMIN_WEB_DIR:-$parent/vietgara-admin-web}
SKIP_BUILD=${SKIP_BUILD:-}
KEEP=${KEEP:-}
GREP=${GREP:-}
registry=ghcr.io/viettechno

die() {
  printf '✗ %s\n' "$*" >&2
  exit 1
}

step() {
  printf '\n▶ %s\n' "$*"
}

command -v docker >/dev/null || die "docker is not installed."
docker info >/dev/null 2>&1 || die "The Docker daemon is not running. Start Docker Desktop (or the docker service) first."
command -v npm >/dev/null || die "npm is not installed (the suite needs Node.js)."

# --- Platform -----------------------------------------------------------------------------------------------------

# Maps what Docker or uname reports to the name Docker's --platform uses.
arch_name() {
  case "$1" in
    aarch64 | arm64) echo arm64 ;;
    x86_64 | amd64) echo amd64 ;;
    *) die "Unsupported CPU architecture: $1" ;;
  esac
}

host="$(uname -s) $(uname -m)"
daemon_os=$(docker info --format '{{.OSType}}')
daemon_arch=$(arch_name "$(docker info --format '{{.Architecture}}')")
[ "$daemon_os" = linux ] || die "The Docker daemon runs $daemon_os containers; this stack needs Linux containers."

if [ -n "${PLATFORM:-}" ]; then
  platform=$PLATFORM
  reason="forced by PLATFORM"
else
  platform=linux/$daemon_arch
  reason="what the Docker daemon runs"
fi
target_arch=${platform#linux/}

step "Platform"
printf '  Host:           %s\n  Docker daemon:  linux/%s\n  Building for:   %s (%s)\n' "$host" "$daemon_arch" "$platform" "$reason"
if [ "$target_arch" != "$daemon_arch" ]; then
  printf '  Note: the daemon runs linux/%s, so these containers are emulated and much slower.\n' "$daemon_arch"
fi

# One platform for the builds and for every container that Compose starts. An exported DOCKER_DEFAULT_PLATFORM
# from the shell (for example linux/amd64, set to run the published backend image on a Mac) would otherwise make
# Compose ask for the wrong image.
export DOCKER_DEFAULT_PLATFORM=$platform

# --- Images -------------------------------------------------------------------------------------------------------

images="vietgara-backend:$BACKEND_DIR vietgara-owner-web:$OWNER_WEB_DIR vietgara-admin-web:$ADMIN_WEB_DIR"

if [ -n "$SKIP_BUILD" ]; then
  step "Reusing the images tagged local"
  for entry in $images; do
    name=${entry%%:*}
    have=$(docker image inspect --format '{{.Os}}/{{.Architecture}}' "$registry/$name:local" 2>/dev/null) ||
      die "$registry/$name:local does not exist; run without SKIP_BUILD."
    [ "$have" = "$platform" ] || die "$registry/$name:local is for $have, not $platform; run without SKIP_BUILD."
    printf '  %s: %s\n' "$name" "$have"
  done
else
  for entry in $images; do
    name=${entry%%:*}
    dir=${entry#*:}
    [ -f "$dir/Dockerfile" ] || die "No Dockerfile in $dir. Clone $name next to this repository, or set its directory (see the top of this script)."
    step "Building $name for $platform"
    docker build --platform "$platform" -t "$registry/$name:local" "$dir"
  done
fi

# --- Suite dependencies -------------------------------------------------------------------------------------------

step "Installing the suite's dependencies and the test dataset"
[ -d node_modules ] || npm ci
npx playwright install chromium
npm run testdata

# --- Stack --------------------------------------------------------------------------------------------------------

export BACKEND_TAG=local OWNER_WEB_TAG=local ADMIN_WEB_TAG=local
kong_port=${KONG_PROXY_PORT:-8000}
mailpit_port=${MAILPIT_UI_PORT:-8025}
pg_port=${PG_PORT:-15432}
export KONG_PROXY_PORT=$kong_port MAILPIT_UI_PORT=$mailpit_port PG_PORT=$pg_port

export WEB_BASE_URL=http://localhost:$kong_port
export ADMIN_WEB_BASE_URL=http://admin.localhost:$kong_port
export API_BASE_URL=$WEB_BASE_URL/api
export MAILPIT_URL=http://localhost:$mailpit_port
export DATABASE_URL=postgres://user:password@localhost:$pg_port/vietgara

compose() {
  docker compose -f ci/compose.yml "$@"
}

started=
cleanup() {
  rc=$?
  trap - EXIT
  if [ -n "$started" ]; then
    if [ "$rc" -ne 0 ]; then
      step "Stack logs (last 100 lines)"
      compose logs --no-color --tail 100 || true
    fi
    if [ -n "$KEEP" ]; then
      printf '\nThe stack is still running: %s (Mailpit %s). Stop it with: make e2e-local-down\n' "$WEB_BASE_URL" "$MAILPIT_URL"
    else
      step "Removing the stack and its data"
      compose down -v --remove-orphans >/dev/null 2>&1 || true
    fi
  fi
  exit "$rc"
}
trap cleanup EXIT

step "Starting the stack"
compose down -v --remove-orphans >/dev/null 2>&1 || true
started=1
compose up -d --wait

# The backend grants PLATFORM_ADMIN_EMAILS only at startup, so the seeded platform admin takes effect after a
# restart: seed with the baseline spec, restart, wait until healthy (the same steps as .github/workflows/e2e.yml).
step "Seeding the baseline and restarting the backend for the admin grant"
npx playwright test tests/testdata/baseline.spec.ts --reporter=line
compose restart backend
backend_id=$(compose ps -q backend)
for i in $(seq 1 36); do
  status=$(docker inspect "$backend_id" --format '{{.State.Health.Status}}' 2>/dev/null || echo starting)
  [ "$status" = healthy ] && break
  [ "$i" = 36 ] && die "The backend did not become healthy again."
  sleep 5
done
npx wait-on "$WEB_BASE_URL" -t 120000

# --- Suite --------------------------------------------------------------------------------------------------------

step "Running the suite"
run=(npx playwright test --grep-invert '@quarantine')
[ -n "$GREP" ] && run+=(--grep "$GREP")
"${run[@]}" "$@"

printf '\n✓ Done. Open the report with: npm run report\n'
