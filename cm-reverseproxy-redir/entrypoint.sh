#!/bin/sh

# This script runs before Nginx starts.
# It substitutes environment variables in the template file
# and creates the final Nginx configuration.

# The 'envsubst' command replaces variables like ${NGINX_HOST} with
# the value of the environment variables.
#
# Input:  /etc/nginx/templates/default.conf.template
# Output: /etc/nginx/conf.d/default.conf

envsubst '${NGINX_HOST} ${PROXY_PASS_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# After creating the config, this command starts the Nginx server in the foreground.
# 'exec' replaces the shell process with the Nginx process, which is a best practice.
exec nginx -g 'daemon off;'