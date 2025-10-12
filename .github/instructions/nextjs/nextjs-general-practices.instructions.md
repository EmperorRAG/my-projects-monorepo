---
applyTo: 'apps/**/app/**/*.{ts,tsx,js,jsx}'
---

# Next.js General Practices

## TypeScript and Quality
- Enable `strict` mode and honor lint feedback; keep the official Next.js ESLint configuration in sync with framework upgrades.
- Treat TypeScript errors as blockers and avoid suppressing them with `any` unless you capture a follow-up task.
- Prefer type guards and discriminated unions to model control flow explicitly, and lean on Zod (or Effect Schema) when runtime validation is required.

## Environment and Secrets
- Store secrets exclusively in `.env.local` or the platform secret store; never commit sensitive values.
- Document required environment variables so deployments stay reproducible.

## Testing and Observability
- Cover critical logic with Jest or React Testing Library, and include Playwright coverage for end-to-end flows.
- Keep accessibility in mind by using semantic HTML, ARIA attributes, and manual screen reader checks.

## Performance and Security
- Use built-in Image and Font optimization, Suspense, and streaming to minimize bundle size; rely on route prefetching and code splitting to keep navigation snappy.
- Sanitize all user input, enforce HTTPS, and apply secure headers that match your deployment target.
- Harden API routes with authentication/authorization checks, CSRF protection where relevant, and rate limiting on mutation endpoints.

## Documentation
- Update README files and component docs when interfaces change so other teams stay aligned.
