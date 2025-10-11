# Integrating NGINX into an Nx Monorepo

NGINX is commonly used to front applications hosted inside an Nx workspace for TLS termination, caching, static asset delivery, and reverse-proxy routing. This guide explains how to incorporate NGINX into an Nx monorepo, how to serve files from the repository, how to operate one NGINX edge reverse proxy in front of three NGINX load-balancer tiers, and where to keep configuration as the workspace grows.

## Target Topology

The reference design introduces an internet-facing reverse proxy that terminates TLS and proxies traffic to three independent NGINX load balancers. Each load balancer distributes requests to the relevant application or service pool.

```text
┌──────────────┐     ┌──────────────┐
│  Clients /   │ TLS │  Reverse     │
│  Internet    ├────▶│  Proxy NGINX │
└──────────────┘     └──────┬───────┘
             │
         ┌───────────┴───────────┐
         │           │           │
    ┌────────▼──────┐ ┌──▼─────────┐ ┌────────▼──────┐
  │ LB NGINX #1   │ │ LB NGINX #2│ │ LB NGINX #3   │
  │ (e.g. Frontend│ │ (e.g. API) │ │ (e.g. Email)  │
  └───────┬───────┘ └────┬───────┘ └───────┬───────┘
    │              │                 │
  ┌───────▼───────┐ ┌────▼───────┐ ┌───────▼───────┐
  │ App Pool A    │ │ App Pool B │ │ Service Pool C│
  └───────────────┘ └────────────┘ └───────────────┘
```

Each load balancer can scale horizontally using the same container and configuration pattern. The reverse proxy shields the load-balancer tier from the public network and centralises TLS certificates, rate limiting, and common headers.

## Prerequisites

- Nx CLI installed locally (`npm i -g nx` or via `npx`).
- Docker Desktop or another container runtime if you plan to package NGINX as an image.
- Basic knowledge of Nx project configuration (`project.json`) and dependency graph conventions (`apps/`, `libs/`, `tools/`).

## Recommended Repository Layout

As the monorepo scales, keep NGINX assets under an `infrastructure/` or `tools/` directory separate from application code so they can evolve independently. The layout below dedicates subfolders for the edge proxy and the three load balancers while sharing common snippets and Docker assets.

```text
my-projects-monorepo/
├─ apps/
├─ libs/
├─ tools/
│  └─ nginx/
│     ├─ common/
│     │  ├─ base.nginx.conf        # shared defaults (workers, gzip, security headers)
│     │  └─ snippets/
│     │     ├─ headers.conf        # security headers reused by all nodes
│     │     └─ logging.conf
│     ├─ proxy-edge/
│     │  ├─ nginx.conf             # references common includes + upstream LBs
│     │  ├─ overlays/
│     │  │  ├─ development.conf
│     │  │  └─ production.conf
│     │  └─ Dockerfile
│     ├─ load-balancers/
│     │  ├─ lb-frontend/
│     │  │  ├─ nginx.conf          # upstream pointing to frontend pods
│     │  │  ├─ overlays/
│     │  │  │  ├─ development.conf
│     │  │  │  └─ production.conf
│     │  │  └─ Dockerfile
│     │  ├─ lb-api/
│     │  │  └─ ...
│     │  └─ lb-email/
│     │     └─ ...
│     ├─ docker-compose.yaml
│     └─ README.md
├─ nx.json
└─ README.md
```

### Storing Configuration as You Scale

1. **Base and overlay pattern:** Keep a `common/base.nginx.conf` with global settings, then layer environment-specific snippets in `overlays/<env>/`. Use `include` directives inside overlay files to compose from the base while avoiding duplication across the four NGINX nodes.
2. **Node-specific configs:** Create one config per load balancer (`lb-frontend`, `lb-api`, `lb-email`) and one per proxy (`proxy-edge`). Each config defines the upstream pools it owns and includes only the snippets it needs.
3. **Generated outputs:** If tooling generates config (Helm, Kustomize, Pulumi), store templates under the same `tools/nginx/` tree and write Nx targets to render them into `dist/tools/nginx/`. Templates can share variables for upstream lists so that adding a backend only updates a single values file.
4. **Documentation:** Add a README inside `tools/nginx/` describing node responsibilities, ports, and how configs map to Nx projects. Cross-link from the main project documentation so new contributors find it quickly.
5. **Secrets and certificates:** Store TLS certificates or secret references per node (typically under `proxy-edge/overlays/production.conf`) and retrieve them via environment variables, secret stores, or mounted volumes rather than committing them to the repo.

## Serving Monorepo Assets Through NGINX

### Static assets (Next.js or other frontend bundles)

1. Build the frontend using Nx: `npx nx build my-programs-app` (outputs under `dist/apps/my-programs-app`).
2. Configure NGINX to serve the built files directly:

   ```nginx
   server {
     listen 80;
     server_name _;

     root /usr/share/nginx/html;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. In your Docker image or Compose file, copy the build output into the NGINX image:

  ```dockerfile
  FROM nginx:1.27-alpine
  COPY tools/nginx/common/base.nginx.conf /etc/nginx/nginx.conf
  COPY dist/apps/my-programs-app /usr/share/nginx/html
  ```

### Reverse proxy routing to load balancers

The edge proxy forwards requests to the correct load-balancer service based on hostname or path. Use resilient upstream zones so that health checks and shared state work across workers.

```nginx
map $host $lb_upstream {
  default lb_frontend;
  api.internal lb_api;
  email.internal lb_email;
}

upstream lb_frontend {
  zone lb_frontend 64k;
  server lb-frontend:8080;
}

upstream lb_api {
  zone lb_api 64k;
  server lb-api:8080;
}

upstream lb_email {
  zone lb_email 64k;
  server lb-email:8080;
}

server {
  listen 80;
  server_name _;

  include /etc/nginx/snippets/headers.conf;

  location / {
    proxy_pass http://$lb_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Each load balancer receives traffic on its internal port (`8080` in the example) and routes to its service pool.

### Load balancing backend services (e.g., NestJS email microservice)

1. Expose the NestJS app on a known port (default `3000`).
2. Define the upstream pool and load-balancing strategy (e.g., `least_conn`) within the load balancer configuration (`lb-email/nginx.conf`).

   ```nginx
   upstream email_service {
     zone email_service 64k;
     least_conn;
     server email-microservice-1:3000;
     server email-microservice-2:3000;
   }

   server {
     listen 8080;
     server_name lb-email;

     include /etc/nginx/snippets/headers.conf;

     location /email/ {
       proxy_pass http://email_service/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

3. When using Docker Compose, declare the edge proxy, all three load balancers, and dependent services in the same network so hostnames resolve.

## Managing NGINX with Nx Targets

Use `nx run-commands` to standardise NGINX workflows. Each node can have its own targets, and composite targets orchestrate the full topology.

```json
{
  "targets": {
    "nginx:generate-config": {
      "executor": "nx:run-commands",
      "options": {
        "command": "ts-node tools/nginx/scripts/render-config.ts",
        "cwd": "tools/nginx"
      }
    },
    "nginx:docker-build-edge": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-edge -f tools/nginx/proxy-edge/Dockerfile ."
      },
      "dependsOn": ["nginx:generate-config"]
    },
    "nginx:docker-build-lb-frontend": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-lb-frontend -f tools/nginx/load-balancers/lb-frontend/Dockerfile ."
      },
      "dependsOn": ["nginx:generate-config"]
    },
    "nginx:docker-build-lb-api": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-lb-api -f tools/nginx/load-balancers/lb-api/Dockerfile ."
      },
      "dependsOn": ["nginx:generate-config"]
    },
    "nginx:docker-build-lb-email": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-lb-email -f tools/nginx/load-balancers/lb-email/Dockerfile ."
      },
      "dependsOn": ["nginx:generate-config"]
    },
    "nginx:serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker compose -f tools/nginx/docker-compose.yaml up"
      },
      "dependsOn": [
        "nginx:generate-config",
        "nginx:docker-build-edge",
        "nginx:docker-build-lb-frontend",
        "nginx:docker-build-lb-api",
        "nginx:docker-build-lb-email"
      ]
    }
  }
}
```

These targets let you chain NGINX setup into CI (`nx run nginx:docker-build-edge`, `nx run nginx:docker-build-lb-api`, etc.) or run everything locally alongside other services (`nx run nginx:serve`).

## Configuration Patterns at Scale

- **Environment segregation:** Mirror the structure of your Nx environment files (`apps/*/project.json` environments, `.env.{env}`) with matching NGINX overlays to keep deployment logic predictable.
- **Testing:** Add Playwright or smoke tests that exercise endpoints via NGINX to catch misconfiguration early (`nx run my-programs-app-e2e` after `nx run nginx:serve`).
- **Automation:** Use Nx affected commands to rebuild NGINX edge and load balancers when relevant configs change:

  ```bash
  npx nx affected --target=nginx:docker-build-edge --files tools/nginx/proxy-edge/**/*
  npx nx affected --target=nginx:docker-build-lb-api --files tools/nginx/load-balancers/lb-api/**/*
  ```

- **Version control:** Treat NGINX configs the same as application code—peer review them, run linting (`nginx -t`) in CI, and store secrets outside the repo (use environment variables or secrets managers referenced in the configs).

## Implementation and Operations Plan

### 1. Implement the NGINX Servers in the Nx Monorepo

- Inventory target applications and assign them to load balancer nodes (frontend, API, email).
- Scaffold the `tools/nginx/` directory structure and add base, snippets, and per-node configuration files.
- Create Nx `project.json` entries or extend the root configuration with the targets shown above.
- Write configuration rendering scripts (if needed) that compile overlays into `dist/tools/nginx/*`.
- Add lint tasks (`nginx -t`) and unit tests for configuration templates where practical (e.g., using `bats` or `pytest` to validate rendered files).

### 2. Dockerize the NGINX Servers

- Author dedicated Dockerfiles for the edge proxy and each load balancer, inheriting from the official `nginx:alpine` image.
- Copy the rendered configuration into `/etc/nginx/` and mount environment-specific secrets using Docker build args or runtime volumes.
- Configure health-check endpoints (`HEALTHCHECK` directives) to monitor readiness of each container.
- Extend `docker-compose.yaml` (or equivalent) to model the four containers, attach them to shared networks, and mount TLS certificates for the edge proxy.

### 3. Deploy the NGINX Servers

#### Docker Compose Path (starting point)

- Author `tools/nginx/docker-compose.yaml` with services for the edge proxy and three load balancers, mounting rendered config directories and any TLS secrets.
- Reference shared networks so backends (`my-programs-app`, `my-nest-js-email-microservice`) are reachable via container names. Example excerpt:

  ```yaml
  services:
    proxy-edge:
      image: my-org/nginx-edge:latest
      depends_on:
        - lb-frontend
        - lb-api
        - lb-email
      ports:
        - "80:80"
        - "443:443"
      volumes:
        - ./dist/tools/nginx/proxy-edge:/etc/nginx
        - ./secrets/tls:/etc/nginx/tls:ro
      networks:
        - internal

    lb-frontend:
      image: my-org/nginx-lb-frontend:latest
      volumes:
        - ./dist/tools/nginx/load-balancers/lb-frontend:/etc/nginx
      networks:
        - internal

  networks:
    internal:
      driver: bridge
  ```

- Create `nx` targets to run `docker compose up -d` and `docker compose down` for local development, ensuring `dependsOn` includes the docker builds.
- Add Compose override files for local testing vs. CI (e.g., `docker-compose.ci.yaml` with headless mode). Use `.env` files for port overrides and secrets.
- When ready, deploy to staging/production Compose clusters (e.g., Docker Swarm, ECS with Compose) using the same rendered configs.

#### Kubernetes Path (future expansion)

- Generate Kubernetes manifests (e.g., under `tools/nginx/k8s/`) that define one Deployment and one Service per NGINX role. Use ConfigMaps for non-secret configuration and Secrets for TLS materials.
- Reference the same rendered configuration pipeline by having Nx scripts place files into `dist/tools/nginx/k8s/config/` for `kubectl apply` or Helm packaging.
- Example module layout:

  ```text
  tools/nginx/k8s/
  ├─ proxy-edge/
  │  ├─ deployment.yaml
  │  ├─ service.yaml
  │  └─ configmap.yaml
  ├─ lb-frontend/
  ├─ lb-api/
  └─ lb-email/
  ```

- Consider using Helm charts or Kustomize overlays to manage per-environment differences. Nx targets can call `helm upgrade --install` or `kubectl apply -k`.
- Integrate with cluster ingress controllers by setting the edge proxy as either a standalone Deployment behind a Service of type `LoadBalancer`, or by configuring existing ingress resources to route into the load-balancer Services.
- Implement readiness and liveness probes to ensure load balancers only receive traffic when backend pods are healthy. Capture logs with sidecar collectors or cluster logging solutions.
- As infrastructure matures, add CI jobs that render Kubernetes manifests, run `kubeval`/`kubectl diff`, and deploy via GitOps tools (Argo CD, Flux) or direct Nx-driven commands.

### 4. Manage the NGINX Servers

- Implement monitoring (e.g., Prometheus exporter or NGINX Plus metrics) and log shipping (Fluent Bit/Filebeat) for each container.
- Schedule periodic configuration reviews and automate `nx affected` checks to ensure changes rebuild the correct images.
- Establish alerting thresholds for upstream failures, high latency, or error spikes.
- Document operational runbooks detailing certificate rotation, configuration reloads (`docker compose exec <service> nginx -s reload`), and incident response steps.

## Further Reading

- [Nx Run Commands](https://nx.dev/reference/project-json#run-commands) for building custom targets.
- [NGINX Beginner’s Guide](https://nginx.org/en/docs/beginners_guide.html) for configuration fundamentals.
- [Docker Official NGINX Image](https://hub.docker.com/_/nginx) for image usage patterns.
- [Nx and Docker Integration](https://nx.dev/recipes/docker) for tips on orchestrating container builds from Nx.

With these patterns you can scale an Nx monorepo while keeping NGINX configuration organised, testable, and aligned with Nx’s task orchestration model.
