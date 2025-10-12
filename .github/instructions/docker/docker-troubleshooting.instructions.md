---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Docker Troubleshooting

## Build Issues
- Inspect layer history with `docker history` to find large or redundant layers; rerun with `--no-cache` when diagnosing stale steps.
- Confirm the build context excludes local artifacts and secrets; large contexts slow transfers and may leak data.

## Runtime Failures
- Check container logs first; if the main process exits immediately, verify `CMD`/`ENTRYPOINT` and file permissions for the runtime user.
- Use `docker inspect` to review mounts, environment variables, and restart policies when behavior differs from expectations.

## Networking & Performance
- Validate published ports with `docker port` and ensure host firewalls allow traffic; for inter-container comms use bridge networks or Compose services.
- Watch resource usage via `docker stats`; unexpected spikes often point to missing limits or memory leaks inside the app.
