# Use the official Nginx image as a base.
FROM nginx:alpine

# The envsubst utility is part of the 'gettext' package.
# We install it and then remove the package cache.
RUN apk update && apk add gettext && rm -rf /var/cache/apk/* && apk add openssl

# Create a directory for the Nginx configuration templates.
RUN mkdir -p /etc/nginx/templates && mkdir -p /etc/nginx/certs

# Copy the template file into the templates directory.
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the cert_config  and generate the certificate at runtime.
COPY ./cert_config.cnf /etc/nginx/certs/cert_config.cnf
RUN openssl req -x509 -nodes -new rsa:4096 -config /etc/nginx/certs/cert_config.cnf -keyout /etc/nginx/certs/key.key -out /etc/nginx/certs/cert.crt -days 365 -subj "/CN=localhost"
