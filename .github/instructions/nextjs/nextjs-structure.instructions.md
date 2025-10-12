---
applyTo: 'apps/**/app/**'
---

# Next.js Project Structure Guidance

## Core Structure
- Use the App Router by default; avoid new `pages/` routes unless maintaining legacy code.
- Keep top-level directories consistent: `app/`, `public/`, `lib/`, `components/`, `contexts/`, `styles/`, `hooks/`, and `types/`.
- Colocate supporting files (styles, tests, stories) near their components without creating deeply nested folders.
- Define error and loading boundaries (`error.tsx`, `loading.tsx`) alongside routes so failures degrade gracefully.
- Evaluate each route for static rendering opportunities (`generateStaticParams`, `revalidate`) to keep responses fast and cache-friendly.

## Route Organization
- Apply route groups with parentheses, such as `(marketing)`, to separate concerns without affecting URLs.
- Mark implementation details with leading underscores (for example `_internal`) to keep them out of the routing tree.
- Organize large areas by feature folders like `app/dashboard/` or `app/auth/` to support domain-driven design.

## Repo Layout
- Use an optional `src/` directory when you want to separate source from configuration, but remain consistent across the workspace.
- Document any deviations from the standard layout so contributors can navigate quickly.
