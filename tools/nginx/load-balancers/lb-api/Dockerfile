# =================================================================================================
# Dockerfile for NGINX Load Balancer - API
# =================================================================================================

FROM nginx:1.27-alpine

LABEL maintainer="monorepo-team@example.com"
LABEL description="NGINX Load Balancer for API Services"
LABEL version="1.0.0"

WORKDIR /etc/nginx

RUN apk add --no-cache curl bash ca-certificates && rm -rf /var/cache/apk/*

RUN mkdir -p /etc/nginx/snippets /etc/nginx/conf.d/overlays /var/cache/nginx /var/log/nginx

COPY tools/nginx/common/base.nginx.conf /etc/nginx/nginx.conf
COPY tools/nginx/common/snippets/headers.conf /etc/nginx/snippets/headers.conf
COPY tools/nginx/common/snippets/logging.conf /etc/nginx/snippets/logging.conf

COPY tools/nginx/load-balancers/lb-api/nginx.conf /etc/nginx/conf.d/lb-api.conf
COPY tools/nginx/load-balancers/lb-api/overlays/development.conf /etc/nginx/conf.d/overlays/development.conf
COPY tools/nginx/load-balancers/lb-api/overlays/production.conf /etc/nginx/conf.d/overlays/production.conf

RUN echo '#!/bin/bash' > /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'NGINX_ENV=${NGINX_ENV:-development}' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'echo "Starting lb-api in ${NGINX_ENV} mode"' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'if [ "$NGINX_ENV" = "production" ]; then' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo '    ln -sf /etc/nginx/conf.d/overlays/production.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'else' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo '    ln -sf /etc/nginx/conf.d/overlays/development.conf /etc/nginx/conf.d/active-overlay.conf' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'fi' >> /docker-entrypoint.d/50-select-overlay.sh && \
    echo 'nginx -t' >> /docker-entrypoint.d/50-select-overlay.sh && \
    chmod +x /docker-entrypoint.d/50-select-overlay.sh

RUN chown -R nginx:nginx /etc/nginx /var/cache/nginx /var/log/nginx

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

USER nginx
