# Feature PRD — Centralized Edge Gateway

## 1. Feature Name

Centralized Edge Gateway

## 2. Epic

- [NGINX Edge Traffic Platform — Epic PRD](../../epic.md)
- [NGINX Edge Traffic Platform — Architecture](../../arch.md)

## 3. Goal

- **Problem:** Traffic enters the platform through disparate endpoints with inconsistent TLS termination, security headers, and routing policies, creating operational risk and duplicative effort.
- **Solution:** Provide a hardened NGINX edge gateway that centralizes TLS termination, host-based routing, caching, compression, and security header enforcement.
- **Impact:** All inbound traffic benefits from consistent security controls, improved performance, and simplified operations, enabling faster onboarding of new services.

## 4. User Personas

- Platform Engineer — Configures and maintains the edge gateway infrastructure.
- Site Reliability Engineer — Monitors gateway performance and manages incident response.
- Application Engineer — Publishes services through the gateway without managing low-level NGINX configuration.

## 5. User Stories

- As a platform engineer, I want a reusable edge gateway container that terminates TLS and routes by host so that new services can be exposed with minimal configuration.
- As an SRE, I want built-in caching, compression, and rate limiting so that I can protect upstream services from traffic spikes.
- As an application engineer, I want a consistent entry point that automatically applies security headers so that my service meets compliance requirements.

## 6. Requirements

- **Functional Requirements:**
  - Provide an NGINX gateway configuration supporting host-based routing, TLS termination, caching, compression, and security headers.
  - Package the gateway as a Docker image with environment-driven configuration for domains, upstreams, and security settings.
  - Supply health endpoints (`/health`) accessible through the gateway and instrumentation for logging/metrics.
  - Document how to extend routing rules for new services using overlays or configuration fragments.
- **Non-Functional Requirements:**
  - Gateway must process requests with <50ms overhead for cached assets and support keepalive.
  - Configuration must pass `nginx -t` validation and include automated tests.
  - Gateway container runs as non-root and stores secrets outside source control.
  - Logging must include structured request and error logs for observability.

## 7. Acceptance Criteria

- [ ] Deploying the gateway container routes frontend, API, and email domains correctly with enforced TLS and security headers.
- [ ] Performance tests demonstrate caching/compression keep overhead under 50ms for cached assets.
- [ ] Observability outputs (logs, health endpoints) integrate with existing monitoring dashboards.
- [ ] Documentation covers configuration, extension, and troubleshooting steps for engineers.

## 8. Out of Scope

- CDN integration or global traffic management (addressed in future initiatives).
- Application-specific authentication flows beyond documented better-auth integration points.
- Kubernetes ingress or service mesh equivalents.
