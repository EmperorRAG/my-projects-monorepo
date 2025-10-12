# Documentation Quick Start

> Get started with the documentation structure in 5 minutes

## 🎯 What You Need to Know

The documentation is now organized into clear categories. Here's how to use it:

### For Finding Documentation

1. **Start Here**: [docs/README.md](./README.md)
2. **Visual Reference**: [DOCUMENTATION-STRUCTURE-VISUAL.md](./DOCUMENTATION-STRUCTURE-VISUAL.md)
3. **Detailed Guide**: [DOCUMENTATION-STRUCTURE.md](./DOCUMENTATION-STRUCTURE.md)

### For Adding Documentation

1. **Read This First**: [HOW-TO-USE-DOCUMENTATION.md](./HOW-TO-USE-DOCUMENTATION.md)
2. **Use This Decision Tree**:

```
Is it a standard file (README, CONTRIBUTING, AGENTS)?
├─ YES → Keep in standard location (project root or .github/)
└─ NO → Is it cross-cutting (affects multiple projects)?
    ├─ YES → Put in /docs/[category]/
    │   ├─ Tutorial? → /docs/guides/
    │   ├─ Architecture? → /docs/architecture/
    │   ├─ ADR? → /docs/architecture/decisions/
    │   ├─ API? → /docs/api/
    │   ├─ Operations? → /docs/runbooks/
    │   ├─ Problem solved? → /docs/learnings/
    │   ├─ Quick reference? → /docs/reference/
    │   └─ Tool guide? → /docs/tooling/
    └─ NO → Put in project's docs/ folder
        └─ /apps/[app]/docs/ or /services/[service]/docs/
```

## 📁 Quick Structure Reference

```
docs/
├── 📚 guides/          → How-to tutorials
├── 🏗️ architecture/    → System design & ADRs
├── 📡 api/             → API documentation
├── 📖 runbooks/        → Operations & procedures
├── 🛠️ tooling/         → Tool documentation
├── 📚 reference/       → Quick references
└── 💡 learnings/       → Problem-solutions
```

## 🚀 Common Tasks

### Task 1: I want to add a tutorial
→ Put it in `/docs/guides/my-tutorial.md`  
→ Follow template in `/docs/guides/README.md`  
→ Add link to `/docs/guides/README.md`

### Task 2: I need to document an API
→ Put it in `/docs/api/my-api.md`  
→ Follow template in `/docs/api/README.md`  
→ Add link to `/docs/api/README.md`

### Task 3: I solved a problem
→ Add entry to `/docs/learnings/[technology].md`  
→ Use If-When-Then-Solution format  
→ See `/docs/learnings/README.md` for format

### Task 4: I made an architecture decision
→ Create `/docs/architecture/decisions/adr-NNNN-title.md`  
→ Use ADR template from `/docs/architecture/README.md`  
→ Add link to `/docs/architecture/README.md`

### Task 5: I need a deployment runbook
→ Create `/docs/runbooks/deployment.md`  
→ Follow runbook template in `/docs/runbooks/README.md`  
→ Include verification and rollback steps

## 📝 File Naming Rules

- **Standard files**: `README.md`, `CONTRIBUTING.md` (CAPITAL)
- **Other docs**: `kebab-case.md` (e.g., `getting-started.md`)
- **ADRs**: `adr-0001-title.md`
- **Learnings**: `[technology].md` (e.g., `nginx.md`)

## ✅ Quality Checklist

Before publishing documentation:

- [ ] Is it in the right category?
- [ ] Does it follow the template?
- [ ] Are file names kebab-case (except standards)?
- [ ] Is it linked from the category README?
- [ ] Are related docs cross-referenced?
- [ ] Is llms.txt updated (if significant)?

## 🔗 Essential Links

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Documentation hub |
| [HOW-TO-USE-DOCUMENTATION.md](./HOW-TO-USE-DOCUMENTATION.md) | Detailed usage guide |
| [DOCUMENTATION-STRUCTURE-VISUAL.md](./DOCUMENTATION-STRUCTURE-VISUAL.md) | Visual flowcharts |
| [DOCUMENTATION-STRUCTURE.md](./DOCUMENTATION-STRUCTURE.md) | Complete structure guide |
| [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) | What was implemented |

## 💡 Tips

- **Can't decide?** Use the visual guide flowchart
- **Need a template?** Check the category README
- **Not sure about naming?** Use kebab-case
- **Cross-cutting or project-specific?** When in doubt, put in `/docs/`

## ❓ Still Confused?

1. Check the [Visual Guide](./DOCUMENTATION-STRUCTURE-VISUAL.md) - Has flowcharts!
2. Read the [How-to Guide](./HOW-TO-USE-DOCUMENTATION.md) - Has examples!
3. Look at existing docs in the category
4. Ask in team chat

---

**That's it! You're ready to use the documentation structure.** 🎉
