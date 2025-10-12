# Documentation Structure Guide for Nx Monorepo

> **Purpose**: This guide establishes the standard documentation structure for the Nx monorepo, ensuring documentation is organized, discoverable, and maintainable.

## Table of Contents

- [Overview](#overview)
- [Documentation Principles](#documentation-principles)
- [Directory Structure](#directory-structure)
- [Documentation Categories](#documentation-categories)
- [Location Guidelines](#location-guidelines)
- [File Naming Conventions](#file-naming-conventions)
- [Templates and Examples](#templates-and-examples)
- [Migration Strategy](#migration-strategy)

## Overview

This monorepo uses a **layered documentation approach** where documentation is placed based on its scope and audience:

1. **Workspace-level documentation** lives in the root and `/docs` directory
2. **Project-specific documentation** lives within each project directory
3. **Tool-specific documentation** lives within the tool's directory
4. **AI/automation documentation** lives in `.github/`

## Documentation Principles

1. **Discoverability**: Documentation should be easy to find
2. **Locality**: Keep documentation close to what it documents
3. **Single Source of Truth**: Avoid duplication; use references instead
4. **Capital Letters for Standard Files**: README.md, CONTRIBUTING.md, AGENTS.md stay in standard locations
5. **Centralized for Cross-Cutting Concerns**: Guides, ADRs, and implementation plans in `/docs`

## Directory Structure

```
my-projects-monorepo/
├── README.md                           # Workspace overview (CAPITAL)
├── AGENTS.md                           # AI agent instructions (CAPITAL)
├── llms.txt                            # LLM context map
│
├── .github/                            # GitHub & AI automation config
│   ├── CONTRIBUTING.md                 # Contribution guidelines (CAPITAL)
│   ├── copilot-instructions.md         # Copilot workspace settings
│   ├── instructions/                   # AI coding instructions by technology
│   ├── prompts/                        # Reusable AI prompts
│   └── chatmodes/                      # Copilot chat mode definitions
│
├── docs/                               # Centralized documentation hub
│   ├── README.md                       # Documentation index
│   │
│   ├── guides/                         # How-to guides and tutorials
│   │   ├── getting-started.md
│   │   ├── development-workflow.md
│   │   └── deployment.md
│   │
│   ├── architecture/                   # Architecture documentation
│   │   ├── overview.md                 # System architecture overview
│   │   ├── diagrams/                   # Architecture diagrams
│   │   └── decisions/                  # ADRs (Architectural Decision Records)
│   │       └── adr-NNNN-title.md
│   │
│   ├── nx-monorepo/                    # Nx-specific documentation
│   │   ├── configuration.md
│   │   ├── generators.md
│   │   └── best-practices.md
│   │
│   ├── tooling/                        # Tool-specific guides
│   │   ├── nginx.md
│   │   ├── docker.md
│   │   └── ci-cd.md
│   │
│   ├── api/                            # API documentation
│   │   ├── rest-apis.md
│   │   └── graphql.md
│   │
│   ├── runbooks/                       # Operational procedures
│   │   ├── deployment.md
│   │   ├── rollback.md
│   │   └── troubleshooting.md
│   │
│   ├── learnings/                      # Problem-solution knowledge base
│   │   ├── README.md                   # How to use learnings
│   │   ├── nginx.md
│   │   ├── nx.md
│   │   └── [technology].md
│   │
│   ├── implementation-plans/           # Implementation plans and guides
│   │   ├── README.md
│   │   ├── guides/
│   │   └── templates/
│   │
│   └── reference/                      # Reference documentation
│       ├── glossary.md
│       ├── commands.md
│       └── configuration.md
│
├── apps/                               # Application projects
│   └── [app-name]/
│       ├── README.md                   # App-specific docs (CAPITAL)
│       ├── docs/                       # Extended app documentation (optional)
│       │   ├── features.md
│       │   ├── api.md
│       │   └── deployment.md
│       └── specs/                      # Specifications
│
├── libs/                               # Library projects
│   └── [lib-name]/
│       ├── README.md                   # Library-specific docs (CAPITAL)
│       └── docs/                       # API reference (if generated)
│
├── services/                           # Service projects
│   └── [service-name]/
│       ├── README.md                   # Service-specific docs (CAPITAL)
│       └── docs/                       # Extended service documentation
│           ├── api.md
│           ├── deployment.md
│           └── troubleshooting.md
│
├── tools/                              # Tooling and infrastructure
│   └── [tool-name]/
│       ├── README.md                   # Tool overview and quick start (CAPITAL)
│       ├── docs/                       # Detailed tool documentation
│       │   ├── configuration.md
│       │   ├── usage.md
│       │   └── troubleshooting.md
│       └── scripts/                    # Tool scripts
│
└── scripts/                            # Workspace-level scripts
    └── README.md                       # Scripts documentation (CAPITAL)
```

## Documentation Categories

### 1. Standard Files (CAPITAL LETTERS)

These files use capital letters and have standard locations:

| File | Location | Purpose |
|------|----------|---------|
| `README.md` | Project root, app/lib/service/tool roots | Primary entry point, overview, quick start |
| `CONTRIBUTING.md` | `.github/` | Contribution guidelines |
| `AGENTS.md` | Workspace root | High-level AI agent instructions |

### 2. Centralized Documentation (`/docs`)

Documentation that applies across projects or provides workspace-level guidance:

| Category | Location | Content |
|----------|----------|---------|
| **Guides** | `docs/guides/` | Step-by-step tutorials, how-to guides |
| **Architecture** | `docs/architecture/` | System design, ADRs, diagrams |
| **Nx Monorepo** | `docs/nx-monorepo/` | Nx-specific documentation |
| **Tooling** | `docs/tooling/` | Cross-cutting tool documentation |
| **API Docs** | `docs/api/` | API references and contracts |
| **Runbooks** | `docs/runbooks/` | Operational procedures |
| **Learnings** | `docs/learnings/` | Problem-solution knowledge base |
| **Implementation Plans** | `docs/implementation-plans/` | Planning documents |
| **Reference** | `docs/reference/` | Quick references, glossaries |

### 3. Project-Specific Documentation

Each project (app/lib/service) should have:

- **README.md** (required): Overview, setup, usage
- **docs/** (optional): Extended documentation for complex projects
  - `features.md`: Feature documentation
  - `api.md`: API reference
  - `deployment.md`: Deployment guide
  - `troubleshooting.md`: Common issues and solutions

### 4. Tool Documentation

Tools in `/tools` directory should follow:

- **README.md** (required): Quick start and overview
- **docs/** (optional): Detailed documentation
  - `configuration.md`: Configuration options
  - `usage.md`: Usage examples
  - `troubleshooting.md`: Common issues

### 5. AI/Automation Documentation (`.github/`)

GitHub and AI-specific documentation:

| Category | Location | Purpose |
|----------|----------|---------|
| **Instructions** | `.github/instructions/` | Technology-specific AI coding guidelines |
| **Prompts** | `.github/prompts/` | Reusable AI prompt templates |
| **Chat Modes** | `.github/chatmodes/` | Copilot chat mode definitions |
| **Copilot Config** | `.github/copilot-instructions.md` | Workspace-level Copilot settings |

## Location Guidelines

### When to Use `/docs` (Centralized)

Use centralized documentation for:

- ✅ Cross-cutting concerns affecting multiple projects
- ✅ Workspace-level architecture and decisions
- ✅ Guides and tutorials for the entire monorepo
- ✅ Operational runbooks and procedures
- ✅ Shared knowledge and learnings
- ✅ Implementation plans for multi-project features

### When to Use Project-Specific Docs

Use project-specific documentation for:

- ✅ Project-unique features and functionality
- ✅ Project-specific API references
- ✅ Project deployment procedures
- ✅ Project troubleshooting guides

### Decision Matrix

| Documentation Type | Location | Example |
|-------------------|----------|---------|
| Workspace overview | `/README.md` | Main project README |
| Architectural decision | `/docs/architecture/decisions/` | ADR for technology choice |
| Nx configuration guide | `/docs/nx-monorepo/` | How to configure Nx cache |
| NGINX integration | `/docs/tooling/nginx.md` or `/tools/nginx/README.md` | NGINX setup guide |
| App-specific features | `/apps/my-app/docs/features.md` | Feature documentation |
| Library API reference | `/libs/my-lib/docs/` (auto-generated) | TypeDoc output |
| Service deployment | `/services/my-service/docs/deployment.md` | Deployment steps |
| Tool configuration | `/tools/my-tool/docs/configuration.md` | Tool config options |
| Problem-solution log | `/docs/learnings/[tech].md` | Lessons learned |
| AI coding standards | `.github/instructions/[tech].instructions.md` | TypeScript standards |

## File Naming Conventions

### General Rules

1. **Use kebab-case** for all documentation files except standard files
   - ✅ `getting-started.md`
   - ❌ `Getting_Started.md`

2. **Standard files use CAPITAL LETTERS**
   - ✅ `README.md`
   - ✅ `CONTRIBUTING.md`
   - ✅ `AGENTS.md`

3. **ADRs follow the pattern**: `adr-NNNN-title.md`
   - ✅ `adr-0001-use-nx-for-monorepo.md`
   - ✅ `adr-0002-adopt-nextjs.md`

4. **Learning files use technology name**
   - ✅ `nginx.md`
   - ✅ `nx.md`
   - ✅ `docker.md`

5. **AI files use specific suffixes**
   - `.instructions.md` for coding guidelines
   - `.prompt.md` for prompt templates
   - `.chatmode.md` for chat modes

### Examples

```
docs/
├── guides/
│   ├── getting-started.md              ✅ kebab-case
│   ├── development-workflow.md         ✅ kebab-case
│   └── deployment-guide.md             ✅ kebab-case
│
├── architecture/
│   ├── overview.md                     ✅ simple name
│   └── decisions/
│       ├── adr-0001-use-nx.md         ✅ ADR pattern
│       └── adr-0002-adopt-nestjs.md   ✅ ADR pattern
│
└── learnings/
    ├── README.md                       ✅ CAPITAL
    ├── nginx.md                        ✅ tech name
    └── playwright.md                   ✅ tech name
```

## Templates and Examples

### README.md Template (Project Root)

```markdown
# [Project Name]

> Brief description of the project

## Overview

What this project does and why it exists.

## Quick Start

\`\`\`bash
# Installation
npm install

# Development
npm run dev

# Build
npm run build
\`\`\`

## Documentation

- [Features](./docs/features.md)
- [API Reference](./docs/api.md)
- [Deployment](./docs/deployment.md)

## Related Documentation

- [Architecture Overview](/docs/architecture/overview.md)
- [Nx Monorepo Guide](/docs/nx-monorepo/configuration.md)
```

### ADR Template

```markdown
# ADR-NNNN: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive

- Benefit 1
- Benefit 2

### Negative

- Trade-off 1
- Trade-off 2

### Neutral

- Other consideration
```

### Learning Entry Template

```markdown
## [Concise Title]

- **If:** [initial condition]
- **When:** [trigger]
- **Then:** [observed failure/issue]
- **Solution:** [fix applied]
- **Date:** YYYY-MM-DD
- **Related:** [Links to ADRs, docs, PRs]
```

## Migration Strategy

### Phase 1: Create Structure (Current)

- [x] Create `/docs` subdirectories
- [x] Document the structure in this guide
- [ ] Create README.md in each `/docs` subdirectory

### Phase 2: Gradual Migration (Future)

**Do NOT move files now.** Future migrations should:

1. **Identify candidates** for centralization
2. **Create new location** following this structure
3. **Add redirect/reference** in old location
4. **Update links** in other documentation
5. **Mark old location** as deprecated
6. **Remove old files** after grace period

### Phase 3: Maintenance

1. **New documentation** follows this structure
2. **Update `llms.txt`** when adding major documents
3. **Review quarterly** for organization improvements
4. **Keep this guide** up to date

## Best Practices

### ✅ Do

- Keep README.md files concise and focused on quick start
- Use relative links within the same project
- Use absolute paths from repo root for cross-project references
- Update `llms.txt` when adding significant documentation
- Include examples in guides
- Add diagrams to architecture docs
- Cross-reference related documentation

### ❌ Don't

- Don't duplicate content across multiple docs
- Don't create deep nesting (max 3-4 levels)
- Don't use abbreviations in file names
- Don't mix concerns in a single document
- Don't forget to update links when moving files
- Don't create documentation without a clear audience

## Maintenance

This documentation structure should be reviewed and updated:

- **Quarterly**: Review organization and adjust as needed
- **When adding major features**: Ensure documentation structure supports it
- **When feedback is received**: Improve discoverability
- **When AI tools evolve**: Update AI documentation patterns

## Questions and Feedback

For questions or suggestions about this documentation structure:

1. Open an issue with label `documentation`
2. Propose changes via pull request
3. Discuss in team meetings

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0  
**Maintained By**: Repository maintainers
