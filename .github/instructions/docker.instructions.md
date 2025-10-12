---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
description: 'Modular index for Docker and containerization guidance. Modules target Dockerfiles, Compose files, and runtime operations.'
---

docs/
test/
tests/
spec/
__tests__/
# Containerization & Docker Best Practices (Index)

This index routes to Docker guidance stored under `.github/instructions/docker/`. Load the module that matches the file or task you are working on.

- `docker-core-principles.instructions.md` — Summarizes immutability, portability, isolation, and efficiency for container images.
- `docker-dockerfile-techniques.instructions.md` — Breaks down multi-stage builds, layer management, copy patterns, and entrypoint usage.
- `docker-security-practices.instructions.md` — Focuses on least privilege, hardened base images, scanning, and supply-chain controls.
- `docker-runtime-operations.instructions.md` — Covers resource policies, health checks, observability, storage, and network setup.
- `docker-review-checklists.instructions.md` — Provides quick review questions before merging Dockerfile or Compose changes.
- `docker-troubleshooting.instructions.md` — Offers diagnostic steps for build failures, runtime crashes, and networking issues.

## Maintaining the Modules

- Keep scope-specific `applyTo` patterns consistent so modules trigger only for Docker- and Compose-related files.
- Add new modules for topics like image promotion workflows or registry hardening as needs grow—update this index each time.
- Match the concise, task-first tone used across instruction families to keep guidance easy to scan during reviews.
