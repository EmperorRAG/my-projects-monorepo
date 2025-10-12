---
applyTo: 'services/**/*.ts,services/**/*.js,services/**/*.json,services/**/*.spec.ts,services/**/*.e2e-spec.ts,libs/**/*.ts,libs/**/*.js,libs/**/*.json,libs/**/*.spec.ts,libs/**/*.e2e-spec.ts'
---

# NestJS Database Integration

## TypeORM Usage

-   Define entities with `@Entity`, `@Column`, and relationship decorators, capturing indexes and eager/lazy strategy explicitly.
-   Inject repositories via `@InjectRepository(Entity)` and use repository methods instead of directly accessing the database client.
-   Use migrations for schema changes and keep them in version control.

## Custom Repositories & Query Builders

-   Extend repositories or use `DataSource.getRepository()` when custom querying is required.
-   Rely on query builders for dynamic filtering while keeping SQL injection safeguards in place.
