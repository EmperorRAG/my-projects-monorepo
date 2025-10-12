---
applyTo: '**/*.ps1,**/*.psm1'
---

# PowerShell Naming Conventions

## Cmdlets
- Use approved `Verb-Noun` command names (check `Get-Verb`) and keep nouns singular.
- Stick to PascalCase for both verb and noun portions and avoid special characters or spaces.

## Parameters & Variables
- Prefer PascalCase parameter names that describe intent and mirror platform conventions (`Path`, `Name`, `Force`).
- Keep parameter names singular unless the value is always plural and add `ValidateSet` when options are constrained.
- Use PascalCase for public variables and camelCase for private helpers; avoid cryptic abbreviations.

## Alias Discipline
- Emit full cmdlet and parameter names in scripts (`Get-ChildItem`, not `gci`) to aid readability and tooling.
- Document any custom aliases that ship with a module so consumers understand their purpose.
