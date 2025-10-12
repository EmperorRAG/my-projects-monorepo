# Nginx Learnings

This file captures problems and solutions for Nginx.

## Default site blocks custom health endpoint
- **If:** a Dockerized NGINX edge proxy uses the stock nginx:alpine default site
- **When:** the container health probe curls /health expecting our custom location
- **Then:** the probe always receives 404 and Docker marks the proxy unhealthy
- **Solution:** remove /etc/nginx/conf.d/default.conf in the image build so our server block owns port 80 and can return 200 from /health

## Docker validate-config needs absolute paths
- **If:** nginx:validate-config relied on docker -v "$(pwd)/..." placeholders
- **When:** running the task on Windows Git Bash so $(pwd) was not expanded and upstream hostnames were unresolved
- **Then:** docker rejected the volume string and later nginx -t failed when names couldn't resolve
- **Solution:** replace the target with a Node validator that resolves absolute paths, mounts snippets/tls/overlays, and adds --add-host entries before running nginx -t
