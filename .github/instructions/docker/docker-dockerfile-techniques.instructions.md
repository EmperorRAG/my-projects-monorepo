---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Dockerfile Techniques

## Multi-Stage Builds
- Separate build, test, and runtime stages; copy only compiled artifacts into the final image.
- Name stages (`AS build`, `AS test`) to keep complex builds maintainable.

## Layer Optimization
- Order instructions from least to most volatile; install dependencies before copying source so caches persist.
- Chain package install and cleanup in a single `RUN` to avoid leftover package indexes and reduce layers.

## Copy Control & Context
- Maintain a strict `.dockerignore` to trim build context and exclude secrets, logs, and host artifacts.
- Copy manifest files (`package.json`, `requirements.txt`) ahead of source to maximize cache hits, and copy only required directories.

## Entrypoints
- Prefer exec-form `ENTRYPOINT`/`CMD` for signal handling; use `ENTRYPOINT` for the binary and `CMD` for defaults.
- Expose the listening port and switch to a non-root user before defining the command.
