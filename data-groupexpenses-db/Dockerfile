# MongoDB Database for Group Expenses
FROM mongo:8.0.9

# Copy initialization script
COPY init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js

# Set proper permissions for initialization script
RUN chmod 644 /docker-entrypoint-initdb.d/init-mongo.js

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet || exit 1

# The base mongo image already exposes port 27017 and runs as mongodb user
EXPOSE 27017