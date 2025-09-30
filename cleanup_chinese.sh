#!/bin/bash

# Scan repository for CJK characters (Chinese/Japanese/Korean) in tracked files
# Usage: ./cleanup_chinese.sh [path]
# If a path is provided, the scan will be limited to that path; otherwise it scans the current repo.

set -euo pipefail

TARGET_PATH="${1:-.}"

# Regex that matches common CJK Unicode ranges
CJK_REGEX='[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]'

echo "Scanning for CJK characters in: ${TARGET_PATH}"

# Exclude common third-party/vendor directories
EXCLUDES=(
  "node_modules"
  "android"
  "ios"
  "vendor"
  ".git"
)

# Build find command with excludes
FIND_CMD=(find "$TARGET_PATH" -type f)
for ex in "${EXCLUDES[@]}"; do
  FIND_CMD+=( -not -path "*/${ex}/*" )
done

HAS_ISSUES=0

# Iterate files and grep for CJK
while IFS= read -r file; do
  if grep -qU -E "$CJK_REGEX" "$file" 2>/dev/null; then
    echo "Found CJK characters in: $file"
    HAS_ISSUES=1
  fi
done < <("${FIND_CMD[@]}")

if [[ "$HAS_ISSUES" -eq 0 ]]; then
  echo "No CJK characters found in scanned files."
else
  echo "CJK characters were found. Please remove or translate them to ASCII."
  exit 1
fi
