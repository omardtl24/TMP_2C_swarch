# PostgreSQL Database for Personal Expenses
FROM postgres:16-alpine

# Install additional security packages
RUN apk update && apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Copy initialization script
COPY init-postgres.sql /docker-entrypoint-initdb.d/init-postgres.sql

# Set proper permissions for initialization script
RUN chmod 644 /docker-entrypoint-initdb.d/init-postgres.sql

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD pg_isready -U ${POSTGRES_USER:-postgres} || exit 1

# The base postgres image already exposes port 5432 and runs as postgres user
EXPOSE 5432