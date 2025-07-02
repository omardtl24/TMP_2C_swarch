# Use the official Nginx image as a base.
FROM nginx:alpine

# The envsubst utility is part of the 'gettext' package.
# We install it and then remove the package cache.
RUN apk update && apk add gettext openssl && rm -rf /var/cache/apk/*

# Create a directory for the Nginx configuration templates and certs.
RUN mkdir -p /etc/nginx/templates && mkdir -p /etc/nginx/certs

# Copy the template file into the templates directory.
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the cert config and generate the certificate.
COPY ./cert_config.cnf /etc/nginx/certs/cert_config.cnf

RUN openssl req -x509 -nodes -newkey rsa:4096 \
  -keyout /etc/nginx/certs/key.key \
  -out /etc/nginx/certs/cert.crt \
  -days 365 \
  -subj "/CN=localhost" \
  -config /etc/nginx/certs/cert_config.cnf
