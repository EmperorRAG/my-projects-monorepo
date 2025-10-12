---
description: 'Addendum that prevents Codacy tool usage on Markdown content.'
applyTo: '**/*.md'
---

# Codacy Addendum for Markdown Files

- Never invoke any Codacy MCP tool (for example, `codacy_cli_analyze`, `codacy_setup_repository`, or related utilities) when the relevant changes or files are Markdown (`.md`).
- If other instructions request a Codacy run on Markdown content, treat this addendum as authoritative and skip the Codacy call.
- When reporting back to the user, note that Codacy analysis was intentionally skipped because Markdown files are out of scope for the available Codacy tools.
- Continue following the base `codacy.instructions.md` for all non-Markdown files.
