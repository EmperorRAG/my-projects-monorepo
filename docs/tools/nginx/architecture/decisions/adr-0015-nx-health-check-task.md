---
title: "Provide Nx Health Check Task for Edge Verification"
status: "Accepted"
date: 2025-10-13
authors:
  - Platform Engineering Group
tags:
  - nx
  - automation
  - health
---

## Status

Accepted

## Context

Health verification previously depended on manual `curl` commands embedded in disparate CI jobs, leading to inconsistent coverage, brittle scripts, and limited reporting. The unified health monitoring initiative established standardized endpoints and Docker healthchecks but lacked a cohesive automation layer for CI and local validation. The Nx health check task feature delivers a typed script, configuration schema, and custom executor that integrate with the monorepo’s build system to provide repeatable, auditable health checks across environments.

## Decision

Implement the Nx health check task by:

- Building a TypeScript script (`tools/nginx/scripts/health/check.ts`) and configuration file that enumerate gateway and load balancer endpoints with expected status codes, timeouts, and retry logic.
- Registering an Nx target (`health:run`, aliased to `nginx-health:check`) that executes the script, returns non-zero on failures, and emits structured console output plus JSON reports for downstream consumption.
- Supporting environment-specific overrides through CLI flags and environment variables so pipelines and engineers can tailor endpoint selection without modifying source.
- Adding unit and integration tests that validate success, timeout, and failure pathways, ensuring cross-platform compatibility on Windows and Linux runners.

## Consequences

### Positive

- POS-001 — Provides a standardized, cacheable Nx command that pipelines can invoke to gate releases on edge service health.
- POS-002 — Produces structured reports that aid debugging and can fuel future observability adapters without rewriting scripts.
- POS-003 — Reduces duplication by consolidating health logic into a reusable executor shared across teams and environments.

### Negative

- NEG-001 — Introduces new tooling that engineers must learn, including configuration schemas and CLI flags.
- NEG-002 — Requires maintenance to keep endpoint lists and authentication mechanisms in sync with evolving infrastructure.
- NEG-003 — Adds execution time to CI pipelines, which must be balanced against deployment velocity.

## Alternatives

- ALT-001 — Continue using bespoke shell scripts per pipeline. Rejected because it perpetuates drift and lacks shared reporting or testing.
- ALT-002 — Depend solely on Docker healthchecks for automation. Rejected since container-level checks do not cover gateway proxy behavior or provide aggregate reporting.
- ALT-003 — Integrate a third-party monitoring SaaS for pre-deployment checks. Rejected due to licensing, connectivity requirements, and reduced control within self-hosted environments.

## Implementation Notes

- IMP-001 — Use `undici` (or similar lightweight HTTP client) with concurrency limits to ensure performant checks without overwhelming endpoints.
- IMP-002 — Validate configuration inputs with `zod`, surfacing helpful error messages when misconfigured.
- IMP-003 — Store JSON reports under `tools/nginx/scripts/health/reports/` with schema versioning and ensure CI archives artifacts for auditing.
- IMP-004 — Document command usage, flags, and sample reports within the health documentation suite.

## References

- REF-001 — docs/tools/nginx/epics/unified-health-monitoring/epic.md
- REF-002 — docs/tools/nginx/epics/unified-health-monitoring/arch.md
- REF-003 — docs/tools/nginx/epics/unified-health-monitoring/features/nx-health-check-task/prd.md
- REF-004 — docs/tools/nginx/epics/unified-health-monitoring/features/nx-health-check-task/implementation-plan.md
- REF-005 — docs/tools/nginx/epics/unified-health-monitoring/features/gateway-proxy-health-endpoints/implementation-plan.md
