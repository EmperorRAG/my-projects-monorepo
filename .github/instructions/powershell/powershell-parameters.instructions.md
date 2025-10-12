---
applyTo: '**/*.ps1,**/*.psm1'
---

# PowerShell Parameter Design

## Shape & Validation
- Model parameters with .NET types that reflect expected input and add validation attributes (`ValidateSet`, `ValidateNotNullOrEmpty`).
- Default `switch` parameters off so callers opt into side effects and pair them with clear action names.

## Pipeline Support
- When accepting pipeline input, set `ValueFromPipeline` or `ValueFromPipelineByPropertyName` and implement `begin/process/end` blocks.
- Keep parameter sets purposeful and document how pipeline binding is expected to work.

## Consistency
- Reuse standard names (`Path`, `Credential`, `Force`) so scripts feel idiomatic.
- Accept parameters rather than prompting with `Read-Host` to keep scripts automation-friendly.
