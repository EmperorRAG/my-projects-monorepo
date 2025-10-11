# =================================================================================================
# Dockerfile for NGINX Edge Proxy
# =================================================================================================
#
# This Dockerfile builds a production-ready NGINX edge proxy container that serves as the
# entry point for all external traffic in the monorepo infrastructure.
#
# Architecture:
# - Based on official NGINX Alpine image for minimal size
# - Includes common configuration and snippets
# - Supports environment-specific overlays (development/production)
# - Configured for optimal performance and security
#
# Build:
#   docker build -t my-org/nginx-edge:latest -f tools/nginx/proxy-edge/Dockerfile .
#
# Run (development):
#   docker run -p 80:80 -e NGINX_ENV=development my-org/nginx-edge:latest
#
# Run (production):
#   docker run -p 80:80 -p 443:443 -e NGINX_ENV=production my-org/nginx-edge:latest
#
# =================================================================================================

# Use official NGINX Alpine image as base
# Alpine variant is chosen for its minimal size (~23MB vs ~140MB for debian)
FROM nginx:1.27-alpine

# Metadata labels following OCI image specification
LABEL maintainer="monorepo-team@example.com"
LABEL description="NGINX Edge Proxy for Nx Monorepo"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="NGINX Edge Proxy"
LABEL org.opencontainers.image.description="Reverse proxy and TLS termination for monorepo services"
LABEL org.opencontainers.image.vendor="My Organization"

# Set working directory
WORKDIR /etc/nginx

# Install additional tools for health checks and debugging
# - curl: for health check endpoints and debugging
# - bash: for better shell support in debugging
# - ca-certificates: for HTTPS upstream connections
RUN apk add --no-cache \
	curl \
	bash \
	ca-certificates \
	&& rm -rf /var/cache/apk/*

# Create necessary directories
RUN mkdir -p \
	/etc/nginx/snippets \
	/etc/nginx/conf.d/overlays \
	/etc/nginx/tls \
	/var/cache/nginx \
	/var/log/nginx \
	/var/run/nginx

# Copy common configuration files
# Base configuration with global settings
COPY tools/nginx/common/base.nginx.conf /etc/nginx/nginx.conf

# Copy common snippets (headers, logging)
COPY tools/nginx/common/snippets/headers.conf /etc/nginx/snippets/headers.conf
COPY tools/nginx/common/snippets/logging.conf /etc/nginx/snippets/logging.conf

# Copy proxy-edge specific configuration
COPY tools/nginx/proxy-edge/nginx.conf /etc/nginx/conf.d/proxy-edge.conf

# Remove the default site to avoid conflicts with custom configs
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy environment-specific overlays
COPY tools/nginx/proxy-edge/overlays/development.conf /etc/nginx/conf.d/overlays/development.conf
COPY tools/nginx/proxy-edge/overlays/production.conf /etc/nginx/conf.d/overlays/production.conf

# Create a startup script that selects the appropriate overlay based on environment
RUN echo '#!/bin/bash' > /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'set -e' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '# Determine which overlay to activate based on NGINX_ENV' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'NGINX_ENV=${NGINX_ENV:-development}' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'echo "Starting NGINX Edge Proxy in ${NGINX_ENV} mode"' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '# Activate the appropriate overlay' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'if [ "$NGINX_ENV" = "production" ]; then' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    echo "Activating production overlay"' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    ln -sf /etc/nginx/conf.d/overlays/production.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'else' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    echo "Activating development overlay"' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '    ln -sf /etc/nginx/conf.d/overlays/development.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'fi' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo '# Test configuration' >> /docker-entrypoint.d/50-select-overlay.sh && \
	echo 'nginx -t' >> /docker-entrypoint.d/50-select-overlay.sh && \
	chmod +x /docker-entrypoint.d/50-select-overlay.sh

# Set proper permissions
RUN chown -R nginx:nginx \
	/etc/nginx \
	/var/cache/nginx \
	/var/log/nginx \
	/var/run/nginx

# Create a custom error page
RUN echo '<!DOCTYPE html>' > /usr/share/nginx/html/50x.html && \
	echo '<html lang="en">' >> /usr/share/nginx/html/50x.html && \
	echo '<head>' >> /usr/share/nginx/html/50x.html && \
	echo '    <meta charset="UTF-8">' >> /usr/share/nginx/html/50x.html && \
	echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' >> /usr/share/nginx/html/50x.html && \
	echo '    <title>Service Temporarily Unavailable</title>' >> /usr/share/nginx/html/50x.html && \
	echo '    <style>' >> /usr/share/nginx/html/50x.html && \
	echo '        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }' >> /usr/share/nginx/html/50x.html && \
	echo '        h1 { color: #333; }' >> /usr/share/nginx/html/50x.html && \
	echo '        p { color: #666; }' >> /usr/share/nginx/html/50x.html && \
	echo '    </style>' >> /usr/share/nginx/html/50x.html && \
	echo '</head>' >> /usr/share/nginx/html/50x.html && \
	echo '<body>' >> /usr/share/nginx/html/50x.html && \
	echo '    <h1>Service Temporarily Unavailable</h1>' >> /usr/share/nginx/html/50x.html && \
	echo '    <p>We are currently experiencing technical difficulties. Please try again later.</p>' >> /usr/share/nginx/html/50x.html && \
	echo '</body>' >> /usr/share/nginx/html/50x.html && \
	echo '</html>' >> /usr/share/nginx/html/50x.html

# Health check configuration
# This checks if NGINX is responding and can reach the health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -f http://localhost/health || exit 1

# Expose ports
# Port 80 for HTTP traffic
# Port 443 for HTTPS traffic (when TLS is configured)
EXPOSE 80 443

# The default NGINX entrypoint will start NGINX in the foreground
# No need to override CMD as we use the default from the base image

# =================================================================================================
# Build Arguments (Optional)
# =================================================================================================
#
# To customize the build, you can use build arguments:
#
# ARG NGINX_VERSION=1.27
# ARG BUILD_DATE
# ARG VCS_REF
#
# Then build with:
# docker build \
#   --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
#   --build-arg VCS_REF=$(git rev-parse --short HEAD) \
#   -t my-org/nginx-edge:latest \
#   -f tools/nginx/proxy-edge/Dockerfile .
#
# =================================================================================================

# =================================================================================================
# Usage Examples:
# =================================================================================================
#
# Development:
#   docker run -d \
#     --name nginx-edge \
#     -p 80:80 \
#     -e NGINX_ENV=development \
#     my-org/nginx-edge:latest
#
# Production with TLS:
#   docker run -d \
#     --name nginx-edge \
#     -p 80:80 \
#     -p 443:443 \
#     -e NGINX_ENV=production \
#     -v /path/to/certs:/etc/nginx/tls:ro \
#     my-org/nginx-edge:latest
#
# =================================================================================================
