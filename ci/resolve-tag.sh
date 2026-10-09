#!/usr/bin/env bash
# Prints the image tag to test for a published VietGara image.
#
#   ci/resolve-tag.sh <package> [requested-tag]
#
# With a requested tag it is printed as is. Otherwise the newest release-style
# tag of ghcr.io/viettechno/<package> is looked up with anonymous access (the
# packages are public). Tags are `git describe` strings (v1.5.0, v1.5.0-4-g0c94831),
# which `sort -V` orders correctly; bare commit hashes are ignored.
set -euo pipefail

package=${1:?usage: resolve-tag.sh <package> [requested-tag]}
requested=${2:-}

if [ -n "$requested" ]; then
  echo "$requested"
  exit 0
fi

token=$(curl -fsS "https://ghcr.io/token?service=ghcr.io&scope=repository:viettechno/${package}:pull" |
  python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')

tag=$(curl -fsS -H "Authorization: Bearer ${token}" "https://ghcr.io/v2/viettechno/${package}/tags/list?n=1000" |
  python3 -c 'import json,sys; print("\n".join(json.load(sys.stdin).get("tags") or []))' |
  grep -E '^v[0-9]' | sort -V | tail -1)

if [ -z "$tag" ]; then
  echo "no release tag found for ghcr.io/viettechno/${package}" >&2
  exit 1
fi
echo "$tag"
