---
applyTo: '*'
---

# Kubernetes Deployment Strategies

## Rolling Updates
- Use Deployment rolling updates with tuned `maxSurge` and `maxUnavailable` to balance availability and rollout pace.
- Gate production rollouts behind readiness probes and `progressDeadlineSeconds` so failed updates can auto-roll back.

## Advanced Releases
- Adopt blue/green or canary flows via service labels, Ingress splits, or service meshes when releases need traffic control.
- Combine with feature flags and automated smoke tests to detect regressions early.
