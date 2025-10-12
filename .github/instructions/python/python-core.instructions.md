---
applyTo: '**/*.py'
---

# Python Core Practices

## Clarity First
- Favor clear, purposeful function names and ensure every public function or method has an accompanying docstring.
- Break complex routines into small helpers so the control flow is easy to follow and future edits stay localized.

## Maintainability
- Capture the intent of tricky logic with brief comments that explain *why* decisions were made, not what the code does line-by-line.
- Note the purpose of any external dependency or library integration so future readers understand why it is required.

## Typing & Validation
- Add type hints using `typing` (for example `list[str]`, `dict[str, int]`) so interfaces remain explicit as the codebase grows.
- Validate inputs early, returning clear errors when values are missing or malformed, and document any non-obvious edge case handling.
