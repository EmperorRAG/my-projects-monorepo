# 1. Introduction to GitHub Copilot Instructions

This document provides an overview of GitHub Copilot instructions, explaining what they are, how they function, and why they are a powerful tool for guiding AI-assisted development.

## What are `instructions.md` files?

GitHub Copilot `instructions.md` files (or any markdown file within the `.github/instructions` directory) are specialized markdown files that allow developers to provide direct, persistent, and context-aware guidance to the GitHub Copilot and Copilot Chat models.

Think of them as a set of "standing orders" or a "style guide" for the AI. Instead of repeatedly typing the same instructions or corrections in a chat prompt, you can define them once in these files. Copilot then automatically incorporates this guidance into its context when generating code suggestions or chat responses.

### Core Purpose

The primary goal of instruction files is to customize Copilot's behavior to align with your project's specific needs, conventions, and architectural patterns. This helps ensure that the AI-generated code is more consistent, idiomatic, and relevant to your existing codebase.

Key use cases include:

- **Enforcing Coding Standards:** Specify naming conventions, formatting rules, and style preferences.
- **Defining Architectural Patterns:** Guide Copilot to use specific design patterns (e.g., functional programming, MVC, data-last functions).
- **Specifying Library/Framework Usage:** Instruct Copilot on how to use certain libraries, frameworks, or internal APIs correctly.
- **Providing Project-Specific Context:** Inform Copilot about the project's structure, key files, and development workflow.
- **Restricting Undesirable Patterns:** Explicitly forbid anti-patterns or deprecated practices.

### How They Work

When you interact with Copilot (either through code completion or chat), it searches for instruction files in a `.github/instructions` directory within your workspace root. If found, it reads these files and integrates their content into the context it sends to the language model. This process is automatic and happens in the background.

By providing this curated context directly, you can significantly influence the AI's output without cluttering your immediate prompt with repetitive details.

---

### Official Documentation

For the most current and detailed information, always refer to the official GitHub Copilot documentation. While a specific public link for `instructions.md` is not readily available, the feature is part of the broader context customization capabilities of GitHub Copilot Enterprise and is being integrated into other Copilot offerings.

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Getting started with GitHub Copilot](https://docs.github.com/en/copilot/getting-started-with-github-copilot)

Next, we will explore how Copilot discovers and uses these files in more detail.
