---
title: "Automate Certificate Rotation with Backup-First Workflow"
status: "Accepted"
date: 2025-10-13
authors:
  - Platform Engineering Group
tags:
  - tls
  - nginx
  - rotation
---

## Status

Accepted

## Context

Production rotations were previously handled with ad hoc shell steps that copied certificates, reloaded NGINX, and hoped no active sessions were dropped. Those brittle routines lacked backups, dry-run validation, or structured logging, leaving on-call engineers vulnerable to downtime during renewals and auditors without reliable evidence of control adherence. The certificate rotation feature PRD and implementation plan define an automation-first approach: idempotent scripts orchestrated through Nx targets to back up existing material, install new assets, trigger graceful reloads, and prune retention sets while emitting detailed logs. The solution must operate across containerized and host-based deployments, complete within 30 seconds, and offer configurable toggles for dry runs, reload skipping, and backup retention.

## Decision

Adopt the standardized rotation workflow by shipping `tls:rotate-certs` Nx automation backed by `rotate-certs.sh`, enforcing the following:

- Always perform timestamped backups before installing new certificates, honoring operator-defined retention windows and restricting permissions to match originals.
- Provide dry-run and reload toggles so teams can validate steps, rehearse in CI, and coordinate multi-node maintenance windows without touching live traffic.
- Execute graceful reloads (`nginx -s reload`/`systemctl reload nginx`) with health verification and structured JSON/text logs capturing actions, durations, and outcome codes.
- Persist logs alongside rotation artifacts for audit review and expose human-readable summaries through Nx output and documentation so teams can trust the automation under pressure.

## Consequences

### Positive

- POS-001 — Guarantees rollback paths by backing up prior certificates before swaps, reducing recovery time if new assets prove invalid.
- POS-002 — Minimizes downtime risk through graceful reloads and optional dry-run rehearsals, aligning with SRE expectations for zero-downtime maintenance.
- POS-003 — Improves compliance posture: structured logs and retention controls give auditors verifiable evidence of each rotation event.

### Negative

- NEG-001 — Introduces additional tooling that engineers must learn and maintain, including Nx executor options and shell scripting nuances.
- NEG-002 — Requires disciplined storage management to prevent backup directories from consuming disk space when retention settings are misconfigured.
- NEG-003 — Adds dependencies on host capabilities (`nginx` binaries, permission to reload services), complicating deployments in constrained environments without full OS access.

## Alternatives

- ALT-001 — Continue manual rotations with documentation checklists. Rejected because human-driven steps are error-prone, lack audit trails, and cannot guarantee graceful reloads under time pressure.
- ALT-002 — Delegate rotation entirely to managed TLS services or external load balancers. Rejected since the platform must support self-hosted, air-gapped, and Docker-first deployments where external services are unavailable or undesired.
- ALT-003 — Build a bespoke GUI/agent-based rotation service. Rejected due to higher complexity, increased operational surface area, and overlap with existing CLI-driven automation practices.

## Implementation Notes

- IMP-001 — Place `rotate-certs.sh` under `tools/nginx/scripts/tls/` and expose Nx options (`--retain-count`, `--dry-run`, `--skip-reload`, `--cert-dir`, `--backup-dir`) mirroring script flags.
- IMP-002 — Use timestamped backup directory names (`YYYYMMDD-HHMMSS`) with secure permissions and prune with a simple retention loop after successful rotations.
- IMP-003 — Implement structured JSON logging persisted to `tools/nginx/scripts/tls/logs/` and emit human-readable summaries for terminal use; include run IDs for cross-referencing.
- IMP-004 — Add integration tests via Docker Compose to validate zero-downtime behavior and document multi-node sequencing guidance in the documentation portal.

## References

- REF-001 — docs/tools/nginx/epics/automated-tls-management/epic.md
- REF-002 — docs/tools/nginx/epics/automated-tls-management/arch.md
- REF-003 — docs/tools/nginx/epics/automated-tls-management/features/certificate-rotation-workflow/prd.md
- REF-004 — docs/tools/nginx/epics/automated-tls-management/features/certificate-rotation-workflow/implementation-plan.md
- REF-005 — docs/tools/nginx/epics/automated-tls-management/features/tls-documentation-suite/prd.md
