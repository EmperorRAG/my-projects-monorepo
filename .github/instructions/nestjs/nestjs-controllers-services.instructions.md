---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Controllers & Services

## Controllers
- Keep controllers thin: accept requests, trigger validation, and delegate to services for business logic.
- Apply guards, interceptors, and pipes at the route or controller level to keep behavior explicit.
- Return DTOs or domain objects rather than raw database entities when responses need shaping.

## Services
- Implement core business logic inside services marked `@Injectable()` and use constructor injection for dependencies.
- Handle side effects (persistence, messaging, emails) within services and surface meaningful errors for filters to translate.
- Split large services into focused units to keep responsibilities narrow and testable.
