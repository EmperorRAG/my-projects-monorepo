---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Core Principles

## Dependency Injection
- Mark services, repositories, and helpers with `@Injectable()` so the framework can manage their lifecycle.
- Inject collaborators through constructor parameters and rely on interfaces or abstract classes where testability matters.
- Use custom providers when you need fine-grained instantiation, such as value factories or aliases.

## Modular Architecture
- Group related features into modules decorated with `@Module()` and expose only what the feature needs.
- Import the minimum required modules to avoid tight coupling and watch for circular imports when features cross-reference each other.
- Prefer `forRoot`/`forFeature` patterns for configurable modules that need runtime options.

## Decorators & Metadata
- Apply the correct decorators for routing (`@Controller`, `@Get`, `@Post`), providers, guards, and pipes.
- Leverage `class-validator` and `class-transformer` decorators on DTOs instead of manual checks.
- Create custom decorators for shared cross-cutting concerns (for example retrieving the current user) rather than duplicating boilerplate.
