# Epic Architecture Specification — Unified Health Monitoring

## 1. Epic Architecture Overview

The unified health monitoring epic layers proxied health endpoints, orchestration scripts, and Nx automation onto the edge platform so operators can evaluate every load balancer through the gateway. Sequential health tasks, Docker health probes, and detailed documentation give fast feedback on routing readiness without exposing internal ports. The design preserves network isolation, standardizes responses for CI/CD integration, and creates a foundation for future observability integrations.

## 2. System Architecture Diagram

```mermaid
graph TD
  subgraph "User Layer"
    SRE["Site Reliability Engineer"]
    ReleaseEng["Release Engineer"]
    MonitoringTool["CI/CD & Monitoring Jobs"]
  end

  subgraph "Application Layer"
    Gateway["Edge Gateway (NGINX)"]
    NxHealthTask["Nx Health-Check Task"]
    HealthScript["Gateway Health Script"]
  end

  subgraph "Service Layer"
    FrontendLB["Frontend Load Balancer"]
    ApiLB["API Load Balancer"]
    EmailLB["Email Load Balancer"]
    BetterAuth["better-auth Identity Provider"]
    HealthAggregator["Health Proxy Locations"]
  end

  subgraph "Data Layer"
    HealthLogs[("Health Check Logs")]
    MetricsStream[("Health Metrics Stream")]
    IncidentTimeline[("Incident Timeline / Audit Trail")]
  end

  subgraph "Infrastructure Layer"
    DockerHost["Docker Engine"]
    ComposeStack["Docker Compose Stack"]
    HealthCheckers["Docker HEALTHCHECK Probes"]
    Networks["Internal Overlay Networks"]
  end

  SRE -->|Run nx health-check| NxHealthTask
  ReleaseEng -->|Pipeline Step| MonitoringTool
  MonitoringTool -->|Invoke| NxHealthTask
  NxHealthTask -->|Executes| HealthScript
  HealthScript -->|HTTP Calls| Gateway
  Gateway -->|Proxy /health/lb-frontend| FrontendLB
  Gateway -->|Proxy /health/lb-api| ApiLB
  Gateway -->|Proxy /health/lb-email| EmailLB
  Gateway -->|Auth Callback| BetterAuth
  FrontendLB -->|Emit Status| HealthAggregator
  ApiLB -->|Emit Status| HealthAggregator
  EmailLB -->|Emit Status| HealthAggregator
  HealthAggregator -->|Return JSON/Text| HealthScript
  HealthScript -->|Structured Output| HealthLogs
  HealthScript -->|Publish Signals| MetricsStream
  NxHealthTask -->|Results| IncidentTimeline
  ComposeStack --> Gateway
  ComposeStack --> FrontendLB
  ComposeStack --> ApiLB
  ComposeStack --> EmailLB
  ComposeStack --> HealthCheckers
  DockerHost --> Networks
  HealthCheckers -->|Periodic Pings| Gateway
  HealthCheckers -->|Periodic Pings| FrontendLB
  HealthCheckers -->|Periodic Pings| ApiLB
  HealthCheckers -->|Periodic Pings| EmailLB
```

## 3. High-Level Features & Technical Enablers

### Features

- Gateway-exposed proxy endpoints (`/health/lb-*`) that surface internal load balancer health through a single ingress point.
- Nx-driven health check task producing sequential, human-readable reports for all edge components.
- Docker HEALTHCHECK integration leveraging the shared shell script for container-level probing.
- Comprehensive documentation set (integration guide, quick reference, before/after analysis, diagrams) to support operators and CI users.
- Extensible architecture for future JSON payloads, alerting hooks, and external monitoring adapters.

### Technical Enablers

- Health aggregator locations configured in NGINX with timeout handling and 503 responses for unhealthy upstreams.
- Shell-based health script supporting text and JSON modes, reusable by Nx tasks and Docker probes.
- Nx automation updates coordinating Compose lifecycle, health validation, and telemetry outputs.
- Structured logging and metrics stream capturing health transitions for audits and dashboards.
- Internal overlay networks maintaining isolation while still enabling the gateway to reach load balancers.

## 4. Technology Stack

- **Edge Components:** NGINX gateway and load balancers running in Docker containers with shared configuration snippets.
- **Automation:** Nx task runner, shell scripts for health aggregation, Docker HEALTHCHECK directives.
- **Security & Identity:** better-auth for any authentication callbacks exercised through the gateway.
- **Observability:** Structured logs, metrics signals, incident timeline artifacts suitable for ingestion by monitoring systems.
- **Infrastructure:** Docker Compose orchestration, internal networks, OCI registry for image distribution.

## 5. Technical Value

**Medium** — The epic significantly improves operational visibility with minimal infrastructure changes, unlocking faster incident response while laying groundwork for advanced monitoring without overhauling core routing behavior.

## 6. T-Shirt Size Estimate

**S (Small)** — The work focuses on NGINX configuration, scripting, and automation updates within the existing edge stack, keeping scope contained and predictable.
