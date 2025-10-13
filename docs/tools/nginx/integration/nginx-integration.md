# NGINX MVP Integration Guide for Nx Monorepo

This guide explains how to set up a minimal viable NGINX infrastructure for an Nx monorepo with:
- 1 NGINX reverse proxy (edge proxy) for TLS termination and routing
- 2 NGINX load balancers (frontend app + email microservice)
- 3 instances per service for high availability
- TLS/HTTPS with Certbot (Let's Encrypt)
- Docker Compose deployment
- Nx monorepo integration

## MVP Topology

The MVP design uses one edge proxy terminating TLS and routing to two load balancers. Each load balancer distributes traffic across 3 instances of its service.

```text
┌──────────────┐     ┌──────────────────┐
│  Clients /   │ TLS │  NGINX Edge      │
│  Internet    ├────▶│  Reverse Proxy   │
└──────────────┘     └────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼──────────┐
            │ NGINX LB       │  │ NGINX LB        │
            │ (Frontend)     │  │ (Email Service) │
            └───────┬────────┘  └──────┬──────────┘
                    │                   │
          ┌─────────┼─────────┐  ┌──────┼──────────┐
          │         │         │  │      │          │
    ┌─────▼───┐┌────▼────┐┌───▼──▼┐┌───▼──┐┌──────▼──┐
    │ App #1  ││ App #2  ││ App #3││Email││ Email #2││Email #3│
    │(3000)   ││(3001)   ││(3002) ││#1   ││  (3001) ││ (3002) │
    └─────────┘└─────────┘└───────┘└─────┘└─────────┘└────────┘
```

**Key Features:**
- TLS termination at edge proxy
- Host-based routing to load balancers
- Load balancing across 3 service instances
- Health checks and failover

## Prerequisites

- **Nx CLI**: Installed locally (`npm i -g nx` or via `npx`)
- **Docker & Docker Compose**: For containerized deployment
- **Certbot**: For Let's Encrypt TLS certificates (install script provided)
- **Basic knowledge**: Nx workspace structure and Docker Compose

## MVP Repository Layout

The MVP uses a simplified structure under `tools/nginx/` for the edge proxy and two load balancers:

```text
my-projects-monorepo/
├─ apps/
│  └─ my-programs-app/          # Frontend Next.js app
├─ services/
│  └─ my-nest-js-email-microservice/  # Email microservice
├─ tools/
│  ├─ nginx/
│  │  ├─ common/
│  │  │  ├─ base.nginx.conf    # Shared defaults
│  │  │  └─ snippets/
│  │  │     ├─ headers.conf    # Security headers
│  │  │     └─ logging.conf    # Logging config
│  │  ├─ proxy-edge/           # Edge reverse proxy
│  │  │  ├─ nginx.conf         # Main edge config
│  │  │  ├─ Dockerfile
│  │  │  └─ overlays/
│  │  │     ├─ development.conf
│  │  │     └─ production.conf
│  │  ├─ load-balancers/
│  │  │  ├─ lb-frontend/       # Frontend LB (my-programs-app)
│  │  │  │  ├─ nginx.conf
│  │  │  │  └─ Dockerfile
│  │  │  └─ lb-email/          # Email LB (my-nest-js-email-microservice)
│  │  │     ├─ nginx.conf
│  │  │     └─ Dockerfile
│  │  ├─ docker-compose.yaml   # Main orchestration
│  │  ├─ project.json          # Nx targets
│  │  └─ README.md
│  └─ certbot/                 # TLS certificate automation
│     ├─ scripts/
│     │  ├─ install-certbot.sh
│     │  └─ setup-letsencrypt.sh
│     └─ docker-compose.yaml
├─ nx.json
└─ README.md
```

**Key directories:**
- `common/`: Shared NGINX configuration used by all nodes
- `proxy-edge/`: Edge proxy for TLS termination and routing
- `load-balancers/lb-frontend/`: Load balancer for my-programs-app (3 instances)
- `load-balancers/lb-email/`: Load balancer for email microservice (3 instances)
- `certbot/`: TLS certificate automation with Let's Encrypt

## MVP Configuration

### Edge Proxy Configuration

The edge proxy terminates TLS and routes to load balancers:

```nginx
# Map hostnames to load balancer upstreams
map $host $lb_upstream {
  default lb_frontend;
  email.yourdomain.com lb_email;
}

upstream lb_frontend {
  zone lb_frontend 64k;
  server lb-frontend:8080;
}

upstream lb_email {
  zone lb_email 64k;
  server lb-email:8080;
}

server {
  listen 443 ssl http2;
  server_name _;

  # TLS Configuration
  ssl_certificate /etc/nginx/tls/fullchain.pem;
  ssl_certificate_key /etc/nginx/tls/privkey.pem;
  
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

### Frontend Load Balancer (3 instances)

Load balances traffic across 3 instances of my-programs-app:

```nginx
upstream frontend_apps {
  zone frontend_apps 64k;
  least_conn;
  
  server my-programs-app-1:3000 max_fails=3 fail_timeout=30s;
  server my-programs-app-2:3000 max_fails=3 fail_timeout=30s;
  server my-programs-app-3:3000 max_fails=3 fail_timeout=30s;
}

server {
  listen 8080;
  server_name lb-frontend;

  include /etc/nginx/snippets/headers.conf;

  location / {
    proxy_pass http://frontend_apps;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Email Load Balancer (3 instances)

Load balances traffic across 3 instances of email microservice:

```nginx
upstream email_service {
  zone email_service 64k;
  least_conn;
  
  server my-nest-js-email-microservice-1:3000 max_fails=3 fail_timeout=30s;
  server my-nest-js-email-microservice-2:3000 max_fails=3 fail_timeout=30s;
  server my-nest-js-email-microservice-3:3000 max_fails=3 fail_timeout=30s;
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

## Nx Targets for MVP

Essential Nx targets for the MVP:

```json
{
  "targets": {
    "nginx:docker-build-edge": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-edge -f tools/nginx/proxy-edge/Dockerfile ."
      }
    },
    "nginx:docker-build-lb-frontend": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-lb-frontend -f tools/nginx/load-balancers/lb-frontend/Dockerfile ."
      }
    },
    "nginx:docker-build-lb-email": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker build -t my-org/nginx-lb-email -f tools/nginx/load-balancers/lb-email/Dockerfile ."
      }
    },
    "nginx:up": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker compose -f tools/nginx/docker-compose.yaml up -d"
      },
      "dependsOn": [
        "nginx:docker-build-edge",
        "nginx:docker-build-lb-frontend",
        "nginx:docker-build-lb-email"
      ]
    },
    "nginx:down": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker compose -f tools/nginx/docker-compose.yaml down"
      }
    },
    "nginx:logs": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker compose -f tools/nginx/docker-compose.yaml logs -f"
      }
    }
  }
}
```

**Usage:**
```bash
# Build and start all services
nx run nginx:up

# View logs
nx run nginx:logs

# Stop all services
nx run nginx:down
```

## Docker Compose MVP Setup

### Main docker-compose.yaml

```yaml
version: "3.8"

services:
  # Edge Proxy - TLS termination and routing
  proxy-edge:
    image: my-org/nginx-edge:latest
    container_name: nginx-proxy-edge
    build:
      context: ../..
      dockerfile: tools/nginx/proxy-edge/Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./secrets/tls:/etc/nginx/tls:ro
    networks:
      - nginx-internal
      - app-network
    depends_on:
      - lb-frontend
      - lb-email
    restart: unless-stopped

  # Frontend Load Balancer
  lb-frontend:
    image: my-org/nginx-lb-frontend:latest
    container_name: nginx-lb-frontend
    build:
      context: ../..
      dockerfile: tools/nginx/load-balancers/lb-frontend/Dockerfile
    expose:
      - "8080"
    networks:
      - nginx-internal
      - app-network
    restart: unless-stopped

  # Email Load Balancer
  lb-email:
    image: my-org/nginx-lb-email:latest
    container_name: nginx-lb-email
    build:
      context: ../..
      dockerfile: tools/nginx/load-balancers/lb-email/Dockerfile
    expose:
      - "8080"
    networks:
      - nginx-internal
      - app-network
    restart: unless-stopped

  # Frontend App - 3 instances
  my-programs-app-1:
    image: my-programs-app:latest
    container_name: my-programs-app-1
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  my-programs-app-2:
    image: my-programs-app:latest
    container_name: my-programs-app-2
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  my-programs-app-3:
    image: my-programs-app:latest
    container_name: my-programs-app-3
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  # Email Microservice - 3 instances
  my-nest-js-email-microservice-1:
    image: my-nest-js-email-microservice:latest
    container_name: my-nest-js-email-microservice-1
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  my-nest-js-email-microservice-2:
    image: my-nest-js-email-microservice:latest
    container_name: my-nest-js-email-microservice-2
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  my-nest-js-email-microservice-3:
    image: my-nest-js-email-microservice:latest
    container_name: my-nest-js-email-microservice-3
    environment:
      - NODE_ENV=production
      - PORT=3000
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

networks:
  nginx-internal:
    driver: bridge
    name: nginx-internal
  app-network:
    driver: bridge
    name: app-network
```

## TLS/HTTPS Setup with Certbot

### Step 1: Install Certbot

Use the automated installer with OS detection:

```bash
# Install certbot
nx run certbot:install

# Or manual installation
cd tools/certbot
./scripts/install-certbot.sh
```

### Step 2: Setup Let's Encrypt Certificates

```bash
# Setup Let's Encrypt with automatic configuration
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com

# Or use the script directly
cd tools/certbot
./scripts/setup-letsencrypt.sh \
  --domain yourdomain.com \
  --email your@email.com \
  --staging  # Use staging for testing
```

### Step 3: Configure NGINX for TLS

Certificates will be placed in `tools/nginx/secrets/tls/`. The edge proxy is already configured to use:
- `fullchain.pem` - Certificate chain
- `privkey.pem` - Private key

### Step 4: Setup Auto-Renewal

Certbot automatically configures renewal. Verify with:

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer  # Linux
```

### Development TLS (Self-Signed)

For local development, generate self-signed certificates:

```bash
nx run nginx:tls:generate-dev-certs

# Certificates will be in tools/nginx/secrets/tls/
```

## Further Reading

- [Nx Run Commands](https://nx.dev/reference/project-json#run-commands) for building custom targets.
- [NGINX Beginner’s Guide](https://nginx.org/en/docs/beginners_guide.html) for configuration fundamentals.
- [Docker Official NGINX Image](https://hub.docker.com/_/nginx) for image usage patterns.
- [Nx and Docker Integration](https://nx.dev/recipes/docker) for tips on orchestrating container builds from Nx.

With these patterns you can scale an Nx monorepo while keeping NGINX configuration organised, testable, and aligned with Nx’s task orchestration model.

## MVP Deployment Steps

### 1. Build Application Images

```bash
# Build frontend app
nx run my-programs-app:docker-build

# Build email microservice
nx run my-nest-js-email-microservice:docker-build
```

### 2. Setup TLS Certificates

```bash
# For development (self-signed)
nx run nginx:tls:generate-dev-certs

# For production (Let's Encrypt)
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com
```

### 3. Build NGINX Images

```bash
# Build all NGINX images
nx run nginx:docker-build-edge
nx run nginx:docker-build-lb-frontend
nx run nginx:docker-build-lb-email
```

### 4. Start All Services

```bash
# Start everything
nx run nginx:up

# Or use docker compose directly
cd tools/nginx
docker compose up -d
```

### 5. Verify Deployment

```bash
# Check service status
docker compose -f tools/nginx/docker-compose.yaml ps

# View logs
nx run nginx:logs

# Test HTTPS endpoint
curl -k https://localhost

# Test health endpoints
curl http://localhost/health
```

### 6. Configure DNS

Point your domain to the server:
```
yourdomain.com        → <server-ip>
email.yourdomain.com  → <server-ip>
```

## Troubleshooting

### Check Container Status
```bash
docker compose -f tools/nginx/docker-compose.yaml ps
docker compose -f tools/nginx/docker-compose.yaml logs proxy-edge
```

### Validate NGINX Configuration
```bash
docker exec nginx-proxy-edge nginx -t
docker exec nginx-lb-frontend nginx -t
docker exec nginx-lb-email nginx -t
```

### Reload Configuration
```bash
docker exec nginx-proxy-edge nginx -s reload
docker exec nginx-lb-frontend nginx -s reload
docker exec nginx-lb-email nginx -s reload
```

### Check Certificate Status
```bash
nx run nginx:tls:validate-certs
```
