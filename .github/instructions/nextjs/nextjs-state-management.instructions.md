---
applyTo: 'apps/**/app/**/*.{ts,tsx,js,jsx}'
---

# Next.js State Management Guidance

## Server State
- Prefer Server Components for data that can be fetched and rendered on the server; pass serialized props to client components only when interaction is required.
- Keep server mutations within Route Handlers or Server Actions so side effects stay on the server boundary.

## Client State
- Use React hooks (`useState`, `useReducer`, `useContext`) for local state, promoting smaller client islands over monolithic client trees.
- Provide explicit loading and error states for client transitions so navigation feedback remains clear.
- Consider optimistic updates for latency-sensitive interactions, rolling back when the server rejects the change.

## Coordination
- Document where state lives (server vs. client) in component comments or README files for complex features.
- Avoid duplicating the same slice of state in both server and client layers; choose a single source of truth and derive views from it.
