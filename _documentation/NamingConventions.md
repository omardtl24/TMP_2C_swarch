# Convención de Nombres para los componentes del sistema

Esta convención se usa para nombrar servicios y contenedores de manera consistente y legible.

## Formato General

tier-module-responsibility

Donde:
- Las tres partes están separadas por guiones.
- **tier**: Capa/tier del sistema (presentation, communication, logic, data)
- **module**: Nombre del módulo (en minúsculas, consistente entre microservicio y su base de datos)
- **responsibility**: Abreviación de la responsabilidad específica del componente

---

## Componentes del Formato

### 1. **Tier** (Capa)

| Código | Descripción                         |
|--------|-------------------------------------|
| `pr`   | Presentation Tier (Frontend/UI)     |
| `cm`   | Communication Tier (API Gateway, Broker MQ) |
| `lg`   | Logic Tier (Backend/Microservicios) |
| `db`   | Data Tier (Bases de datos)          |

---

### 2. **Module** (Módulo)

Debe escribirse **completo y en minúsculas**. Ejemplos:
- `users`
- `community`
- `expenses`
- `personal`

En microservicios, el módulo de lógica (`lg-<module>-ms`) y su base de datos (`db-<module>-db`) deben compartir el mismo nombre de módulo para mantener coherencia.

---

### 3. **Responsibility** (Responsabilidad)

Abreviación de la responsabilidad principal del componente.
- `ms`: microservicio
- `db`: base de datos
- `orch`: orquestación (usado en la API GATEWAY)
- `ui`: interfaz de usuario
- `mq`: cola de mensajes (Broker MQ)

---

## Lista de servicios/carpetas actuales

- pr-frontend-web
- pr-frontend-mobile
  
- cm-apigateway-orch
- cm-broker-mq

- lg-users-ms
- lg-community-ms
- lg-groupexpenses-ms
- lg-personalexpenses-ms
  
- db-users-db
- db-community-db
- db-groupexpenses-db
- db-personalexpenses-db

> Nota: Aunque el broker MQ (cm-broker-mq) está en la tier de comunicación para efectos de nombres y despliegue, en los diagramas (layered view) suele representarse al costado de los microservicios de lógica, mostrando su rol como canal de comunicación asincrónica entre ellos. Esto es estándar y no genera conflicto.
