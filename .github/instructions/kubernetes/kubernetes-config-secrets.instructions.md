---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Configuration & Secrets

## ConfigMaps

-   Store non-sensitive configuration as key/value pairs and mount them as files or environment variables.
-   Avoid placing credentials in ConfigMaps; they are stored in plain text within etcd.

## Secrets

-   Keep credentials and certificates in Secrets and prefer external secret managers for production workloads.
-   Mount Secrets as volumes or environment variables only when necessary and rotate values regularly.

## Validation

-   Validate configuration at startup so failed pods surface misconfiguration quickly.
