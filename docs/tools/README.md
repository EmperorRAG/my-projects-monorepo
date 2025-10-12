# Tool-Specific Documentation

This directory contains documentation for tools in the monorepo. Each tool has its own subdirectory with epics, features, and other tool-specific documentation.

## Directory Structure

```text
docs/tools/{tool-name}/
├── README.md                        # Tool overview and documentation index
├── architecture/                    # Tooling architecture documentation
│   ├── overview.md                  # Architecture overview (optional)
│   ├── diagrams/                    # Visual assets (optional)
│   └── decisions/                   # Tool-scoped ADRs (optional)
└── epics/                           # Tool-specific epics
    └── {epic-name}/
        ├── epic.md                  # Epic Product Requirements Document
        ├── arch.md                  # Epic Architecture Specification
        └── features/
            └── {feature-name}/
                ├── prd.md           # Feature Product Requirements Document
                └── implementation-plan.md   # Feature Implementation Plan
```

## Current Tools

- nginx – NGINX reverse proxy and load balancer (see `docs/tools/nginx/`)

## When to Use This Directory

Use tool-specific directories for:

- Epics that only affect a single tool
- Features specific to a tool's functionality
- Tool-specific architecture decisions
- Tool implementation details
- Infrastructure and DevOps tooling documentation

## When to Use Monorepo-Level Documentation

Use `/docs/monorepo/epics/` for:

- Epics that affect multiple tools
- Cross-cutting infrastructure features
- Monorepo-wide tooling standards

## Creating Tool Documentation

To create documentation for a tool:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Specify the project type as `tools` and provide the tool name
3. Follow the documentation workflow dependency chain
4. Path will be: `/docs/tools/{tool-name}/epics/{epic-name}/` (features live under each epic)

## Related Documentation

- [Documentation Structure Reference](../documentation-structure-reference.md)
- [AGENTS.md](../../AGENTS.md) - Documentation workflow and requirements
- [Monorepo Epics](../monorepo/epics/) - Monorepo-level epic documentation
- [ADRs](../monorepo/architecture/decisions/) - Architectural Decision Records
