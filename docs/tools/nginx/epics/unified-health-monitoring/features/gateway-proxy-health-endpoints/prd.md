# Feature PRD — Gateway Proxy Health Endpoints

## 1. Feature Name

Gateway Proxy Health Endpoints

## 2. Epic

- [Unified Health Monitoring for NGINX Edge Services — Epic PRD](../../epic.md)
- [Unified Health Monitoring — Architecture](../../arch.md)

## 3. Goal

- **Problem:** Health checks for internal load balancers are not accessible externally, forcing operators to enter containers for diagnostics and delaying incident response.
- **Solution:** Expose proxied health endpoints (`/health/lb-*`) through the edge gateway that forward to internal load balancers while preserving network isolation.
- **Impact:** Operators gain a single, secure entry point for validating edge components, reducing downtime and streamlining monitoring integrations.

## 4. User Personas

- Site Reliability Engineer — Uses the endpoints for continuous monitoring and incident response.
- Platform Engineer — Configures the proxy routes and ensures security controls remain intact.
- QA/Release Engineer — Leverages the endpoints during pipeline verification before deployments.

## 5. User Stories

- As an SRE, I want gateway-exposed proxy endpoints so that I can check each load balancer’s health without inspecting containers directly.
- As a platform engineer, I want timeouts and 503 responses when upstreams fail so that automation can detect issues deterministically.
- As a release engineer, I want consistent endpoint paths so that CI pipelines can validate readiness across environments.

## 6. Requirements

- **Functional Requirements:**
  - Configure gateway locations `/health/lb-frontend`, `/health/lb-api`, `/health/lb-email` that proxy to internal load balancer endpoints.
  - Implement timeout and retry logic, returning HTTP 503 with descriptive messages on failure.
  - Ensure endpoints are protected by existing access controls and do not expose internal ports directly.
  - Log health requests and responses with correlation IDs for observability.
- **Non-Functional Requirements:**
  - Response times must stay under two seconds for healthy upstreams.
  - Configuration must pass `nginx -t` validation and integrate with automated tests.
  - Proxy rules must be extensible for future services with minimal changes.
  - Documentation must describe usage, sample responses, and security considerations.

## 7. Acceptance Criteria

- [ ] Hitting `/health/lb-frontend`, `/health/lb-api`, and `/health/lb-email` through the gateway returns 200 for healthy services and 503 with context on failure.
- [ ] Logs capture request timestamps, upstream status, and correlation IDs for each proxied health check.
- [ ] Security review confirms no internal ports are exposed and rate limiting applies to health endpoints.
- [ ] Documentation explains endpoint behavior and provides example curl commands for operators and CI.

## 8. Out of Scope

- Application-level deep health checks (database or business metrics).
- Integration with external monitoring systems (handled by separate initiatives).
- Automated alerting based on endpoint responses (documented as future work).
