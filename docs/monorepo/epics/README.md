# Monorepo-Level Epics

This directory contains epics that affect the entire monorepo, spanning multiple projects or providing cross-cutting functionality.

## Directory Structure

Each epic follows this structure:

```
docs/epics/{epic-name}/
├── epic.md                          # Epic Product Requirements Document
├── arch.md                          # Epic Architecture Specification
└── features/                        # Features within this epic
    └── {feature-name}/
        ├── prd.md                   # Feature Product Requirements Document
        └── implementation-plan.md   # Feature Implementation Plan
```

## When to Use This Directory

Use `docs/epics/` for epics that:
- Affect multiple projects (apps, services, or libraries)
- Provide infrastructure or platform-level capabilities
- Define monorepo-wide standards or patterns
- Implement cross-cutting concerns

## When to Use Project-Specific Epic Directories

Use project-specific directories (e.g., `docs/services/{service-name}/epics/`) for epics that:
- Are specific to a single app, service, or library
- Only affect one project's codebase
- Implement features within a single project boundary

**Example**: Email service features → `docs/services/my-nest-js-email-microservice/epics/`

## Creating New Epics

To create a new epic in this directory:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Start with the Epic PRD using `.github/prompts/breakdown-epic-pm.prompt.md`
3. Follow the documentation workflow dependency chain
4. Ensure all documents follow the instruction guidelines in `.github/instructions/docs/`

## Documentation Workflow

The documentation creation follows this dependency chain:

```
Epic PRD (epic.md)
    ↓
Epic Architecture (arch.md)
    ↓
Feature PRD (features/{feature-name}/prd.md)
    ↓
Feature Implementation Plan (features/{feature-name}/implementation-plan.md)
```

Each document requires the previous one to exist before it can be created.

## Related Documentation

- [AGENTS.md](../../AGENTS.md) - Complete documentation workflow and AI model behavior requirements
- [Documentation Chatmode](../../.github/chatmodes/documentation.chatmode.md) - Orchestration chatmode for documentation creation
- [ADRs](../architecture/decisions/) - Architectural Decision Records for technical decisions
