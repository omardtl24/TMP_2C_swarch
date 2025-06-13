
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
