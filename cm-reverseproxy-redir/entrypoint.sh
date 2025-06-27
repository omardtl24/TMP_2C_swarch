#!/bin/sh

envsubst '${NGINX_HOST} ${PROXY_PASS_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'