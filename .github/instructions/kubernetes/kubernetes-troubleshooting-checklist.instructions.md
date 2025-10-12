---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Troubleshooting Checklist

## Pods & Services

-   Inspect Pod events (`kubectl describe`) for scheduling, image, or probe failures; review container logs for crash loops.
-   Verify Service selectors match Pod labels and confirm Endpoints objects exist before debugging networking layers.

## Cluster Health

-   Monitor node resource pressure (CPU, memory, disk, PID) and evictions; ensure cluster autoscaler or node pools can scale.
-   Capture baseline metrics and alerts for API server latency, etcd health, and controller-manager status to shorten MTTR.
