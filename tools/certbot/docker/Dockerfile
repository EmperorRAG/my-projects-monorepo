FROM certbot/certbot:latest

# Install additional plugins if needed
RUN pip install certbot-dns-cloudflare certbot-dns-route53

# Create directories for certificates and configuration
RUN mkdir -p /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt

# Set working directory
WORKDIR /opt/certbot

# Default command to show help
CMD ["--help"]
