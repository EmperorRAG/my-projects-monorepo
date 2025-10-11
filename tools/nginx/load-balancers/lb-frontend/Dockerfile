# =================================================================================================
# Dockerfile for NGINX Load Balancer - Frontend
# =================================================================================================
#
# This Dockerfile builds the frontend load balancer container.
# It distributes traffic across frontend Next.js application instances.
#
# Build:
#   docker build -t my-org/nginx-lb-frontend:latest -f tools/nginx/load-balancers/lb-frontend/Dockerfile .
#
# =================================================================================================

FROM nginx:1.27-alpine

LABEL maintainer="monorepo-team@example.com"
LABEL description="NGINX Load Balancer for Frontend Applications"
LABEL version="1.0.0"

WORKDIR /etc/nginx

# Install utilities
RUN apk add --no-cache curl bash ca-certificates && \
	rm -rf /var/cache/apk/*

# Create directories
RUN mkdir -p \
	/etc/nginx/snippets \
	/etc/nginx/conf.d/overlays \
	/var/cache/nginx/frontend \
	/var/log/nginx \
	/var/run/nginx

# Copy base configuration
COPY tools/nginx/common/base.nginx.conf /etc/nginx/nginx.conf
COPY tools/nginx/common/snippets/headers.conf /etc/nginx/snippets/headers.conf
COPY tools/nginx/common/snippets/logging.conf /etc/nginx/snippets/logging.conf

# Copy load balancer configuration
COPY tools/nginx/load-balancers/lb-frontend/nginx.conf /etc/nginx/conf.d/lb-frontend.conf
COPY tools/nginx/load-balancers/lb-frontend/overlays/development.conf /etc/nginx/conf.d/overlays/development.conf
COPY tools/nginx/load-balancers/lb-frontend/overlays/production.conf /etc/nginx/conf.d/overlays/production.conf

# Create overlay selection script
RUN echo '#!/bin/bash' > /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'NGINX_ENV=${NGINX_ENV:-development}' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'echo "Starting lb-frontend in ${NGINX_ENV} mode"' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'if [ "$NGINX_ENV" = "production" ]; then' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    ln -sf /etc/nginx/conf.d/overlays/production.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'else' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    ln -sf /etc/nginx/conf.d/overlays/development.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'fi' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'nginx -t' >> /docker-entrypoint.d/50-select-overlay.sh && \
	chmod +x /docker-entrypoint.d/50-select-overlay.sh

# Set permissions
RUN chown -R nginx:nginx /etc/nginx /var/cache/nginx /var/log/nginx /var/run/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -f http://localhost:8080/health || exit 1

# Expose load balancer port
EXPOSE 8080
