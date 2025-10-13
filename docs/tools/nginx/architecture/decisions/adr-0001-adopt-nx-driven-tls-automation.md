---
title: "Adopt Nx-Driven TLS Automation for NGINX Edge Tooling"
status: "Accepted"
date: 2024-04-06
authors:
  - Platform Engineering Group
tags:
  - tls
  - nginx
  - automation
---

## Status

Accepted

## Context

The platform previously relied on manual certificate generation and ad hoc NGINX configuration to enable HTTPS across development and production environments. This created inconsistent SAN coverage, brittle renewal scheduling, and risk of expired certificates disrupting user-facing traffic. The automated TLS management epic, architecture specification, and feature implementation plans define a cohesive toolchain of Nx tasks, hardened NGINX snippets, and shell tooling that orchestrate certificate issuance, validation, rotation, and Let’s Encrypt enrollment while maintaining audit trails and secure key handling. Aligning on this approach ensures the edge stack can deliver compliant TLS defaults with minimal operator effort and clear documentation for both SaaS and self-hosted deployments.

## Decision

Standardize the NGINX toolchain on the automated TLS architecture by:

- Surfacing certificate workflows through dedicated Nx targets backed by shellcheck-compliant scripts for generation, validation, rotation, and Let’s Encrypt enrollment.
- Enforcing the Docker Compose TLS overlay, secure volume mounts, and hardened NGINX configuration snippets (HSTS, OCSP stapling, modern cipher suites) as the baseline edge deployment pattern.
- Managing certificate artifacts outside source control with structured logs and renewal metadata to support audits and rotation automation.
- Shipping companion documentation and developer UX (Nx command help, trust-store guides, docs site content) so teams can adopt HTTPS in minutes without bespoke tooling.

## Consequences

### Positive

- POS-001 — Dramatically reduces certificate expiry incidents by codifying renewal scheduling and zero-downtime reloads within Nx automation.
- POS-002 — Provides consistent cryptographic defaults (SAN coverage, key strength, cipher policies) across dev, staging, and production, improving compliance posture.
- POS-003 — Lowers onboarding friction through one-command provisioning and documented trust-store steps that align developer environments with production security.

### Negative

- NEG-001 — Requires ongoing maintenance of Bash tooling, Nx executors, and Docker overlays to track ACME, OpenSSL, and NGINX changes.
- NEG-002 — Adds complexity to the tooling surface area; teams must learn the Nx `tls:*` task suite and adhere to secure storage conventions for generated keys.
- NEG-003 — Depends on Let’s Encrypt availability for production issuance, necessitating contingency planning for ACME outages.

## Alternatives

- ALT-001 — Continue manual certificate management with ad hoc scripts and reminders. Rejected because it offers no guardrails against expiry, produces inconsistent SAN coverage, and scales poorly for new teams.
- ALT-002 — Outsource TLS termination to a managed CDN or cloud load balancer (e.g., Cloudflare, AWS ACM). Rejected because the platform must support self-hosted deployments and offline environments where external services are not viable, and because it reduces configurability of the hardened NGINX edge stack.
- ALT-003 — Integrate a monolithic certificate manager within the application stack. Rejected due to increased application complexity and weaker separation of duties compared to a reusable tooling layer.

## Implementation Notes

- IMP-001 — Host shell scripts under `tools/nginx/scripts/tls/` with Nx targets (`tls:generate-dev-certs`, `tls:validate-certs`, `tls:rotate-certs`, `tls:setup-letsencrypt`, `tls:test-https`) to provide a consistent CLI experience.
- IMP-002 — Package Docker Compose overlays and NGINX snippets with secure volume mounts and health checks so edge deployments inherit hardened TLS defaults by default.
- IMP-003 — Store certificates in dedicated filesystem paths with restrictive permissions, emit JSON summaries for audits, and ensure rotation workflows back up expiring assets before reloads.
- IMP-004 — Maintain developer documentation within the Next.js docs hub describing commands, OS trust-store procedures, troubleshooting, and escalation paths.

## References

- REF-001 — docs/tools/nginx/epics/automated-tls-management/epic.md
- REF-002 — docs/tools/nginx/epics/automated-tls-management/arch.md
- REF-003 — docs/tools/nginx/epics/automated-tls-management/features/automated-development-certificates/prd.md
- REF-004 — docs/tools/nginx/epics/automated-tls-management/features/certificate-validation-pipeline/prd.md
- REF-005 — docs/tools/nginx/epics/automated-tls-management/features/certificate-rotation-workflow/prd.md
- REF-006 — docs/tools/nginx/epics/automated-tls-management/features/lets-encrypt-automation/prd.md
- REF-007 — docs/tools/nginx/epics/automated-tls-management/features/tls-compose-overlay/prd.md
- REF-008 — docs/tools/nginx/epics/automated-tls-management/features/tls-documentation-suite/prd.md
