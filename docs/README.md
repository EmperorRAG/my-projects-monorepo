# Documentation Hub

Welcome to the centralized documentation for the Nx monorepo. This directory contains cross-cutting documentation that applies to multiple projects or the workspace as a whole.

## Directory Structure

### 📚 [Guides](./guides/)
Step-by-step tutorials and how-to guides for common tasks.

- Getting started with the monorepo
- Development workflows
- Deployment procedures
- Testing strategies

**→ [How to Use This Documentation](./HOW-TO-USE-DOCUMENTATION.md)** - Start here if you're new!

### 🏗️ [Architecture](./architecture/)
System architecture documentation and design decisions.

- [Overview](./architecture/overview.md) - System architecture overview
- [Diagrams](./architecture/diagrams/) - Architecture diagrams and visuals
- [Decisions](./architecture/decisions/) - Architectural Decision Records (ADRs)

### 🔧 [Nx Monorepo](./nx-monorepo/)
Nx-specific documentation and configuration guides.

- Nx configuration
- Generators and executors
- Cache configuration
- Best practices

### 🛠️ [Tooling](./tooling/)
Documentation for tools and infrastructure.

- NGINX configuration
- Docker and containerization
- CI/CD pipelines
- Development tools

### 📡 [API](./api/)
API documentation and contracts.

- REST API references
- GraphQL schemas
- Service contracts

### 📖 [Runbooks](./runbooks/)
Operational procedures and playbooks.

- Deployment runbooks
- Rollback procedures
- Troubleshooting guides
- Incident response

### 💡 [Learnings](./learnings/)
Problem-solution knowledge base organized by technology.

- [How to use](./learnings/README.md)
- Technology-specific learnings
- Lessons learned from incidents

### 📋 [Implementation Plans](./implementation-plans/)
Planning documents for features and initiatives.

- Implementation plans
- Project guides
- Templates

### 📚 [Reference](./reference/)
Quick reference documentation.

- Glossary of terms
- Command references
- Configuration options

## Documentation Types

### Centralized (This Directory)

Documentation here applies to:

- Multiple projects or services
- Workspace-level concerns
- Cross-cutting architecture
- Shared knowledge and learnings
- Operational procedures

### Project-Specific

Each project has its own documentation:

- **Apps**: `apps/[app-name]/README.md` and `apps/[app-name]/docs/`
- **Libraries**: `libs/[lib-name]/README.md` and `libs/[lib-name]/docs/`
- **Services**: `services/[service-name]/README.md` and `services/[service-name]/docs/`
- **Tools**: `tools/[tool-name]/README.md` and `tools/[tool-name]/docs/`

### AI/Automation

AI and automation documentation:

- **Instructions**: `.github/instructions/` - Technology-specific coding guidelines
- **Prompts**: `.github/prompts/` - Reusable AI prompt templates
- **Chat Modes**: `.github/chatmodes/` - Copilot chat mode definitions

## Finding Documentation

### By Topic

- **Getting Started**: See [guides/](./guides/)
- **Architecture Decisions**: See [architecture/decisions/](./architecture/decisions/)
- **API References**: See [api/](./api/)
- **Troubleshooting**: See [runbooks/](./runbooks/) or project-specific docs
- **Lessons Learned**: See [learnings/](./learnings/)

### By Project

Check the project's README.md:

- `apps/my-programs-app/README.md`
- `libs/utilities/README.md`
- `services/my-nest-js-email-microservice/README.md`

### For AI Context

- **llms.txt**: Repository map for AI models (workspace root)
- **AGENTS.md**: High-level AI agent instructions (workspace root)
- **.github/copilot-instructions.md**: Copilot workspace settings

## Contributing to Documentation

1. **Read**: [.github/CONTRIBUTING.md](../.github/CONTRIBUTING.md)
2. **Follow**: [DOCUMENTATION-STRUCTURE.md](./DOCUMENTATION-STRUCTURE.md)
3. **Use**: Templates provided in the structure guide
4. **Update**: `llms.txt` when adding significant documentation

## Quick Links

### Workspace Documentation
- [Main README](../README.md)
- [AI Agents Guide](../AGENTS.md)
- [LLM Context Map](../llms.txt)
- [Contributing Guidelines](../.github/CONTRIBUTING.md)

### Structure and Organization
- [Documentation Structure Guide](./DOCUMENTATION-STRUCTURE.md) - Comprehensive structure documentation
- [Visual Structure Guide](./DOCUMENTATION-STRUCTURE-VISUAL.md) - Visual reference and decision flowcharts

### Key Guides
- [Nx Cache Configuration](./nx-cache-configuration.md)
- [NGINX Integration](./nx-monorepo/nginx-integration.md)

### Important ADRs
- [ADR-0001: Use Nx for Monorepo](./architecture/decisions/adr-0001-use-nx-for-monorepo-management.md)

## Maintenance

This documentation index should be updated when:

- New documentation categories are added
- Major documentation is created
- Directory structure changes
- Important links need updating

---

**For detailed structure and guidelines**: See [DOCUMENTATION-STRUCTURE.md](./DOCUMENTATION-STRUCTURE.md)
