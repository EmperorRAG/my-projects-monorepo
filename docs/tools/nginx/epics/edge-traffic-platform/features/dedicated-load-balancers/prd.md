# Feature PRD — Dedicated Load Balancers

## 1. Feature Name

Dedicated Load Balancers

## 2. Epic

- [NGINX Edge Traffic Platform — Epic PRD](../../epic.md)
- [NGINX Edge Traffic Platform — Architecture](../../arch.md)

## 3. Goal

- **Problem:** Without workload-specific load balancers, frontend, API, and email traffic share configuration, compromising performance tuning and incident isolation.
- **Solution:** Provide dedicated NGINX load balancer containers for each workload, each tailored with appropriate caching, rate limiting, upstream configuration, and observability.
- **Impact:** Services gain predictable performance, improved resilience, and the ability to scale independently while keeping configuration manageable.

## 4. User Personas

- Platform Engineer — Builds and maintains per-workload load balancer configurations.
- Site Reliability Engineer — Monitors load balancer health and tunes rate limits or caching policies.
- Application Engineer — Integrates their service with the appropriate load balancer using documented overlays.

## 5. User Stories

- As a platform engineer, I want dedicated load balancer images so that each workload can scale and be tuned without impacting others.
- As an SRE, I want per-load balancer logging and health checks so that I can diagnose issues quickly.
- As an application engineer, I want environment overlays that point to my service so that I can test changes locally and in staging.

## 6. Requirements

- **Functional Requirements:**
  - Package separate NGINX configurations and Dockerfiles for frontend, API, and email load balancers.
  - Provide environment-specific overlays (development, production) that set upstream hosts, rate limits, and caching policies.
  - Configure health checks and status endpoints for each load balancer, surfaced through the edge gateway.
  - Integrate Nx targets to build, run, and validate each load balancer container.
- **Non-Functional Requirements:**
  - Load balancers must support zero-downtime reloads and maintain 99.9% availability targets.
  - Configurations must pass `nginx -t` and include automated tests covering overlays.
  - Logging must be structured and labeled per workload to support centralized analysis.
  - Containers must run as non-root and mount secrets securely.

## 7. Acceptance Criteria

- [ ] Each load balancer builds successfully via Nx targets and serves traffic for its workload in local and staging environments.
- [ ] Overlays configure upstream addresses, rate limits, and caching policies appropriate to each workload.
- [ ] Health endpoints report status and are accessible through the edge gateway for monitoring.
- [ ] Observability outputs include workload identifiers and integrate with existing log aggregation.

## 8. Out of Scope

- Dynamic service discovery or auto-scaling (future enhancements).
- Protocol-specific optimizations beyond documented defaults (for example, SMTP-specific TLS).
- Traffic shaping or global routing policies beyond per-load balancer configuration.
