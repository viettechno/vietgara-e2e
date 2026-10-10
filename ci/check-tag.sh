#!/usr/bin/env bash
# Fails when an image tag does not exist on ghcr.io, and then lists the newest tags.
#
#   ci/check-tag.sh <package> <tag>
#
# The packages are public, so anonymous access is enough (same as resolve-tag.sh).
set -euo pipefail

package=${1:?usage: check-tag.sh <package> <tag>}
tag=${2:?usage: check-tag.sh <package> <tag>}

token=$(curl -fsS "https://ghcr.io/token?service=ghcr.io&scope=repository:viettechno/${package}:pull" |
  python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')

accept='application/vnd.oci.image.index.v1+json,application/vnd.docker.distribution.manifest.list.v2+json,application/vnd.oci.image.manifest.v1+json,application/vnd.docker.distribution.manifest.v2+json'
status=$(curl -sS -o /dev/null -w '%{http_code}' -I -H "Authorization: Bearer ${token}" -H "Accept: ${accept}" \
  "https://ghcr.io/v2/viettechno/${package}/manifests/${tag}")

if [ "$status" = "200" ]; then
  echo "ok: ghcr.io/viettechno/${package}:${tag}"
  exit 0
fi

echo "::error::ghcr.io/viettechno/${package}:${tag} was not found (HTTP ${status})" >&2
echo "Newest tags of ${package}:" >&2
curl -fsS -H "Authorization: Bearer ${token}" "https://ghcr.io/v2/viettechno/${package}/tags/list?n=1000" |
  python3 -c 'import json,sys; print("\n".join(json.load(sys.stdin).get("tags") or []))' |
  grep -E '^v[0-9]' | sort -V | tail -15 | sed 's/^/  /' >&2 || true
exit 1
