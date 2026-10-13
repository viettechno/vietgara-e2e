#!/bin/sh
# Fetch the pinned shared test dataset into .testdata/ (gitignored).
#
# Mirrors vietgara-backend/make/testdata.mk: `testdata.version` names the tag
# of https://github.com/viettechno/vietgara-testdata.git, and this script
# clones (or fast-forwards) exactly that tag. `npm run testdata` runs it.
set -eu

REPOSITORY=https://github.com/viettechno/vietgara-testdata.git
VERSION_FILE=testdata.version
TARGET_DIR=${TESTDATA_DIR:-.testdata}

version=$(tr -d '\r\n' <"$VERSION_FILE")
case "$version" in
v[0-9]*.[0-9]*.[0-9]*) ;;
*)
  printf 'Invalid testdata version in %s: %s\n' "$VERSION_FILE" "$version" >&2
  exit 1
  ;;
esac

if [ -e "$TARGET_DIR" ]; then
  if [ ! -d "$TARGET_DIR/.git" ]; then
    printf 'Testdata path exists but is not a Git checkout: %s\n' "$TARGET_DIR" >&2
    exit 1
  fi
  remote=$(git -C "$TARGET_DIR" remote get-url origin)
  case "$remote" in
  "$REPOSITORY" | git@github.com:viettechno/vietgara-testdata.git | ssh://git@github.com/viettechno/vietgara-testdata.git) ;;
  *)
    printf 'Unexpected testdata origin at %s: %s\n' "$TARGET_DIR" >&2
    exit 1
    ;;
  esac
  if [ -n "$(git -C "$TARGET_DIR" status --porcelain)" ]; then
    printf 'Testdata checkout has local changes; refusing to update %s\n' "$TARGET_DIR" >&2
    exit 1
  fi
  git -C "$TARGET_DIR" fetch --depth 1 origin "refs/tags/$version:refs/tags/$version"
  git -C "$TARGET_DIR" checkout --detach "$version"
else
  mkdir -p "$(dirname "$TARGET_DIR")"
  git clone --depth 1 --branch "$version" "$REPOSITORY" "$TARGET_DIR"
fi

printf 'testdata %s ready at %s\n' "$version" "$TARGET_DIR"
