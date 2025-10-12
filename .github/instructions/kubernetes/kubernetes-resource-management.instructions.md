---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Resource Management

## Requests & Limits

-   Set CPU and memory requests to guarantee scheduling and limits to cap consumption.
-   Understand Quality of Service classes: Guaranteed (requests=limits), Burstable (requests < limits), and BestEffort (none set).

## Autoscaling

-   Use Horizontal Pod Autoscaler for stateless workloads that see varying load; tune min/max replicas and target utilization.
-   Consider Vertical Pod Autoscaler to right-size resources over time, especially for batch or cron workloads.
