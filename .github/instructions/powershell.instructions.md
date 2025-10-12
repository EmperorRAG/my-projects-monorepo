---
applyTo: '**/*.ps1,**/*.psm1'
description: 'PowerShell cmdlet and scripting best practices based on Microsoft guidelines'
---
# PowerShell Instruction Module Index

Modular PowerShell guidance lives under `.github/instructions/powershell`. Each module has an `applyTo` scope so only relevant guidance loads for the script you are editing.

## Module Directory
- `powershell-naming.instructions.md` — Verb-Noun conventions, parameter naming, and alias discipline.
- `powershell-parameters.instructions.md` — Parameter sets, validation, and pipeline binding design.
- `powershell-pipeline-output.instructions.md` — Streaming patterns, structured output, and diagnostics etiquette.
- `powershell-error-safety.instructions.md` — `ShouldProcess`, exception handling, and non-interactive safety.
- `powershell-documentation-style.instructions.md` — Comment-based help, formatting, and alias policies.

Add new PowerShell modules to this directory and update the index whenever additional guidance is introduced.
