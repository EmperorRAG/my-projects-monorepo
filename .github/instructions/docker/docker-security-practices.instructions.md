---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
---

# Docker Security Practices

## Least Privilege
- Create dedicated users in the image, drop Linux capabilities you do not need, and enable `no-new-privileges` when launching.
- Mount root filesystems read-only where possible and write to named volumes for mutable paths.

## Hardened Images
- Base builds on slim, frequently patched images; avoid the `latest` tag so CVEs can be tracked per version.
- Scan Dockerfiles with Hadolint and built images with Trivy or Snyk as part of CI, failing on critical findings.

## Supply Chain Controls
- Sign production images (Cosign, Notary) and enforce verification before deployment.
- Keep secrets out of layers; source sensitive config at runtime from secret stores or orchestrator-managed mounts.
