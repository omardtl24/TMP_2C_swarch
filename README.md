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

**¡Listo! Así todos pueden cifrar y generar los `.env` de forma segura y multiplataforma.**