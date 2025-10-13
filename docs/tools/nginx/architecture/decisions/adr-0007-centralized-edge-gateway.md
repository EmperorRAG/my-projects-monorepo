---
title: "Stand Up Centralized Edge Gateway"
status: "Accepted"
date: 2025-10-13
authors:
  - Platform Engineering Group
tags:
  - edge-gateway
  - tls
  - security
---

## Status

Accepted

## Context

Ingress traffic previously bypassed a unified control plane, leaving TLS termination, security headers, caching, and rate limiting scattered across individual services. This fragmentation increased operational toil and created inconsistent security posture. The centralized edge gateway feature PRD and implementation plan define a hardened NGINX gateway container that centralizes TLS termination, host-based routing, caching, compression, and observability while providing Nx automation and documentation for onboarding new services. We need to ratify this architecture as the standard entry point for all web, API, and email traffic.

## Decision

Adopt the centralized NGINX edge gateway by:

- Packaging the gateway as a Docker image with modular configuration under `tools/nginx/proxy-edge/`, leveraging environment-driven routing templates and reusable security snippets.
- Enforcing TLS termination, host-based routing, caching, compression, and rate limiting within the gateway so upstream services inherit consistent protections.
- Exposing health endpoints, structured JSON logging, and metrics hooks that integrate with existing observability pipelines.
- Providing Nx targets (`edge-gateway:build|serve|test`) and documentation so engineers can deploy, validate, and extend the gateway without duplicating boilerplate.

## Consequences

### Positive

- POS-001 — Centralizes security controls (headers, TLS policies, rate limits), reducing compliance drift across services.
- POS-002 — Improves performance through built-in caching and compression, lowering response times for cached assets.
- POS-003 — Simplifies onboarding for new services via documented overlays and Nx automation, accelerating delivery.

### Negative

- NEG-001 — Introduces a critical shared component whose failures can impact multiple services, demanding strong observability and runbooks.
- NEG-002 — Requires continuous maintenance of gateway templates, including TLS cipher updates and routing rules.
- NEG-003 — Adds operational complexity around environment variable management and secrets mounting for the gateway container.

## Alternatives

- ALT-001 — Maintain service-specific ingress configurations. Rejected because it perpetuates inconsistent security posture and duplicated effort.
- ALT-002 — Adopt a managed CDN or cloud gateway. Rejected since many deployments are self-hosted or air-gapped and require first-party control.
- ALT-003 — Delay gateway standardization until a Kubernetes ingress migration. Rejected because current workloads already need immediate consolidation within Docker Compose environments.

## Implementation Notes

- IMP-001 — Store modular configs (routing, caching, headers) in `tools/nginx/proxy-edge/` and render templates via entrypoint scripts that consume environment variables.
- IMP-002 — Configure caching (`proxy_cache_path`), compression (gzip/brotli), and rate limiting defaults, aligning with performance targets (<50 ms overhead for cached assets).
- IMP-003 — Ensure container runs as non-root, mounts certificates read-only, and validates configuration with `nginx -t` during Nx `test` tasks.
- IMP-004 — Publish observability outputs (structured logs, health endpoints) and integrate with monitoring dashboards referenced in edge documentation.

## References

- REF-001 — docs/tools/nginx/epics/edge-traffic-platform/epic.md
- REF-002 — docs/tools/nginx/epics/edge-traffic-platform/arch.md
- REF-003 — docs/tools/nginx/epics/edge-traffic-platform/features/centralized-edge-gateway/prd.md
- REF-004 — docs/tools/nginx/epics/edge-traffic-platform/features/centralized-edge-gateway/implementation-plan.md
- REF-005 — docs/tools/nginx/epics/automated-tls-management/features/tls-compose-overlay/prd.md
