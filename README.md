# TMP_2C_swarch
A collaborative tool for managing and tracking team expenditure plans, enabling members to budget, record, and monitor shared financial goals efficiently.

## 📁 Project Structure

- `/frontend`: Contains the web frontend built with **Next.js (App Router)**.
  - Developed in **TypeScript**
  - Styled using **TailwindCSS**
  - Uses **Node.js** as runtime

## 🚀 Tech Stack

- **Next.js 14**
- **TypeScript**
- **TailwindCSS**
- **Docker** (dev + deployment ready)
- **Distributed architecture** (frontend isolated from backend and data layers)

---

## 🔐 Manejo seguro de variables de entorno (.env)

Este proyecto NO sube archivos `.env` ni secretos desencriptados al repo. En su lugar:

- El repo incluye un archivo `env.secrets.gpg` (encriptado con GPG) con todas las variables agrupadas por servicio.
- Usa los siguientes scripts según lo que necesites:

### Para cifrar los secretos (solo el equipo de desarrollo):
- **Bash/Linux/macOS/Git Bash:** `cifrar_envs.sh`
- **PowerShell/Windows:** `cifrar_envs.ps1`

> **En Windows debes instalar [Gpg4win](https://gpg4win.org/) para poder cifrar y descifrar los secretos.**

### Para generar los `.env` para desarrollo y Docker Compose:
- **Bash/Linux/macOS/Git Bash:** `generar_envs.sh`
- **PowerShell/Windows:** `generar_envs.ps1`
- **Windows (sin Python):** Ejecuta directamente `generar_envs.exe`

> Los scripts te pedirán la passphrase de forma segura y nunca la guardan en texto plano. Si no tienes Python en Windows, puedes usar el ejecutable `generar_envs.exe` directamente. El script prioriza el .exe y luego el .py. si algo ajustar el orden.

---

## 🟢 Cómo ejecutar un microservicio Java con variables de entorno locales (.env)

Para desarrollo local, cada microservicio Java incluye un script PowerShell llamado `run_with_env.ps1`.

**¿Por qué?** Spring Boot no carga automáticamente archivos `.env`. Este script carga las variables del `.env` al entorno antes de arrancar el microservicio, así tu configuración en `application.properties` funciona igual que en Docker Compose.

### Pasos:

1. Abre una terminal PowerShell en la carpeta del microservicio (por ejemplo, `logic-users`).
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
  - Las variables internas (`NEXT_PUBLIC_USERS_MICROSERVICE_URL`, etc.) deben apuntar al nombre del contenedor (ej: `http://logic-users:8082`).
  - Las variables públicas (`NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL`, etc.) deben seguir apuntando a `http://localhost:PUERTO` si el frontend se expone en tu máquina.
  - Ejemplo:
    ```env
    NEXT_PUBLIC_USERS_MICROSERVICE_URL=http://logic-users:8082
    NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL=http://localhost:8082
    ```
- **¿Por qué?**
  - El código que corre en el servidor (SSR, server actions, helpers) debe usar la URL interna (nombre de contenedor).
  - El código que corre en el navegador (links, redirecciones) debe usar la URL pública (localhost o dominio real).
- **En producción:**
  - Ajusta las variables públicas a la URL real de tu backend (por ejemplo, la de tu balanceador o dominio).