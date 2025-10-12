# App-Specific Documentation

This directory contains documentation for individual applications in the monorepo. Each app has its own subdirectory with epics, features, and other app-specific documentation.

## Directory Structure

```text
docs/apps/{app-name}/
├── README.md                        # App overview and documentation index
├── architecture/                    # App architecture documentation (optional files)
│   ├── overview.md                  # Architecture overview
│   ├── diagrams/                    # Visual assets (optional)
│   └── decisions/                   # App-scoped ADRs (optional)
├── epics/                           # App-specific epics
│   └── {epic-name}/
│       ├── epic.md                  # Epic Product Requirements Document
│       └── arch.md                  # Epic Architecture Specification
└── features/                        # App features
    └── {feature-name}/
        ├── prd.md                   # Feature Product Requirements Document
        └── implementation-plan.md   # Feature Implementation Plan
```

## Current Apps

- `my-programs-app` - Main Next.js application (documentation to be added)

## When to Use This Directory

Use app-specific directories for:

- Epics that only affect a single application
- Features specific to an app's UI or functionality
- App-specific user experiences and workflows
- Frontend-specific implementation details

## When to Use Monorepo-Level Documentation

Use `/docs/monorepo/epics/` for:

- Epics that affect multiple apps
- Cross-cutting platform features
- Shared infrastructure or patterns

## Creating App Documentation

To create documentation for an app:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Specify the project type as `apps` and provide the app name
3. Follow the documentation workflow dependency chain
4. Path will be: `/docs/apps/{app-name}/epics/{epic-name}/` or `/docs/apps/{app-name}/features/{feature-name}/`

## Related Documentation

- [Documentation Structure Reference](../documentation-structure-reference.md)
- [AGENTS.md](../../AGENTS.md) - Documentation workflow and requirements
- [Monorepo Epics](../monorepo/epics/) - Monorepo-level epic documentation
- [ADRs](../monorepo/architecture/decisions/) - Architectural Decision Records
