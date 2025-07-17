# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf

FROM nginx:alpine

# Copiar configuración temporal
COPY nginx-temp.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]