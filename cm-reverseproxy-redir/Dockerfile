# Use the official Nginx image as a base.
FROM nginx:alpine

# The envsubst utility is part of the 'gettext' package.
# We install it and then remove the package cache.
RUN apk update && apk add gettext && rm -rf /var/cache/apk/*

# Create a directory for the Nginx configuration templates.
RUN mkdir -p /etc/nginx/templates

# Copy the template file into the templates directory.
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the entrypoint script.
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the entrypoint script executable.
RUN chmod +x /usr/local/bin/entrypoint.sh

# List and show the first few lines of the entrypoint script for verification.
RUN ls -l /usr/local/bin/entrypoint.sh && head -5 /usr/local/bin/entrypoint.sh

# Set the entrypoint script as the command to run when the container starts.
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]