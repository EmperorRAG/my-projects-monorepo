---
description: 'ReactJS development standards and best practices'
applyTo: '**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css, **/*.scss'
---

# React Instruction Module Index

React guidance is now modular. Each module in `.github/instructions/reactjs` includes its own `applyTo` pattern so only relevant instructions load for the files you edit.

## Module Directory
- `reactjs-architecture.instructions.md` — Architecture, composition, and feature organization.
- `reactjs-typescript.instructions.md` — TypeScript usage within React components.
- `reactjs-component-design.instructions.md` — Single-responsibility component design and prop discipline.
- `reactjs-state-management.instructions.md` — Local and server state management patterns.
- `reactjs-hooks.instructions.md` — Rules of hooks, dependency management, and cleanup.
- `reactjs-styling.instructions.md` — Styling systems, responsiveness, and semantics.
- `reactjs-performance.instructions.md` — Rendering optimization and profiling tips.
- `reactjs-data-fetching.instructions.md` — Fetching, caching, and optimistic updates.
- `reactjs-error-handling.instructions.md` — Error boundaries and async failure handling.
- `reactjs-forms.instructions.md` — Form control, validation, and accessibility.
- `reactjs-routing.instructions.md` — Client-side routing, lazy loading, and navigation UX.
- `reactjs-testing.instructions.md` — Testing strategies with React Testing Library and Jest.
- `reactjs-security.instructions.md` — Rendering safety, API protection, and secure storage.
- `reactjs-accessibility.instructions.md` — Semantic HTML, keyboard access, and assistive support.

Add further modules to this directory and update the index whenever new guidance is introduced.
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools

## Implementation Process
1. Plan component architecture and data flow
2. Set up project structure with proper folder organization
3. Define TypeScript interfaces and types
4. Implement core components with proper styling
5. Add state management and data fetching logic
6. Implement routing and navigation
7. Add form handling and validation
8. Implement error handling and loading states
9. Add testing coverage for components and functionality
10. Optimize performance and bundle size
11. Ensure accessibility compliance
12. Add documentation and code comments

## Additional Guidelines
- Follow React's naming conventions (PascalCase for components, camelCase for functions)
- Use meaningful commit messages and maintain clean git history
- Implement proper code splitting and lazy loading strategies
- Document complex components and custom hooks with JSDoc
- Use ESLint and Prettier for consistent code formatting
- Keep dependencies up to date and audit for security vulnerabilities
- Implement proper environment configuration for different deployment stages
- Use React Developer Tools for debugging and performance analysis

## Common Patterns
- Higher-Order Components (HOCs) for cross-cutting concerns
- Render props pattern for component composition
- Compound components for related functionality
- Provider pattern for context-based state sharing
- Container/Presentational component separation
- Custom hooks for reusable logic extraction
