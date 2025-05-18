# mongo/Dockerfile Por ahora estan como placeholder...
# Toca revisar si es necesario realizar configuraciones más especificas
FROM mongo:8.0.9

# Optional: Copy an initialization script
# This script will be executed when the container starts for the first time
# and the data directory (/data/db) is empty.
COPY init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js