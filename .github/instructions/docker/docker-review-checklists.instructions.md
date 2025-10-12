---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Docker Review Checklist

## Build Hygiene
- Multi-stage build used where it reduces size? Layers ordered and cleaned to remove caches and package lists?
- `.dockerignore` present and covering VCS data, build artifacts, and local environment files?

## Security
- Image runs as non-root with minimal capabilities and read-only filesystem where feasible?
- Static analysis and vulnerability scans configured to block high-severity findings before release?

## Runtime Readiness
- Health checks defined and default commands documented via `EXPOSE` plus `CMD`/`ENTRYPOINT`?
- Resource limits, volumes, and network definitions declared for orchestrated deployments?
