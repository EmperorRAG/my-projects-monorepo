---
applyTo: '**/*.ps1,**/*.psm1'
---

# PowerShell Pipeline & Output Patterns

## Streaming Practices
- Emit one object per `process` iteration and prefer returning structured objects over formatted strings.
- Avoid collecting large arrays before output; let the pipeline handle streaming work to downstream cmdlets.

## Object Shape
- Use `PSCustomObject` or strongly typed classes to expose rich properties instead of relying on `Write-Host`.
- Offer a `-PassThru` switch when a command normally performs actions without output but callers may need the modified object.

## Verbose & Diagnostics
- Send status text to `Write-Verbose` or `Write-Warning` so callers can opt-in without polluting pipeline output.
- Reserve `Write-Error` for error records and throw terminating exceptions when work cannot continue.
