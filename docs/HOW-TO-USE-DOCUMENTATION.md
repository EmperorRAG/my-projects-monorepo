# How to Use the Documentation Structure

> Quick start guide for using the new documentation organization

## Overview

The documentation structure has been designed to make it easy to find and maintain documentation across the Nx monorepo. This guide will help you understand how to use it effectively.

## For Documentation Authors

### Quick Decision Guide

**Ask yourself these questions:**

1. **Is it a README, CONTRIBUTING, or AGENTS file?**
   - ✅ Keep it in the standard location (root or .github/)
   - These use CAPITAL LETTERS and have fixed locations

2. **Does it apply to multiple projects or the whole workspace?**
   - ✅ Put it in `/docs/` under the appropriate category
   - Examples: guides, architecture, API docs, runbooks

3. **Is it specific to one app, library, or service?**
   - ✅ Put it in that project's `docs/` folder
   - Example: `/apps/my-app/docs/features.md`

4. **Is it for AI/automation?**
   - ✅ Put it in `.github/instructions/`, `.github/prompts/`, or `.github/chatmodes/`

### Finding the Right Location

Use this flowchart:

```
Is it cross-cutting documentation?
├─ Yes → /docs/[category]/
│  ├─ Tutorial/Guide → /docs/guides/
│  ├─ Architecture/Design → /docs/architecture/
│  ├─ ADR → /docs/architecture/decisions/
│  ├─ API Documentation → /docs/api/
│  ├─ Operational Procedure → /docs/runbooks/
│  ├─ Problem-Solution → /docs/learnings/
│  ├─ Quick Reference → /docs/reference/
│  └─ Tool Guide → /docs/tooling/
│
└─ No → Project-specific location
   ├─ App → /apps/[app-name]/docs/
   ├─ Library → /libs/[lib-name]/docs/
   ├─ Service → /services/[service-name]/docs/
   └─ Tool → /tools/[tool-name]/docs/
```

## For Documentation Readers

### Finding Documentation

#### 1. Start at the Hub
**📍 Location**: `/docs/README.md`

This is your documentation index. It links to all major documentation categories.

#### 2. Browse by Category

- **Learning the system?** → Check `/docs/guides/`
- **Understanding architecture?** → Check `/docs/architecture/`
- **Using an API?** → Check `/docs/api/`
- **Deploying or troubleshooting?** → Check `/docs/runbooks/`
- **Quick command lookup?** → Check `/docs/reference/`
- **Researching a problem?** → Check `/docs/learnings/`

#### 3. Project-Specific Docs

Each project has a README:
- Apps: `/apps/[app-name]/README.md`
- Libraries: `/libs/[lib-name]/README.md`
- Services: `/services/[service-name]/README.md`
- Tools: `/tools/[tool-name]/README.md`

Extended docs (if they exist):
- `/apps/[app-name]/docs/`
- `/services/[service-name]/docs/`
- etc.

### Quick Access Paths

| I want to... | Go to... |
|-------------|----------|
| Get started with the monorepo | `/README.md` → `/docs/guides/` |
| Understand the architecture | `/docs/architecture/overview.md` |
| Find architectural decisions | `/docs/architecture/decisions/` |
| Learn about a specific tool | `/docs/tooling/` or `/tools/[tool]/README.md` |
| Use an API | `/docs/api/` |
| Deploy or troubleshoot | `/docs/runbooks/` |
| Look up a command | `/docs/reference/` |
| Research a past problem | `/docs/learnings/` |
| Understand AI instructions | `/.github/instructions/` |

## Common Scenarios

### Scenario 1: I'm New to the Project

**Path**: 
1. Read `/README.md` (workspace overview)
2. Read `/docs/guides/getting-started.md` _(when created)_
3. Explore `/docs/architecture/overview.md`
4. Check project-specific READMEs for what you're working on

### Scenario 2: I Need to Deploy Something

**Path**:
1. Check `/docs/runbooks/` for deployment procedures
2. Look at project-specific deployment docs in `/[project]/docs/deployment.md`
3. Reference `/docs/reference/` for commands

### Scenario 3: I Hit a Problem

**Path**:
1. Check `/docs/learnings/[technology].md` for known issues
2. Check `/docs/runbooks/` for troubleshooting guides
3. Search `/docs/architecture/decisions/` for context on design choices

### Scenario 4: I Want to Understand an Architectural Decision

**Path**:
1. Browse `/docs/architecture/decisions/` for ADRs
2. Read `/docs/architecture/overview.md` for system design
3. Check `/docs/architecture/diagrams/` for visual references

### Scenario 5: I Need to Use an API

**Path**:
1. Check `/docs/api/` for centralized API documentation
2. Or check service-specific API docs in `/services/[service]/docs/api.md`
3. Look for OpenAPI/Swagger specs _(when available)_

## Creating New Documentation

### Step 1: Determine the Type

Ask:
- Is this a tutorial? → Guide
- Is this a design decision? → ADR
- Is this about how the system works? → Architecture
- Is this an operational procedure? → Runbook
- Is this a problem I solved? → Learning
- Is this for quick lookup? → Reference

### Step 2: Choose the Location

Based on the type:
- **Cross-cutting**: `/docs/[category]/`
- **Project-specific**: `/[project]/docs/`
- **AI/Automation**: `/.github/[type]/`

### Step 3: Use the Template

Each category has a template in its README:
- `/docs/guides/README.md` - Guide template
- `/docs/architecture/README.md` - ADR template
- `/docs/runbooks/README.md` - Runbook template
- `/docs/learnings/README.md` - Learning entry template

### Step 4: Follow Naming Conventions

- **Standard files**: `README.md`, `CONTRIBUTING.md`, `AGENTS.md`
- **Other docs**: `kebab-case.md`
- **ADRs**: `adr-NNNN-title.md`
- **Learnings**: `[technology].md`
- **AI files**: `[name].instructions.md`, `[name].prompt.md`, `[name].chatmode.md`

### Step 5: Cross-Reference

- Add to category README
- Link from related documentation
- Update `llms.txt` if it's significant

## Best Practices

### ✅ Do

- **Start with the README**: Every directory should have one
- **Use templates**: Follow the provided templates
- **Be specific**: Use descriptive titles and clear content
- **Cross-link**: Reference related documentation
- **Keep it DRY**: Don't duplicate, reference instead
- **Update indexes**: Add to category READMEs and `llms.txt`
- **Think about readers**: Make it easy to find and understand

### ❌ Don't

- **Don't move files unnecessarily**: The structure is for new docs
- **Don't duplicate**: Link to existing docs instead
- **Don't create orphans**: Always link from somewhere
- **Don't skip README updates**: Keep indexes current
- **Don't mix concerns**: Keep documentation focused
- **Don't ignore templates**: They ensure consistency

## Maintenance

### Regular Tasks

**Weekly**:
- Check for broken links
- Update recent documentation

**Monthly**:
- Review category READMEs
- Update `llms.txt` if needed
- Check for outdated information

**Quarterly**:
- Full documentation review
- Archive obsolete content
- Improve structure based on usage

### Updating Documentation

When updating:
1. Make changes to the documentation
2. Update the "Last Updated" date if present
3. Add a note in relevant CHANGELOG or README
4. Check and update cross-references
5. Test all examples and commands

## Tools and Automation

### Link Validation

```bash
# Check for broken links (example)
npx markdown-link-check docs/**/*.md
```

### Documentation Generation

- **TypeDoc**: Auto-generates API docs for TypeScript
- **Nx Docs**: Can generate dependency graphs
- **Mermaid**: For diagrams in Markdown

### Search

Use your IDE's search to find documentation:
- VS Code: `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
- Search in `/docs/` for centralized docs
- Search in project folders for project-specific docs

## Getting Help

### If You Can't Find Documentation

1. Check `/docs/README.md` first
2. Search in the category you expect
3. Try the visual guide: `/docs/DOCUMENTATION-STRUCTURE-VISUAL.md`
4. Ask in the team chat
5. Create an issue with label `documentation`

### If You're Unsure Where to Put Documentation

1. Review the decision flowchart in this guide
2. Check the visual structure guide
3. Look at similar existing documentation
4. Ask in the team chat
5. When in doubt, put it in `/docs/guides/` and we'll reorganize if needed

## Summary

**Remember these key points:**

1. 📍 **Standard files** (README, CONTRIBUTING, AGENTS) stay in their standard locations
2. 🌐 **Cross-cutting docs** go in `/docs/[category]/`
3. 📦 **Project-specific docs** go in the project's `docs/` folder
4. 🤖 **AI/automation docs** go in `.github/`
5. 🏷️ **Use kebab-case** for file names (except standard files)
6. 📚 **Use templates** for consistency
7. 🔗 **Cross-reference** related documentation
8. 📝 **Update indexes** when adding significant docs

## Quick Reference Card

| What | Where | Example |
|------|-------|---------|
| Workspace overview | `/README.md` | Main README |
| Tutorial/guide | `/docs/guides/` | Getting started guide |
| Architecture | `/docs/architecture/` | System overview |
| ADR | `/docs/architecture/decisions/` | Technology decision |
| API docs | `/docs/api/` | REST API reference |
| Runbook | `/docs/runbooks/` | Deployment procedure |
| Learning | `/docs/learnings/` | Problem solved |
| Quick reference | `/docs/reference/` | Command cheatsheet |
| Tool guide | `/docs/tooling/` | Cross-cutting tool info |
| App docs | `/apps/[app]/docs/` | App-specific features |
| Service docs | `/services/[service]/docs/` | Service API |
| AI instructions | `/.github/instructions/` | TypeScript standards |

---

**Still confused?** Check the [Visual Structure Guide](./DOCUMENTATION-STRUCTURE-VISUAL.md) for flowcharts and diagrams!
