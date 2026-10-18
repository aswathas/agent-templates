#!/bin/bash
# Verify commits are attributed to aswathas, not another account.
#
# GitHub maps a commit to a profile by its author email. An email belonging to
# a different account moves commits off your profile with no error. This catches it.
#
# Matching is on the address that actually resolves to the account, so both the
# plain email and the noreply form are accepted:
#
#   aswathas20@gmail.com
#   <id>+aswathas@users.noreply.github.com
#
# Anything else — notably aswathas13@gmail.com, which is the personal Gmail for
# the gws CLI and belongs to a different profile — is a real mismatch.
#
# Usage:  bash ~/check-attribution.sh [repo ...]     (default: cwd)

set -uo pipefail

NOREPLY_RE='^[0-9]+\+aswathas@users\.noreply\.github\.com$'
PLAIN_RE='^aswathas20@gmail\.com$'

check_repo() {
  local dir="$1"
  [ -d "$dir/.git" ] || { echo "skip  $dir (not a git repo)"; return; }

  local bad
  bad=$(git -C "$dir" log --format="%ae" 2>/dev/null | sort -u \
        | grep -Ev "$PLAIN_RE|$NOREPLY_RE" || true)

  if [ -n "$bad" ]; then
    echo "WRONG $dir"
    echo "$bad" | sed 's/^/        /'
    echo "        GitHub attributes these to whichever account owns them,"
    echo "        not necessarily to you."
  else
    local n
    n=$(git -C "$dir" rev-list --count HEAD 2>/dev/null)
    echo "ok    $dir ($n commits)"
  fi
}

if [ $# -gt 0 ]; then
  for r in "$@"; do check_repo "$r"; done
else
  check_repo "$(pwd)"
fi