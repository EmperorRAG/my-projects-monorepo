---
applyTo: '**/*.ps1,**/*.psm1'
---

# PowerShell Documentation & Style

## Comment-Based Help
- Include help blocks with `.SYNOPSIS`, `.DESCRIPTION`, `.PARAMETER`, and `.EXAMPLE` entries for any public cmdlet.
- Note default values and side effects within help text so automation consumers know what to expect.

## Formatting
- Use four-space indentation, keep braces on the same line as declarations, and break long pipelines across lines.
- Remove unused whitespace and keep naming consistent with PascalCase for cmdlets and snake_case never used.

## Alias Policy
- Avoid shorthand aliases in committed scripts (`Where-Object`, not `?`) so readability and linting stay strong.
- Document any module-defined aliases and ensure they expand to approved cmdlets.
