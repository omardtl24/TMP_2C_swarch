# NGINX Reverse Proxy Service

## Overview

This directory contains the configuration for the `cm-reverseproxy-nginx` service, a crucial component of the overall microservices architecture. Its primary responsibility is to act as a single, unified entry point for all incoming HTTP traffic for the mobile app.

The proxy is configured to forward all requests to the `cm-apigateway-orch` service, which then orchestrates communication with the appropriate backend microservices. This approach simplifies the network topology and streamlines access to the application.

This setup is designed for a development environment and does not implement SSL/TLS (HTTPS).

---

## Features

-   **Containerized Service**: Runs as a lightweight `nginx:alpine` Docker container.
-   **Centralized Entry Point**: All external application traffic is routed through this proxy on port `80`.
-   **Simplified Routing**: Forwards all requests to the API Gateway without complex logic.

---

## Prerequisites

-   Docker and Docker Compose must be installed on your system.
-   You must have the complete project source code, including the root `docker-compose.yml` file.

---

## Project Structure

The `docker-compose.yml` file defines the build context for this service. It expects the following directory structure:


---
```
├── docker-compose.yml
└── cm-reverseproxy-redir/
    ├─── Dockerfile
    ├─── default.conf.template
    └─── cert_config.cnf

```

---

## Getting Started

### 1. Access the Application

Once all containers are running, you can access the application through the NGINX proxy. Open your web browser and navigate to:

http://localhost/

NGINX will capture this request and forward it to the API Gateway.

### 2. Configuration

The proxy's behavior is defined in the default.conf file located within this directory. The most important line is the proxy_pass directive, which specifies the target for all forwarded traffic.

If you need to modify this configuration, you must rebuild the service to apply the changes. You can do this by running the following command from the root directory:
```bash
docker-compose up -d --build cm-reverseproxy-nginx
```