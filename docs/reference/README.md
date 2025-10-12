# Reference Documentation

Quick reference guides, command cheatsheets, and configuration references.

## Overview

This directory contains quick reference documentation for developers working with the monorepo. These are designed to be fast lookup resources for common tasks, commands, and configurations.

## Available References

### Quick References

- **Command Reference** _(planned)_: Common commands and their usage
- **Configuration Reference** _(planned)_: Key configuration options
- **Glossary** _(planned)_: Terms and definitions
- **Code Snippets** _(planned)_: Reusable code examples
- **Keyboard Shortcuts** _(planned)_: IDE and tool shortcuts

## Reference Types

### 1. Command References

Quick lookup for commonly used commands.

#### Example Structure

```markdown
# Command Reference

## Nx Commands

### Build Commands
\`\`\`bash
# Build a specific project
npx nx build <project-name>

# Build all projects
npx nx run-many --target=build --all

# Build affected projects
npx nx affected:build
\`\`\`

### Test Commands
\`\`\`bash
# Test a project
npx nx test <project-name>

# Test all
npx nx run-many --target=test --all
\`\`\`
```

### 2. Configuration References

Quick lookup for configuration options.

#### Example Structure

```markdown
# Configuration Reference

## Nx Configuration (nx.json)

### Task Pipeline
\`\`\`json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
\`\`\`

### Cache Configuration
- \`cacheDirectory\`: Custom cache location
- \`defaultBase\`: Default base branch
```

### 3. Glossary

Terms and definitions used in the project.

#### Example Structure

```markdown
# Glossary

## A

**ADR (Architectural Decision Record)**: Document that captures an important architectural decision.

**API Gateway**: Single entry point for all client requests.

## B

**Build Target**: Nx task for building a project.

## N

**Nx**: Build system for monorepos.
```

## Planned Reference Documents

### Command Cheatsheets

- [ ] Nx commands
- [ ] Docker commands
- [ ] Git commands
- [ ] npm/pnpm commands
- [ ] NGINX commands

### Configuration Quick References

- [ ] Nx configuration
- [ ] TypeScript configuration
- [ ] ESLint configuration
- [ ] Prettier configuration
- [ ] Docker configuration

### Code References

- [ ] TypeScript patterns
- [ ] React hooks
- [ ] NestJS decorators
- [ ] Testing patterns
- [ ] API client examples

## Usage Guidelines

### When to Create a Reference

Create a reference document when:

✅ Information is frequently looked up  
✅ Format is standardized and repeatable  
✅ Content is concise and scannable  
✅ Updates are infrequent  
✅ Quick access is valuable  

### When NOT to Create a Reference

Don't create a reference when:

❌ Content requires detailed explanation  
❌ Information changes frequently  
❌ Context is crucial for understanding  
❌ Procedural steps are needed  

Instead use:
- **Guides**: For step-by-step tutorials
- **Architecture Docs**: For design decisions
- **Runbooks**: For operational procedures
- **API Docs**: For detailed API specs

## Reference Template

### Quick Reference Template

```markdown
# [Topic] Quick Reference

> Brief description of what this reference covers

## Common Commands

### Category 1

\`\`\`bash
# Command description
command --flag value
\`\`\`

### Category 2

\`\`\`bash
# Another command
command subcommand
\`\`\`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | "value" | What it does |
| option2 | boolean | false | What it does |

## Code Examples

### Example 1: [Use Case]

\`\`\`typescript
// Code example
const example = "value";
\`\`\`

### Example 2: [Another Use Case]

\`\`\`typescript
// Another example
function example() {
  return "value";
}
\`\`\`

## Tips and Tricks

- 💡 Tip 1
- 💡 Tip 2
- 💡 Tip 3

## See Also

- [Related Guide](../guides/guide-name.md)
- [API Docs](../api/)
```

### Glossary Template

```markdown
# Glossary

> Terms and definitions used in the project

## A

**Term**: Definition

## B

**Term**: Definition with [link to more info](../path/to/doc.md)

## C

**Acronym (Full Name)**: Definition
```

## Best Practices

### Writing References

✅ **Do**:
- Keep it concise
- Use tables for structured data
- Include working code examples
- Group related items
- Use clear headings
- Provide links to detailed docs
- Keep formatting consistent

❌ **Don't**:
- Write long explanations
- Include detailed procedures
- Duplicate detailed documentation
- Use complex examples
- Mix unrelated topics
- Forget to update

### Maintaining References

- **Regular Review**: Monthly check for accuracy
- **Update Promptly**: Fix outdated information immediately
- **Version Note**: Include "Last Updated" date
- **Link Checking**: Verify all links work
- **Example Testing**: Ensure code examples work

## Formats

### Tables

Use tables for structured data:

```markdown
| Command | Description | Example |
|---------|-------------|---------|
| build | Build project | \`nx build app\` |
| test | Run tests | \`nx test app\` |
```

### Code Blocks

Use syntax highlighting:

```typescript
// TypeScript example
const example: string = "value";
```

```bash
# Bash example
npx nx build my-app
```

### Lists

Use lists for related items:

- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2

### Callouts

Use for important notes:

> 💡 **Tip**: Helpful hint

> ⚠️ **Warning**: Important caution

> ✅ **Success**: Positive indicator

## Integration

### Link from Main Docs

Reference docs should be linked from:

- Main documentation as "Quick Reference"
- Guides with "See also: Quick Reference"
- Architecture docs for technical details
- README files for commonly used commands

### Cross-References

Link to detailed documentation:

```markdown
For detailed information, see [Full Guide](../guides/guide-name.md)
```

## Tools and Automation

### Auto-Generation

Where possible, generate references from:

- Code comments (TSDoc)
- Configuration schemas
- Command help text
- API specifications

### Update Automation

Set up automation for:

- Link validation
- Example testing
- Format checking
- Duplicate detection

## Maintenance Schedule

### Weekly
- Review for obvious errors
- Check recent changes

### Monthly
- Validate all examples
- Update outdated information
- Check all links
- Review usage patterns

### Quarterly
- Major review and update
- Add new references as needed
- Archive obsolete content
- Gather user feedback

## Related Documentation

- [Guides](../guides/): Step-by-step tutorials
- [Architecture](../architecture/): Design documentation
- [API](../api/): API specifications
- [Runbooks](../runbooks/): Operational procedures

## Contributing

To add a reference document:

1. Choose appropriate reference type
2. Follow the template
3. Keep it concise and scannable
4. Include working examples
5. Add to this README
6. Link from related docs
7. Test all examples

## Feedback

Reference docs should be:

- **Fast**: Quick to scan and find information
- **Accurate**: Always up-to-date
- **Complete**: Cover common use cases
- **Accessible**: Easy to find and navigate

Help us improve by:
- Reporting outdated information
- Suggesting missing references
- Contributing examples
- Sharing usage patterns

---

**Note**: Reference documentation is meant for quick lookup. For detailed explanations, see the [Guides](../guides/) section.
