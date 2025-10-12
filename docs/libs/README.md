# Library-Specific Documentation

This directory contains documentation for shared libraries in the monorepo. Each library has its own subdirectory with epics, features, and other library-specific documentation.

## Directory Structure

```
docs/libs/{library-name}/
├── README.md                        # Library overview and API documentation
├── epics/                          # Library-specific epics
│   └── {epic-name}/
│       ├── epic.md                 # Epic Product Requirements Document
│       └── arch.md                 # Epic Architecture Specification
└── features/                       # Library features
    └── {feature-name}/
        ├── prd.md                  # Feature Product Requirements Document
        └── implementation-plan.md  # Feature Implementation Plan
```

## Current Libraries

- `utilities` - Shared utility library (documentation to be added)

## When to Use This Directory

Use library-specific directories for:
- Epics that only affect a single library
- Features specific to library functionality
- Library API design and implementation
- Shared utility and helper function documentation

## When to Use Monorepo-Level Documentation

Use `/docs/epics/` for:
- Epics that affect multiple libraries
- Cross-cutting shared functionality
- Platform-wide utility patterns

## Creating Library Documentation

To create documentation for a library:

1. Use the `documentation` chatmode (`.github/chatmodes/documentation.chatmode.md`)
2. Specify the project type as `libs` and provide the library name
3. Follow the documentation workflow dependency chain
4. Path will be: `/docs/libs/{library-name}/epics/{epic-name}/` or `/docs/libs/{library-name}/features/{feature-name}/`

## Related Documentation

- [AGENTS.md](../../AGENTS.md) - Documentation workflow and requirements
- [Monorepo Epics](../epics/) - Monorepo-level epic documentation
- [ADRs](../architecture/decisions/) - Architectural Decision Records
