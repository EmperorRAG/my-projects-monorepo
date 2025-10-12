---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Containerization Core Principles

## Immutability
- Tag every build and treat images as read-only artifacts; rebuild instead of patching running containers.
- Pin dependency versions and keep CI builds deterministic so rollbacks always rehydrate a known-good image.

## Portability & Isolation
- Externalize configuration through env vars or mounted files so the same image runs in dev, staging, and prod.
- Limit each container to a primary process and rely on orchestrator networking to connect services cleanly.

## Efficiency
- Favor multi-stage builds and minimal base images to shrink layers, reduce attack surface, and speed pulls.
- Regularly review image history for unused tools or caches that can be removed.
