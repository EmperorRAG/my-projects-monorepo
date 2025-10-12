---
applyTo: 'services/**/*.ts,services/**/*.js,services/**/*.json,services/**/*.spec.ts,services/**/*.e2e-spec.ts,libs/**/*.ts,libs/**/*.js,libs/**/*.json,libs/**/*.spec.ts,libs/**/*.e2e-spec.ts'
---

# NestJS Testing Strategy

## Unit Tests

-   Use `Test.createTestingModule` to build isolated modules and mock dependencies with `useValue` or `useFactory`.
-   Focus on service logic, verifying interactions with repositories or providers using Jest spies.

## Integration & E2E

-   For integration tests, instantiate modules with real providers where possible and exercise HTTP flows with `supertest`.
-   Reset database state between tests to ensure determinism.
