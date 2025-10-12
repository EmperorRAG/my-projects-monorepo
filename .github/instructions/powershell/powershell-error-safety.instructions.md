---
applyTo: '**/*.ps1,**/*.psm1'
---

# PowerShell Error Handling & Safety

## ShouldProcess
- Decorate mutating cmdlets with `[CmdletBinding(SupportsShouldProcess = $true)]` and call `$PSCmdlet.ShouldProcess()` before changing state.
- Set `ConfirmImpact` appropriately and fall back to `ShouldContinue()` for destructive operations.

## Exception Strategy
- Wrap operations in `try/catch` and emit actionable error messages; use specific exception types when possible.
- Respect `$ErrorActionPreference` and expose `-ErrorAction` / `-ErrorVariable` so callers control error flow.

## Non-Interactive Design
- Accept all input via parameters, never `Read-Host`, so scripts run unattended.
- Validate preconditions (existence checks, permissions) before executing side effects to reduce partial changes.
