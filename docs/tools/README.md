# Tool-Specific Documentation

This directory contains documentation for tools in the monorepo. Each tool has its own subdirectory with epics, features, and other tool-specific documentation.

## Directory Structure

```
docs/tools/{tool-name}/
├── README.md                        # Tool overview and documentation index
├── epics/                          # Tool-specific epics
│   └── {epic-name}/
│       ├── epic.md                 # Epic Product Requirements Document
│       └── arch.md                 # Epic Architecture Specification
└── features/                       # Tool features
    └── {feature-name}/
        ├── prd.md                  # Feature Product Requirements Document
        └── implementation-plan.md  # Feature Implementation Plan
```

## Current Tools

- [nginx](./nginx/) - NGINX reverse proxy and load balancer
- [certbot](./certbot/) - Certbot for SSL/TLS certificate automation

## When to Use This Directory

Use tool-specific directories for:
- Epics that only affect a single tool
- Features specific to a tool's functionality
- Tool-specific architecture decisions
- Tool implementation details
- Infrastructure and DevOps tooling documentation

## When to Use Monorepo-Level Documentation

Use `/docs/epics/` for:
- Epics that affect multiple tools
- Cross-cutting infrastructure features
- Monorepo-wide tooling standards

## Creating Tool Documentation

To create documentation for a tool:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Specify the project type as `tools` and provide the tool name
3. Follow the documentation workflow dependency chain
4. Path will be: `/docs/tools/{tool-name}/epics/{epic-name}/` or `/docs/tools/{tool-name}/features/{feature-name}/`

## Related Documentation

- [AGENTS.md](../../AGENTS.md) - Documentation workflow and requirements
- [Monorepo Epics](../epics/) - Monorepo-level epic documentation
- [ADRs](../architecture/decisions/) - Architectural Decision Records
