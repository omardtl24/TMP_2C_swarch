# Flujo de Autenticación OAuth2 (Google) con API Gateway, Spring Security y Next.js

## 1. BROWSER → FRONTEND (Next.js)
- El usuario hace click en "Login con Google".
- El frontend (Next.js) ejecuta un redirect a `/auth/oauth2/authorization/google` en el API Gateway:
  ```js
  return NextResponse.redirect(`${apiGateway}/auth/oauth2/authorization/google`);
  ```

## 2. FRONTEND → API GATEWAY
- El navegador sigue el redirect y hace una petición GET a:
  ```
  https://api-gateway.tuapp.com/auth/oauth2/authorization/google
  ```

## 3. API GATEWAY → MS (Spring Security)
- El API Gateway recibe la petición y la reenvía al endpoint correspondiente del microservicio de usuarios (MS):
  ```
  https://users-ms.tuapp.com/oauth2/authorization/google
  ```
- Spring Security inicia el flujo OAuth2 y redirige al usuario a Google.

## 4. MS → GOOGLE
- El navegador del usuario es redirigido a Google para autenticarse.
- El usuario se loguea en Google y autoriza la app.

## 5. GOOGLE → CALLBACK URL (API GATEWAY)
- Google redirige al **callback URL** que configuraste en Google Cloud Console, por ejemplo:
  ```
  https://api-gateway.tuapp.com/auth/login/oauth2/code/google
  ```
- El navegador hace una petición GET a ese callback URL (con los parámetros de Google: code, state, etc).

## 6. API GATEWAY → MS (Spring Security)
- El API Gateway recibe el callback y lo reenvía al MS (Spring Security).
- Spring Security valida el code, obtiene los datos del usuario, y ejecuta el `CustomOAuth2SuccessHandler`.

## 7. MS → API GATEWAY (respuesta final)
- El MS responde al API Gateway con un JSON:
  ```json
  {
    "status": "success",
    "data": {
      "userExists": true,
      "token": "..."
    }
  }
  ```
  (o lo que definas en tu SuccessHandler).

## 8. OPCIONES DE MANEJO DEL CALLBACK Y LA SESIÓN

A continuación se resumen los tres enfoques posibles para manejar el callback de Google y la sesión, con sus ventajas, limitaciones y recomendaciones:

### 8.1. (NO RECOMENDADO) Callback al API Gateway, pero lógica de sesión en Next.js client-side
- El callback de Google llega al API Gateway (AG).
- El AG responde al navegador con un redirect a una página del frontend (por ejemplo, `/auth/callback?token=...`).
- El navegador sigue el redirect y carga la página Next.js, donde se lee el token (de query param) y se setea la cookie client-side.
- **Limitaciones:**
  - El token viaja en la URL (menos seguro).
  - La lógica de sesión se hace en el cliente, no serverside.
  - No se aprovechan las ventajas de SSR ni de cookies httpOnly.
  - Es necesario una "página intermedia" para procesar el token.
- **No recomendado** salvo para prototipos o apps muy simples.
- **Nota:** Aunque técnicamente el AG puede hacer un redirect a una API route serverside de Next.js (por ejemplo, `/api/auth/callback?token=...`), el token necesariamente viaja en la URL y queda expuesto al navegador, historial, logs, etc. Por eso, aunque el procesamiento final pueda ser serverside, este enfoque sigue siendo inseguro y no recomendado para producción.
- **Advertencia:** Si el callback URL apunta directo al backend (ya sea al microservicio o al API Gateway), el navegador mostrará en la barra de direcciones la URL pública de ese backend/gateway cuando Google haga el redirect. Esto expone la infraestructura interna y puede confundir al usuario o generar riesgos de seguridad/UX. Siempre es mejor que el callback apunte a una ruta controlada por el frontend (por ejemplo, una API route de Next.js) que maneje la sesión y la experiencia de usuario de forma segura.

### 8.2. (CLÁSICO MICROSERVICIOS) Callback al API Gateway, lógica de sesión en el AG
- El callback de Google llega al AG.
- El AG reenvía al MS (Spring Security) para procesar el code y obtener el JWT.
- El AG setea la cookie httpOnly (si el dominio lo permite) y responde al navegador con un redirect final al dashboard o donde corresponda.
- El usuario llega autenticado, sin exponer el token en la URL ni en el cliente.
- **Ventajas:**
  - Centraliza la lógica de autenticación y sesión en el AG.
  - El frontend queda desacoplado de la lógica de auth.
  - Patrón clásico y seguro en microservicios.
- **Limitaciones:**
  - El AG debe tener la lógica para setear cookies y manejar sesiones.
  - Menos flexible para personalizar la UX desde el frontend.

### 8.3. (RECOMENDADO PARA SSR) Callback directo a API route serverside de Next.js
- El callback de Google llega a una API route de Next.js (server-side).
- Esa API route, serverside, hace la petición (vía AG) al MS para procesar el code y obtener el JWT.
- Next.js setea la cookie httpOnly serverside y responde con un redirect final al dashboard o donde corresponda.
- El usuario llega autenticado, el token nunca se expone al cliente ni en la URL.
- **Ventajas:**
  - Aprovecha las capacidades de SSR y manejo de sesión de Next.js.
  - Máxima seguridad y flexibilidad para la UX.
  - El token nunca viaja por el cliente.
- **Limitaciones:**
  - La lógica de sesión queda en el frontend serverside, no centralizada en el AG.
  - El AG actúa solo como proxy.

---

### Nota sobre los redirects HTTP y el flujo OAuth2
- Los redirects HTTP siempre pasan por el navegador: un servidor (AG, Next.js, etc.) solo puede responder al navegador con un redirect (Location header), y es el navegador quien hace la siguiente petición.
- No es posible que el AG "llame" directamente a una API route serverside de Next.js como parte del mismo flujo HTTP; siempre se requiere un paso intermedio por el navegador.
- Por eso, si quieres que la lógica de sesión sea serverside, el callback debe llegar directo a una API route de Next.js.

---

### Resumen visual del flujo recomendado

```
BROWSER
  │
  ▼
FRONTEND (Next.js)  --redirect-->  API GATEWAY  --proxy-->  MS (Spring Security)  --redirect-->  GOOGLE
                                                                                                    │
                                                                                                    ▼
GOOGLE  --redirect (callback URL)-->  API GATEWAY  --proxy-->  MS (Spring Security)  --JSON/redirect-->  API GATEWAY
                                                                                                                    │
                                                                                                                    ▼
FRONTEND (Next.js) (página /auth/callback)  --redirect-->  BROWSER (dashboard, register, etc)
```

---

### ¿Qué hace cada uno?

- **BROWSER:**  Solo sigue redirecciones y muestra la página final.
- **FRONTEND (Next.js):**  Inicia el login, recibe el resultado en `/auth/callback`, decide el redirect final.
- **API GATEWAY:**  Proxy de todas las rutas de auth, recibe el callback de Google, reenvía al MS, reenvía la respuesta al frontend.
- **MS (Spring Security):**  Maneja la lógica OAuth2, valida el usuario, genera el JWT, responde con JSON.
- **GOOGLE:**  Autentica al usuario y redirige al callback URL.
