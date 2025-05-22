# TMP_2C_swarch
A collaborative tool for managing and tracking team expenditure plans, enabling members to budget, record, and monitor shared financial goals efficiently.

## 🔐 Manejo seguro de variables de entorno (.env)

Este proyecto NO sube archivos `.env` ni secretos desencriptados al repo. En su lugar:

- El repo incluye un archivo `env.secrets.gpg` (encriptado con GPG) con todas las variables agrupadas por servicio.
- Usa los siguientes scripts según lo que necesites:

> **En Windows debes instalar [Gpg4win](https://gpg4win.org/) para poder cifrar y descifrar los secretos.**
> Los scripts te pedirán la passphrase de forma segura y nunca la guardan en texto plano. Si no tienes Python en Windows, puedes usar el ejecutable `generar_envs.exe` directamente. El script prioriza el .exe y luego el .py. si algo ajustar el orden.

### Para generar los `.env` para desarrollo y Docker Compose:
- **Bash/Linux/macOS/Git Bash:** `generar_envs.sh`
- **PowerShell/Windows:** `generar_envs.ps1`
- **Windows (sin Python):** Ejecuta directamente `generar_envs.exe`


### Para cifrar los secretos (solo el equipo de desarrollo):
- **Bash/Linux/macOS/Git Bash:** `cifrar_envs.sh`
- **PowerShell/Windows:** `cifrar_envs.ps1`

---

## 🟢 Cómo ejecutar un microservicio Java con variables de entorno locales (.env)

Para desarrollo local, cada microservicio Java incluye un script PowerShell llamado `run_with_env.ps1`.

**¿Por qué?** Spring Boot no carga automáticamente archivos `.env`. Este script carga las variables del `.env` al entorno antes de arrancar el microservicio, así tu configuración en `application.properties` funciona igual que en Docker Compose.

### Pasos:

1. Abre una terminal PowerShell en la carpeta del microservicio (por ejemplo, `lg-users-mg`).
2. Ejecuta:
   ```powershell
   .\run_with_env.ps1
   ```
3. El microservicio arrancará con todas las variables del `.env` disponibles.

> Si usas Linux/macOS, puedes adaptar el script fácilmente a Bash.

---

## 📝 Notas sobre variables de entorno y URLs (solo para developers)

- **Desarrollo local (sin Docker):**
  - Todas las variables de entorno de microservicios (`NEXT_PUBLIC_USERS_MICROSERVICE_URL`, etc.) deben apuntar a `http://localhost:PUERTO`.
  - Ejemplo:
    ```env
    NEXT_PUBLIC_USERS_MICROSERVICE_URL=http://localhost:8082
    NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL=http://localhost:8082
    ```
- **Con Docker Compose:**
  - Las variables internas (`NEXT_PUBLIC_USERS_MICROSERVICE_URL`, etc.) deben apuntar al nombre del contenedor (ej: `http://lg-users-mg:8082`).
  - Las variables públicas (`NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL`, etc.) deben seguir apuntando a `http://localhost:PUERTO` si el frontend se expone en tu máquina.
  - Ejemplo:
    ```env
    NEXT_PUBLIC_USERS_MICROSERVICE_URL=http://lg-users-mg:8082
    NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL=http://localhost:8082
    ```
- **¿Por qué?**
  - El código que corre en el servidor (SSR, server actions, helpers) debe usar la URL interna (nombre de contenedor).
  - El código que corre en el navegador (links, redirecciones) debe usar la URL pública (localhost o dominio real).
- **En producción:**
  - Ajusta las variables públicas a la URL real de tu backend (por ejemplo, la de tu balanceador o dominio).

# Convención de Nombres para los componentes del sistema

Esta convención se usa para nombrar servicios y contenedores de manera consistente y legible.

## Formato General

<layer>-<module>-<responsibility>

Aqui tenemos:
  
- Las tres partes  separadas por guiones.

---

## Componentes del Formato

### 1. **Layer** (Capa)

| Código | Descripción       |
|--------|-------------------|
| `pr`   | Presentation Layer (Frontend/UI) |
| `lg`   | Logic Layer (Backend/Negocio)    |
| `db`   | Database Layer (Bases de datos)  |

---

### 2. **Module** (Módulo)

Debe escribirse **completo y en minúsculas**. Ejemplos:

- `users`
- `community`
- `expenses`
- `personal`

---

### 3. **Responsibility** (Responsabilidad)

| Código | Descripción                           |
|--------|---------------------------------------|
| `dp`   | Display (Interfaz de usuario)         |
| `mg`   | Manager (Lógica de negocio)           |
| `ms`   | Mongo Storage (Base de datos MongoDB) |
| `ps`   | Postgres Storage (Base de datos PostgreSQL) |

---

## Ejemplos

| Nombre del Servicio    | Significado                                                  |
|------------------------|--------------------------------------------------------------|
| `pr-users-dp`          | Presentación del módulo `users` (frontend)                   |
| `lg-community-mg`      | Lógica del módulo `community` (microservicio de negocio)     |
| `db-users-ps`          | Base de datos PostgreSQL del módulo `users`                 |
| `db-community-ms`      | Base de datos MongoDB del módulo `community`                |
| `lg-expenses-mg`       | Lógica de negocio del módulo `expenses`                     |

---

## Buenas Prácticas

- El nombre del `container_name` debe coincidir con el nombre del servicio.
- Si agregas un nuevo módulo o tipo de servicio, define claramente su rol y aplica esta convención.
