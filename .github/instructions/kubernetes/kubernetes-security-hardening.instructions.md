---
applyTo: '**/kubernetes/**/*.yaml,**/kubernetes/**/*.yml,**/*k8s*.yaml,**/*k8s*.yml,**/*kube*.yaml,**/*kube*.yml'
---

# Kubernetes Security Hardening

## Pod Security

-   Run containers as non-root with explicit `runAsUser` and `runAsGroup`; set `allowPrivilegeEscalation: false` and drop unnecessary Linux capabilities.
-   Prefer read-only root filesystems and mount Secrets as `tmpfs` volumes to reduce exposure.

## Network Controls

-   Default to deny-all NetworkPolicies, then permit required namespace-to-namespace and pod-to-pod traffic.
-   Restrict egress where possible; audit for wildcard destinations.

## Access & Secrets

-   Use dedicated ServiceAccounts with least-privilege Roles/ClusterRoles; rotate tokens and disable automounting when unused.
-   Integrate with external secret managers or enable envelope encryption for etcd-stored Secrets.
