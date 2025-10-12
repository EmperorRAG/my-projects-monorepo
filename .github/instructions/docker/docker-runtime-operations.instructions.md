---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Docker Runtime Operations

## Resources & Health
- Define CPU and memory reservations/limits in Compose or orchestrators to prevent noisy neighbors.
- Add `HEALTHCHECK` instructions or orchestrator probes so unhealthy containers restart quickly.

## Observability
- Emit structured logs to STDOUT/STDERR and ship them via a collector (Fluentd, Loki); avoid writing inside the container filesystem.
- Expose Prometheus metrics or similar, and label containers consistently for dashboards and alerts.

## Storage & Networking
- Use named or managed volumes for persistent data; never rely on the container writable layer for state.
- Segment services with dedicated networks or namespaces, and lock down ingress with firewalls or network policies.
