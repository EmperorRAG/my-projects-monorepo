---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
description: 'Modular index for Kubernetes deployment guidance. Each module covers a focused topic spanning core concepts, configuration, security, operations, and troubleshooting.'
---

# Kubernetes Deployment Best Practices (Index)

This index points to Kubernetes instruction modules stored under `.github/instructions/kubernetes/`. Each module narrows guidance to a dedicated topic so you can load only what a task requires.

-   `kubernetes-core-concepts.instructions.md` — Summarizes Pods, Deployments, Services, and Ingress fundamentals for day-to-day manifests.
-   `kubernetes-config-secrets.instructions.md` — Covers ConfigMaps, Secrets, and configuration layering strategies.
-   `kubernetes-health-probes.instructions.md` — Details liveness, readiness, and startup checks and their tuning knobs.
-   `kubernetes-resource-management.instructions.md` — Explains requests, limits, and autoscaling choices.
-   `kubernetes-security-hardening.instructions.md` — Highlights Pod security, network policies, RBAC, and secret handling.
-   `kubernetes-observability.instructions.md` — Outlines logging aggregation, metrics, tracing, and alerting baselines.
-   `kubernetes-deployment-strategies.instructions.md` — Describes rolling, blue/green, and canary rollouts plus rollback planning.
-   `kubernetes-troubleshooting-checklist.instructions.md` — Provides quick diagnostics for pod health, services, and cluster issues.

## Extending This Set

-   Keep future modules focused and scoped with `applyTo` globs; prefer additional files over expanding existing ones excessively.
-   Update this index whenever you add, rename, or remove a Kubernetes module so downstream agents discover the new guidance.
-   Mirror the concise, bullet-first writing style used here to stay consistent with other instruction families.
