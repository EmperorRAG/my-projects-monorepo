# Documentation Structure Reference

## Purpose

- Provide a single source of truth for documentation paths, names, and scope decisions.
- Help automation (including the documentation chatmode) resolve directories without hardcoded values.
- Guide contributors when organizing new or existing documentation.

## Monorepo-Level Collections

```text
docs/monorepo/
├── architecture/
│   ├── overview.md
│   ├── diagrams/
│   └── decisions/              # Workspace-wide ADRs (adr-0001-*.md)
├── epics/
│   └── {epic-name}/
│       ├── epic.md             # Epic PRD
│       ├── arch.md             # Epic Architecture
│       └── features/
│           └── {feature-name}/
│               ├── prd.md      # Feature PRD
│               └── implementation-plan.md
├── guides/
├── learnings/
├── copilot-deep-dive/
└── mcp-tools/
```

Use `docs/monorepo/` whenever content spans multiple projects, covers shared operational topics, or captures organization-wide learnings.

## Project-Level Collections

```text
docs/{project-type}/{project-name}/
├── README.md
├── architecture/
│   ├── overview.md
│   ├── diagrams/
│   └── decisions/              # Project-scoped ADRs (optional)
├── epics/
│   └── {epic-name}/
│       ├── epic.md
│       └── arch.md
└── features/
    └── {feature-name}/
        ├── prd.md
        └── implementation-plan.md
```

Where `{project-type}` is one of `apps`, `services`, `libs`, or `tools`. Choose a project directory when the scope affects a single codebase.

## Path Patterns

- Epic PRD: `/docs/{scope}/epics/{epic-name}/epic.md`
- Epic Architecture: `/docs/{scope}/epics/{epic-name}/arch.md`
- Feature PRD: `/docs/{scope}/epics/{epic-name}/features/{feature-name}/prd.md`
- Feature Implementation: `/docs/{scope}/epics/{epic-name}/features/{feature-name}/implementation-plan.md`
- Workspace ADR: `/docs/monorepo/architecture/decisions/adr-{NNNN}-{title-slug}.md`
- Project ADR: `/docs/{project-type}/{project-name}/architecture/decisions/adr-{NNNN}-{title-slug}.md`

`{scope}` equals `monorepo` for cross-cutting work or `{project-type}/{project-name}` for project-level efforts.

## Document Naming

- Use kebab-case for directory names (for example, `cross-region-cache`).
- Epic and feature folders mirror their slug names (for example, `central-auth`, `scheduled-email-delivery`).
- ADR files increment with four-digit identifiers (for example, `adr-0002-use-temporal.md`).
- Keep filenames in lowercase and avoid spaces.

## Choosing the Correct Scope

- Start in `docs/monorepo/` when the change touches more than one project, introduces shared tooling, or documents organization-wide policy.
- Select the relevant project directory when only one app, library, service, or tool is impacted.
- Store architecture decisions near the code they govern: workspace-level ADRs in `docs/monorepo/architecture/decisions/`, project ADRs under the project's `architecture/decisions/` directory.

## Related Resources

- [Documentation Workflow](./DOCUMENTATION-WORKFLOW.md)
- [Documentation Chatmode Implementation Summary](./DOCUMENTATION-CHATMODE-IMPLEMENTATION.md)
- [Docs README](./README.md)
