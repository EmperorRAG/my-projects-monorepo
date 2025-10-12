---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Core Concepts

## Pods

-   Treat pods as the smallest deployable unit and keep only tightly coupled containers together.
-   Define CPU and memory requests and limits so schedulers place pods reliably and prevent noisy neighbors.
-   Add liveness and readiness probes to detect crashed or unready containers early.

## Deployments

-   Use Deployments for stateless workloads and configure desired replica counts.
-   Set selectors and template labels consistently so rolling updates target the right pods.
-   Tweak rolling update parameters (max surge/unavailable) when you need faster or safer rollouts.

## Services & Ingress

-   Choose the correct Service type (ClusterIP for internal, LoadBalancer for public, NodePort for quick testing).
-   Ensure selectors match pod labels so traffic routes correctly.
-   Use Ingress resources to manage external HTTP routing and TLS termination centrally.
