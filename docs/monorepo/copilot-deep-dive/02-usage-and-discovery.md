# 2. Usage and Discovery of Instruction Files

Understanding how GitHub Copilot finds and applies instructions is key to using them effectively. The process is designed to be automatic and context-aware, ensuring that the right guidance is used at the right time.

## The Discovery Process

GitHub Copilot automatically discovers instruction files by looking for a specific directory in the root of your workspace:

- **Location:** `.github/instructions/`

When you open a workspace and start using Copilot (for chat or code completion), it scans this directory for any files with a `.md` extension. Each markdown file found is treated as a potential source of instructions for the AI.

### Why `.github/`?

This location is a common convention for repository-specific configuration and metadata, used by GitHub for features like issue templates, pull request templates, and GitHub Actions workflows. Placing instructions here keeps them version-controlled and logically grouped with other repository-level settings.

## Loading and Application

Once discovered, the instruction files are not all applied at once. Copilot uses a scoping mechanism to determine which instructions are relevant to the file you are currently editing or the context of your chat.

This is controlled by the `applyTo` property in the YAML frontmatter of each instruction file.

### The `applyTo` Property

The `applyTo` property is a powerful feature that lets you define which files an instruction set should apply to. It uses a **glob pattern** to match file paths.

```yaml
---
# This instruction file will only apply to TypeScript and TSX files
# located anywhere within the 'src/components/' directory.
applyTo: 'src/components/**/*.{ts,tsx}'
description: 'React component best practices'
---

# React Component Instructions
All components should be functional components using hooks...
```

**How it works:**

1. **Context:** When you are editing a file (e.g., `src/components/ui/Button.tsx`), Copilot gets its path.
2. **Matching:** Copilot checks the `applyTo` glob pattern in each instruction file against the current file's path.
3. **Application:** If the path matches the glob pattern, the content of that instruction file is loaded and included in the context sent to the AI model. If it doesn't match, the instruction file is ignored for that specific interaction.

If the `applyTo` property is omitted or set to a broad pattern like `**/*`, the instructions will apply globally to all files in the workspace.

### Example Scenarios

- **Global Instructions:** An `instructions.md` file with `applyTo: '**/*'` could contain general project information or universal coding standards.
- **Language-Specific Instructions:** A `python.instructions.md` file with `applyTo: '**/*.py'` can enforce PEP 8 standards and Python-specific patterns.
- **Framework-Specific Instructions:** A `react.instructions.md` with `applyTo: 'src/views/**/*.{jsx,tsx}'` can guide the creation of React components within a specific part of your application.

This targeted approach ensures that the context provided to the AI is highly relevant, leading to more accurate and useful suggestions.

---

### Official Documentation

The concept of context customization is central to improving Copilot's performance. You can read more about related features in the official documentation.

- [Customizing GitHub Copilot](https://docs.github.com/en/copilot/customizing-github-copilot)
- [Configuring GitHub Copilot in your environment](https://docs.github.com/en/copilot/configuring-github-copilot)

Next, we'll delve into the specific effects that using these instructions has on the AI's behavior.
