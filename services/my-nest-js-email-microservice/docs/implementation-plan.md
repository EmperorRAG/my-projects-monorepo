---
post_title: "Unit Test Foundation Implementation Plan"
author1: "GitHub Copilot"
post_slug: "unit-test-foundation-implementation-plan"
microsoft_alias: "copilot"
featured_image: ""
categories:
	- testing
tags:
	- nestjs
	- jest
	- quality
ai_note: "Co-created with GitHub Copilot."
summary: "Step-by-step plan for delivering the first backlog item: core unit tests for the NestJS email microservice."
post_date: 2025-10-09
---

<!-- markdownlint-disable-next-line MD041 -->
## Context

- Target backlog item: "Add unit tests listed above with priority P1 for guard, DTO, and service coverage; P2 for config schema and logging verifications."
- Service scope: `services/my-nest-js-email-microservice`.
- Goal: establish reliable unit test coverage for auth, DTO validation, SMTP delegation, and configuration schema without altering runtime code paths.

## Assumptions

- Jest with ts-jest is already configured through Nx (`npx nx test my-nest-js-email-microservice`).
- Nodemailer transport interactions can be mocked; no live SMTP connection is required.
- Existing spec files may be replaced if they no longer reflect real behaviours.
- Logger outputs can be captured via `jest.spyOn(Logger.prototype, 'log')` style hooks.

## Milestones

1. **Test Bed Preparation**

- Create `services/my-nest-js-email-microservice/test/fixtures/email.ts` exporting shared DTO payloads and tokens.
- Update `tsconfig.spec.json` includes or Jest module paths if the new fixtures folder is not auto-resolved.

2. **Auth Layer Specs**

- Author `auth/better-auth.service.spec.ts` verifying `validateToken` truth table.
- Add `auth/s2s-auth.guard.spec.ts` stubbing `ExecutionContext` to exercise success and error branches.

3. **DTO and Config Specs**

- Write `app/dto/send-email.dto.spec.ts` using `class-validator` `validate` helper for positive and negative cases.
- Cover `config/validation.spec.ts` asserting Joi schema acceptance and descriptive failures for missing keys.

4. **Service Behaviour Specs**

- Replace legacy `app/app.controller.spec.ts` with focused `app/app.service.spec.ts` exercising success and failure logging.
- Add `smtp/smtp.service.spec.ts` verifying delegation to injected transport and rejection propagation.

5. **Repository Hygiene**

- Ensure mocks reset between tests via `beforeEach`/`afterEach` in each spec.
- Update README testing section with new command notes if needed.
- Run `npx nx test my-nest-js-email-microservice` and address failures.

## Detailed Tasks

### 1. Test Bed Preparation

- Create fixtures file providing `validSendEmailDto`, `invalidEmailDto`, `validToken`, and `invalidToken` constants.
- Export helper to clone DTOs for mutation-free scenarios.
- Adjust Jest path aliases in `jest.config.ts` if imports use `@fixtures` shorthand; otherwise rely on relative paths.
- Verify TypeScript picks up the fixtures by running the existing test target (expect no build errors).

### 2. Auth Layer Specs

- In `better-auth.service.spec.ts`, instantiate the service directly and assert boolean outcomes for valid/invalid tokens.
- For guard tests, mock `BetterAuthService` responses and build a fake HTTP request within a stubbed `ExecutionContext`.
- Cover error messaging for missing header, malformed scheme, and invalid token; ensure the happy path returns `true`.

### 3. DTO and Config Specs

- Use `validate` from `class-validator` to confirm:
  - Valid payload resolves to an empty error array.
  - Invalid email produces the custom message defined in the DTO.
  - Missing subject/body emit `IsNotEmpty` errors.
- For `validation.spec.ts`, call `validationSchema.validate` with:
  - Fully populated env map returning `value` with coerced types.
  - Missing `SMTP_PASS` map producing a descriptive error that the test snapshots or string-matches.

### 4. Service Behaviour Specs

- Update `app/app.service.spec.ts` to inject a mocked `SmtpService` that resolves and rejects; assert `Logger` logging paths using spies.
- Remove outdated controller test relying on deprecated `sendTestEmail` signature to avoid confusion.
- Add `smtp/smtp.service.spec.ts` creating a fake transport object with `sendMail` spy; ensure errors propagate using `rejects.toThrow` assertions.

### 5. Repository Hygiene

- Document the new fixture location and any changes to test commands in the service README.
- Run `npx nx test my-nest-js-email-microservice` and fix lint/test failures.
- Capture coverage delta; if below expectations, add follow-up ticket to extend tests.

## Acceptance Criteria

- All new specs pass under `npx nx test my-nest-js-email-microservice`.
- Coverage for `auth`, `app/dto`, `app/app.service.ts`, `smtp/smtp.service.ts`, and `config/validation.ts` is above agreed baseline (target 80% line coverage for touched files).
- No lint violations or markdown guideline issues introduced by the change set.
- README documents how to run the refreshed unit tests and references shared fixtures.

## Risks and Mitigations

- **Risk**: Existing controller spec removal may reduce perceived coverage.
  - **Mitigation**: Document change in PR notes and highlight new coverage metrics.
- **Risk**: Logger spies could leak state between tests.
  - **Mitigation**: Reset mocks in `afterEach` and prefer `jest.restoreAllMocks()`.
- **Risk**: Joi error messages may differ across library versions.
  - **Mitigation**: Use regex match for key fragments rather than full string equality.

## Definition of Done

- Unit tests added and passing.
- Documentation updated with fixture usage and test commands.
- PR includes coverage screenshot or summary for reviewers.
- Follow-up tickets (if any) filed for remaining backlog items (integration, e2e).
