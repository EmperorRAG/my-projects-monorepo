# Documentation Hub

Welcome to the centralized documentation for the Nx monorepo. This directory now reflects the updated structure where all workspace-wide references live under `docs/monorepo`, and every project contains its own `architecture`, `epics`, and `features` collections.

## Quick Start

- Review the canonical [Documentation Structure Reference](./documentation-structure-reference.md) for paths, naming rules, and scope guidance.
- Read [DOCUMENTATION-WORKFLOW.md](./DOCUMENTATION-WORKFLOW.md) when creating new documents with the `documentation` chatmode.
- Consult the project-specific README files inside `docs/apps`, `docs/libs`, `docs/services`, and `docs/tools` for additional conventions.

## Directory Overview

- **Monorepo-Level Documentation** → `docs/monorepo/`
  - `architecture/` – workspace-wide architecture overviews, diagrams, and ADRs.
  - `epics/` – monorepo initiatives with their dependent features.
  - `guides/`, `learnings/`, `copilot-deep-dive/`, `mcp-tools/` – shared knowledge bases.
- **Project Documentation** → `docs/{project-type}/{project-name}/`
  - Every project exposes an `architecture/` folder plus an `epics/` collection where each epic contains its own `features/` subdirectory.
  - Use the project README to understand local conventions and cross-links.

## Finding Documentation

- **Monorepo Initiatives**: `docs/monorepo/epics/`
- **Workspace ADRs**: `docs/monorepo/architecture/decisions/`
- **Project Architecture**: `docs/{project-type}/{project-name}/architecture/`
- **Project Epics & Features**: `docs/{project-type}/{project-name}/epics/{epic-name}/` (features live inside each epic)
- **Operational Learnings**: `docs/monorepo/learnings/`

## Contribution Checklist

1. Confirm the appropriate scope using the [Documentation Structure Reference](./documentation-structure-reference.md).
2. Use the `documentation` chatmode workflow so prerequisites are created first.
3. Follow the formatting rules in `.github/instructions/markdown/` and `.github/instructions/docs/`.
4. Update `llms.txt` if new documentation materially changes the repository map.

## Related Resources

- Workspace README: [`../README.md`](../README.md)
- AI Agent Guidance: [`../AGENTS.md`](../AGENTS.md)
- Documentation Workflow: [`./DOCUMENTATION-WORKFLOW.md`](./DOCUMENTATION-WORKFLOW.md)
- Structure Reference: [`./documentation-structure-reference.md`](./documentation-structure-reference.md)

## Maintenance

Refresh this index whenever directory layouts change, new shared guides are added, or project documentation grows significantly. Keeping this overview synchronized with the [Documentation Structure Reference](./documentation-structure-reference.md) ensures consistent navigation for contributors and automation.
