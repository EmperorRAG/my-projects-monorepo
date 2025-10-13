---
title: "Standardize Shared Configuration Assets"
status: "Accepted"
date: 2025-10-13
authors:
  - Platform Engineering Group
tags:
  - configuration
  - nginx
  - governance
---

## Status

Accepted

## Context

Multiple edge components independently defined security headers, logging formats, and Compose overlays, leading to drift and duplicated maintenance. The shared configuration assets feature PRD and implementation plan propose centralizing snippets and overlays under `tools/nginx/common/`, providing validation tooling, and documenting include patterns. Formalizing this library ensures every gateway and load balancer inherits hardened defaults and auditors can trace configuration lineage.

## Decision

Standardize on shared configuration assets by:

- Hosting reusable NGINX snippets (`headers.conf`, `logging.conf`, `tls.conf`, `cache.conf`) and Compose overlays (development, production) within `tools/nginx/common/`, referenced by gateway and load balancer configs.
- Updating services to consume these shared assets via documented `include` conventions and Compose layering, minimizing bespoke configuration.
- Providing Nx validation (`edge:lint-config`) and rendering scripts that run `nginx -t`, lint overlays, and generate aggregated configs for review before merges.
- Maintaining documentation and changelog entries that outline usage patterns, override guidance, and notification procedures for downstream teams when assets change.

## Consequences

### Positive

- POS-001 — Eliminates configuration drift by ensuring all edge components inherit the same security headers, logging, and TLS posture.
- POS-002 — Speeds code review and onboarding by centralizing snippets and overlays with clear documentation.
- POS-003 — Improves compliance traceability through version-controlled assets and validated configuration reports.

### Negative

- NEG-001 — Introduces coordination overhead when updating shared snippets, requiring communication to dependent teams.
- NEG-002 — Adds validation steps (linting, rendering) to build pipelines, slightly increasing execution time.
- NEG-003 — May constrain bespoke edge cases that require divergent settings unless override mechanisms are well-documented.

## Alternatives

- ALT-001 — Allow each service to maintain its own snippets. Rejected due to duplication and inconsistent security posture.
- ALT-002 — Generate configuration dynamically per service without shared assets. Rejected because it complicates auditability and increases template complexity.
- ALT-003 — Rely solely on manual code review to enforce standards. Rejected since automation provides more reliable guardrails.

## Implementation Notes

- IMP-001 — Organize shared assets under `tools/nginx/common/` with manifests describing snippet and overlay usage for tooling consumption.
- IMP-002 — Ensure gateway and load balancer configs include shared snippets and that overlays mount required volumes and environment variables consistently.
- IMP-003 — Implement `edge:lint-config` and `render-config.sh` to validate includes, run `nginx -t`, and produce reviewable outputs in CI.
- IMP-004 — Document override patterns and maintain a changelog to track updates, highlighting breaking changes for dependent teams.

## References

- REF-001 — docs/tools/nginx/epics/edge-traffic-platform/epic.md
- REF-002 — docs/tools/nginx/epics/edge-traffic-platform/arch.md
- REF-003 — docs/tools/nginx/epics/edge-traffic-platform/features/shared-configuration-assets/prd.md
- REF-004 — docs/tools/nginx/epics/edge-traffic-platform/features/shared-configuration-assets/implementation-plan.md
- REF-005 — docs/tools/nginx/epics/edge-traffic-platform/features/dedicated-load-balancers/prd.md
