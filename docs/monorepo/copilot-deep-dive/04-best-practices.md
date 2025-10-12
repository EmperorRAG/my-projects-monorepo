# 4. Best Practices for Structuring and Locating Instruction Files

To maximize the effectiveness of GitHub Copilot instructions, it's important to structure them clearly and locate them appropriately. Following best practices ensures that the AI receives precise, relevant, and easily parsable context.

## Directory Structure and Location

- **Centralized Location:** Always place your instruction files inside the `.github/instructions/` directory at the root of your repository. This is the designated location that Copilot scans.
- **Version Control:** Since this directory is part of your repository, all instructions are version-controlled with Git. This allows your entire team to benefit from and contribute to the same set of guidelines.

## File Naming and Organization

- **Descriptive Filenames:** Give your files clear, descriptive names that indicate their purpose, such as `react-best-practices.md`, `python-pep8.md`, or `global-conventions.md`.
- **Granularity:** It's better to have multiple, focused instruction files than one massive, monolithic file. This allows you to use the `applyTo` property more effectively, scoping instructions to specific languages, frameworks, or project sections.

  - **Good:** `nextjs.md`, `tailwind.md`, `testing-library.md`
  - **Avoid:** `everything.md`

## Structuring the Content

### 1. Use YAML Frontmatter for Scoping

The frontmatter block at the top of the file is crucial for metadata.

- **`applyTo`:** Always use this property to define a glob pattern. Be as specific as possible to avoid applying instructions in the wrong context.
- **`description`:** Provide a brief, human-readable description of the file's purpose. This helps other developers understand the intent of the instructions.

```yaml
---
applyTo: 'apps/my-next-app/src/components/**/*.tsx'
description: 'Best practices for creating UI components in the Next.js app.'
---
```

### 2. Write Clear and Direct Instructions

Use clear, unambiguous language. Remember that you are writing for a machine, so direct commands are more effective than subtle hints.

- **Do:** "All functions must be exported using named exports. Do not use default exports."
- **Don't:** "I generally prefer to use named exports if possible."

### 3. Use Markdown for Structure

Organize your instructions logically using Markdown headings, lists, and code blocks. This improves readability for both humans and the AI.

- **Headings (`#`, `##`):** Use headings to create distinct sections for different topics (e.g., "Naming Conventions," "State Management," "Error Handling").
- **Lists:** Use bulleted or numbered lists to present rules and guidelines clearly.
- **Code Blocks:** Provide "good" and "bad" examples in code blocks to give the AI concrete patterns to follow and avoid.

### 4. Provide Concrete Examples

Show, don't just tell. Examples are one of the most powerful ways to guide the AI.

```markdown
### Good Example: Functional Component with Hooks

\`\`\`tsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

export default Counter;
\`\`\`

### Bad Example: Class Component

Avoid using class components.

\`\`\`tsx
import React from 'react';

class Counter extends React.Component {
  // ... implementation ...
}
\`\`\`
```

### 5. Keep It Concise

While it's important to be clear, overly long and verbose instruction files can be less effective. The AI has a limited context window, so focus on the most critical guidelines that provide the highest value. Prioritize rules that are project-specific and differ from common public conventions.

---

### Official Documentation

For more on optimizing your interactions with Copilot, refer to the official guides.

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [Configuring GitHub Copilot](https://docs.github.com/en/copilot/configuring-github-copilot)

Next, we will explore the technical details of how Copilot consumes and parses these instruction files.
