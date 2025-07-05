# Use the official Nginx image as a base.
FROM nginx:alpine

# Install required packages and clean up
RUN apk update && apk add --no-cache gettext openssl && \
    rm -rf /var/cache/apk/*

# Create directories with proper permissions
RUN mkdir -p /etc/nginx/templates /etc/nginx/certs /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp \
    /var/run/nginx /var/log/nginx

# Copy template and certificate config
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY ./cert_config.cnf /etc/nginx/certs/cert_config.cnf
COPY ./nginx.conf /etc/nginx/nginx.conf

# Generate SSL certificate
RUN openssl req -x509 -nodes -newkey rsa:4096 \
  -keyout /etc/nginx/certs/key.key \
  -out /etc/nginx/certs/cert.crt \
  -days 365 \
  -subj "/CN=localhost" \
  -config /etc/nginx/certs/cert_config.cnf

# Set proper permissions for nginx user
RUN chown -R nginx:nginx /etc/nginx /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chmod 600 /etc/nginx/certs/key.key && \
    chmod 644 /etc/nginx/certs/cert.crt && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/run/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Run as non-root user
USER nginx

EXPOSE 80 443
