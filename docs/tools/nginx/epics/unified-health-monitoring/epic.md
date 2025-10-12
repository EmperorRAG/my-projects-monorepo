# Epic Name

Unified Health Monitoring for NGINX Edge Services

## Goal

### Problem

Health verification for the NGINX load balancers was fragmented and inaccessible from outside the Docker network. Platform engineers could only confirm the edge gateway’s `/health` endpoint, leaving blind spots for the frontend, API, and email load balancers. Operational scripts failed because ports were not exposed, and diagnosing outages required manual container inspection, slowing response times and increasing the risk of unnoticed downtime.

### Solution

Create a unified health monitoring capability that aggregates load balancer status through the edge gateway. Introduce proxied health endpoints, sequential Nx health-check tasks, and container-level scripts so teams can evaluate the entire edge stack using a single command. Provide diagrams, quick references, and runbooks that explain architecture, usage, and troubleshooting steps.

### Impact

The epic delivers full visibility into edge service health, ensures monitoring tools and CI pipelines can validate infrastructure readiness, and shortens incident triage. By consolidating health checks, teams avoid exposing internal ports, maintain network isolation, and gain confidence that the entire routing layer is functioning before releasing updates.

## User Personas

- **Site Reliability Engineer (Primary)** – Uses the aggregated health checks to monitor availability and respond quickly to issues.
- **Platform Engineer (Secondary)** – Maintains scripts, proxies, and Nx tasks to keep health monitoring reliable and extensible.
- **QA/Release Engineer (Stakeholder)** – Integrates health checks into delivery pipelines to gate deployments.

## High-Level User Journeys

1. **Run Comprehensive Health Check** – An SRE executes `nx run nginx:health-check` and receives a structured report covering the gateway and each load balancer.
2. **CI/CD Verification** – A release pipeline spins up the edge stack, runs the health task to verify readiness, and blocks promotion if any component fails.
3. **Manual Diagnosis** – During an incident, a platform engineer curls individual `/health/lb-*` endpoints via the gateway, identifies the failing upstream, and follows the runbook to mitigate.

## Business Requirements

### Functional Requirements

- Expose gateway endpoints that proxy to each load balancer’s internal `/health` route while maintaining network isolation.
- Implement error handling and timeouts so unhealthy services return deterministic HTTP 503 responses and informative messages.
- Provide a container-level shell script capable of simple and detailed output modes for local or Docker HEALTHCHECK use.
- Update Nx `health-check` targets to sequentially call all endpoints with human-readable output and non-zero exit codes on failure.
- Supply architecture diagrams, before/after documentation, quick references, and examples demonstrating usage across dev and CI.
- Ensure Docker HEALTHCHECK directives use the enhanced script to detect issues automatically.

### Non-Functional Requirements

- **Reliability** – Health checks must complete within two seconds per component and fail fast when upstreams are unreachable.
- **Security** – Continue to expose only the gateway ports (80/443), keeping load balancers on internal networks.
- **Observability** – Provide consistent logging and respond with plain text or JSON that monitoring systems can parse.
- **Usability** – Offer clear instructions and examples for developers and pipeline engineers who are not NGINX experts.

## Success Metrics

- **Coverage** – 100% of edge components (gateway + load balancers) checked by a single command and Docker health probes.
- **Detection Time** – Ability to detect a failing load balancer within one minute via automated health checks.
- **Adoption** – Health check task referenced in core runbooks and integrated into CI pipelines for release gating.
- **Incident Reduction** – Reduction in customer-facing incidents caused by unknown load balancer failures during monitoring period.

## Out of Scope

- Application-level deep health checks (database connectivity, business metrics) beyond the load balancer layer.
- External monitoring system integrations (Prometheus, Grafana) beyond documenting future enhancements.
- Historical health trend storage or alerting workflows (captured as future roadmap items).

## Business Value

**Medium-High** – The epic materially improves operational confidence and reduces downtime by making edge health observable and actionable. While it does not directly generate revenue, it protects SLA commitments, accelerates incident response, and builds the foundation for more advanced monitoring investments.
