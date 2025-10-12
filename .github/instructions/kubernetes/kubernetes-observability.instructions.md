---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Observability

## Logging

-   Emit application logs to STDOUT/STDERR and aggregate with Fluentd, Loki, or similar to support centralized search and alerting.
-   Ensure container log rotation to avoid node disk exhaustion; monitor for multiline log parsing needs.

## Metrics & Tracing

-   Expose Prometheus-format metrics; label resources consistently for dashboards and SLO tracking.
-   Instrument distributed systems with OpenTelemetry or Jaeger to trace cross-service latency and failure points.
