---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Health Probes

## Liveness

-   Use HTTP, TCP, or command probes to confirm containers are still responding; failed checks trigger restarts.
-   Configure sensible delays and thresholds so pods have time to start before probes fire.

## Readiness

-   Readiness probes signal when a pod can serve traffic; failing probes remove pods from Service endpoints.
-   Use readiness checks during deployments to avoid sending traffic to instances still warming up.
