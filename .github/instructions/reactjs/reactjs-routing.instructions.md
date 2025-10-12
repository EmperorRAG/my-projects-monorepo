---
applyTo: '**/*.{tsx,jsx,ts,js}'
---

# React Routing Practices

## Navigation
- Use React Router (or the workspace standard) for declarative routing, nested routes, and protected paths.
- Handle route parameters and query strings with typed helpers to avoid runtime parsing errors.

## UX
- Implement lazy-loaded routes to improve initial load time, and provide loading indicators during transitions.
- Manage breadcrumbs and navigation state so back-button behavior works as expected.
