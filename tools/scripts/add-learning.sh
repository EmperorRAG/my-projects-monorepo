#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: add-learning.sh --tech <name> --title <text> --if <text> --when <text> --then <text> --solution <text>

Records a learning entry in docs/learnings/<tech>.md using the If/When/Then format.

Options:
  --tech       Technology or domain the learning belongs to (kebab-case recommended).
  --title      Short descriptive title for the learning.
  --if         Situation or initial condition for the problem.
  --when       Trigger that exposes the problem.
  --then       Resulting outcome or failure.
  --solution   Concise explanation of the fix or mitigation.
  --help       Show this help message.
EOF
}

TECH=""
TITLE=""
IF_TEXT=""
WHEN_TEXT=""
THEN_TEXT=""
SOLUTION=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tech)
      TECH="${2:-}"
      shift 2
      ;;
    --title)
      TITLE="${2:-}"
      shift 2
      ;;
    --if)
      IF_TEXT="${2:-}"
      shift 2
      ;;
    --when)
      WHEN_TEXT="${2:-}"
      shift 2
      ;;
    --then)
      THEN_TEXT="${2:-}"
      shift 2
      ;;
    --solution)
      SOLUTION="${2:-}"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

for var_name in TECH TITLE IF_TEXT WHEN_TEXT THEN_TEXT SOLUTION; do
  if [[ -z "${!var_name}" ]]; then
    echo "Missing required option: ${var_name,,}" >&2
    usage
    exit 1
  fi
done

REPO_ROOT=$(git rev-parse --show-toplevel)
LEARNINGS_DIR="$REPO_ROOT/docs/learnings"
TECH_FILE="$LEARNINGS_DIR/${TECH}.md"

mkdir -p "$LEARNINGS_DIR"

tech_display=$(echo "$TECH" | sed -E 's/[-_]/ /g')
tech_title=$(echo "$tech_display" | awk '{for (i = 1; i <= NF; i++) { $i = toupper(substr($i,1,1)) substr($i,2) } print}')

if [[ ! -f "$TECH_FILE" ]]; then
  {
    echo "# ${tech_title} Learnings"
    echo
    echo "This file captures problems and solutions for ${tech_title}."
  } > "$TECH_FILE"
fi

{
  echo
  echo "## ${TITLE}"
  echo "- **If:** ${IF_TEXT}"
  echo "- **When:** ${WHEN_TEXT}"
  echo "- **Then:** ${THEN_TEXT}"
  echo "- **Solution:** ${SOLUTION}"
} >> "$TECH_FILE"

echo "Learning recorded in ${TECH_FILE}"