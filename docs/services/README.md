# Service-Specific Documentation

This directory contains documentation for individual services in the monorepo. Each service has its own subdirectory with epics, features, and other service-specific documentation.

## Directory Structure

```text
docs/services/{service-name}/
├── README.md                        # Service overview and documentation index
├── architecture/                    # Service architecture documentation
│   ├── overview.md                  # Architecture overview
│   ├── diagrams/                    # Visual assets (optional)
│   └── decisions/                   # Service-scoped ADRs (optional)
├── epics/                           # Service-specific epics
│   └── {epic-name}/
│       ├── epic.md                  # Epic Product Requirements Document
│       └── arch.md                  # Epic Architecture Specification
└── features/                        # Service features (preferred structure)
    └── {feature-name}/
        ├── prd.md                   # Feature Product Requirements Document
        └── implementation-plan.md   # Feature Implementation Plan
```

## Current Services

- [my-nest-js-email-microservice](./my-nest-js-email-microservice/) - NestJS email microservice

## When to Use This Directory

Use service-specific directories for:

- Epics that only affect a single service
- Features specific to a service's functionality
- Service-specific architecture decisions
- Service implementation details

## When to Use Monorepo-Level Documentation

Use `/docs/monorepo/epics/` for:

- Epics that affect multiple services
- Cross-cutting platform features
- Monorepo-wide infrastructure or standards

## Creating Service Documentation

To create documentation for a service:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Specify the project type as `services` and provide the service name
3. Follow the documentation workflow dependency chain
4. Path will be: `/docs/services/{service-name}/epics/{epic-name}/` or `/docs/services/{service-name}/features/{feature-name}/`

## Related Documentation

- [Documentation Structure Reference](../documentation-structure-reference.md)
- [AGENTS.md](../../AGENTS.md) - Documentation workflow and requirements
- [Monorepo Epics](../monorepo/epics/) - Monorepo-level epic documentation
- [ADRs](../monorepo/architecture/decisions/) - Architectural Decision Records
