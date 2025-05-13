# postgres/Dockerfile Por ahora estan como placeholder...
# Toca revisar si es necesario realizar configuraciones más especificas
FROM postgres:alpine3.20

# Optional: Copy an initialization script
# This script will be executed when the container starts for the first time
# and the data directory (/var/lib/postgresql/data) is empty.
COPY init-postgres.sql /docker-entrypoint-initdb.d/init-postgres.sql

# The base postgres image already exposes port 5432
# EXPOSE 5432