# API REST Endpoints & Auth Flow - lg-users-mg

Este documento describe los endpoints REST y el flujo de autenticación implementados en el microservicio **lg-users-mg**.

---

## Seguridad y Autenticación

- **JWT:** Todos los endpoints protegidos requieren el header:
  ```
  Authorization: Bearer <jwt>
  ```
  El JWT se obtiene tras login OAuth2 o registro y se envía en cada request protegido.
- **Cookie httpOnly:** El backend también setea la cookie `jwt` httpOnly para navegadores.
- **Clave pública JWT:** Disponible en `/.well-known/jwks.json` para validación de tokens.

---

## Endpoints

### DefaultController
- **GET /**
  - **Descripción:** Endpoint de bienvenida. Devuelve un mensaje de estado del API.
  - **Respuesta:**
    ```json
    { "status": "OK", "message": "REST API for cuentas claras lg-users-mg is running" }
    ```

---

### Auth & User Registration

#### 1. Completar registro de usuario
- **POST /auth/register**
- **Headers:**
  - `Authorization: Bearer <jwt>` (opcional, si ya tienes un token temporal)
  - O cookie `register_token` (token temporal de registro)
- **Request JSON:**
  ```json
  {
    "email": "correo@dominio.com",
    "username": "usuarioElegido"
  }
  ```
- **Respuesta exitosa:**
  - Setea cookie `jwt` httpOnly y responde:
  ```json
  { "message": "Usuario registrado y autenticado exitosamente" }
  ```
- **Errores:**
  - 401: Token inválido o expirado
  - 409: El usuario ya existe

#### 2. Obtener información del usuario autenticado
- **GET /auth/me**
- **Headers:**
  - `Authorization: Bearer <jwt>`
  - O cookie `jwt`
- **Respuesta:**
  ```json
  {
    "id": 1,
    "email": "correo@dominio.com",
    "username": "usuarioElegido",
    "name": "Nombre Google"
  }
  ```
- **Errores:**
  - 401: Token inválido o no enviado
  - 404: Usuario no encontrado

#### 3. Logout
- **POST /logout**
- **Función:** Elimina la cookie `jwt` y cierra la sesión.
- **Respuesta:**
  ```json
  { "message": "Logged out" }
  ```

#### 4. Obtener clave pública JWT
- **GET /.well-known/jwks.json**
- **Función:** Devuelve la clave pública en formato JWKS para validar la firma de los JWT.
- **Respuesta:**
  ```json
  {
    "keys": [
      {
        "kty": "RSA",
        "alg": "RS256",
        "use": "sig",
        "n": "...",
        "e": "...",
        "kid": "1"
      }
    ]
  }
  ```

---

## Estructura de los DTO principales

### UserRegistrationDTO (registro)
```json
{
  "email": "correo@dominio.com",
  "username": "usuarioElegido"
}
```

### UserEntity (respuesta info usuario)
```json
{
  "id": 1,
  "email": "correo@dominio.com",
  "username": "usuarioElegido",
  "name": "Nombre Google"
}
```

---

## Notas
- El flujo de autenticación usa OAuth2 (Google) y JWT firmado con RS256.
- El frontend debe manejar el login, registro y almacenamiento del JWT (en cookie o header).
- El endpoint `/auth/me` es el punto de entrada para obtener la info del usuario autenticado.
- El endpoint `/logout` elimina la cookie de sesión.
- La clave pública está disponible para validación de tokens por parte de otros servicios/frontends.
