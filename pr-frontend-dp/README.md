This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Auth/session flow: Next.js (SSR) + Spring Boot

### ¿Cómo funciona la sesión?
- El backend (Spring Boot) emite un JWT en una cookie llamada `jwt`.
- El frontend (Next.js) accede a la sesión usando el helper centralizado `getSession`.
- Los endpoints de backend se centralizan en `lib/endpoints.ts` y los helpers de autenticación en `lib/actions/authActions.ts`.

### SSR (Server Side Rendering)
- **Las cookies del usuario NO se reenvían automáticamente en fetch.**
- En SSR, debes extraer la cookie JWT del request y pasarla manualmente en el header `Cookie` al hacer fetch al backend.
- Ejemplo usando helpers centralizados:
  ```ts
  import { cookies } from "next/headers";
  import { getSession } from "@/lib/getSession";
  // ...
  const session = await getSession();
  ```
- El helper `getSession` primero intenta decodificar el JWT localmente (usando la public key del backend, obtenida con `fetchPublicKey` de `authActions`). Si falla, hace fetch a `/auth/me` usando la cookie JWT.
- `credentials: "include"` **NO tiene efecto** en SSR.

### Client-side (Browser)
- El navegador sí envía automáticamente las cookies si usas `credentials: "include"` en fetch.
- Ejemplo:
  ```js
  fetch("/auth/me", { credentials: "include" })
  ```
- No puedes setear el header `Cookie` manualmente en el browser (por seguridad).
- Para llamadas client-side, usa el cliente REST centralizado y pasa `credentials: "include"` si necesitas enviar cookies.

### Centralización de endpoints y helpers
- Usa `lib/endpoints.ts` para definir las URLs base de cada microservicio.
- Usa `lib/actions/authActions.ts` para helpers como `fetchPublicKey`, `fetchSessionFromBackend`, `registerUser`, `logout`, etc.
- Usa `lib/api/restClient.ts` para un cliente REST genérico que soporta headers y credentials customizables.

### Debugging
- Si el backend no recibe la cookie, revisa:
  - Dominio y puerto de la cookie.
  - Atributos `SameSite` y `Secure`.
  - Si la petición es SSR, asegúrate de pasar la cookie manualmente.
- El backend tiene un filtro `JwtAuthenticationFilter` que imprime logs para depuración.

### Resumen
- **SSR:** pasa la cookie JWT manualmente en el header `Cookie` (usando helpers).
- **Browser:** usa `credentials: "include"` en fetch.
- Centraliza endpoints y helpers para mantener el código limpio y DRY.

## Notas sobre variables de entorno y URLs (solo para developers)

- Las variables `NEXT_PUBLIC_USERS_MICROSERVICE_URL`, `NEXT_PUBLIC_COMMUNITY_MICROSERVICE_URL`, etc. deben apuntar a la URL interna del microservicio según el entorno:
  - **Desarrollo local:** usa `http://localhost:PUERTO` (ej: `http://localhost:8082`).
  - **Docker Compose:** usa el nombre del servicio/contendor (ej: `http://logic-users:8082`).
- La variable `FRONTEND_BASE_URL` debe ser la URL pública desde la que los usuarios acceden al frontend:
  - **Local o Docker Compose:** normalmente `http://localhost:3000` (si expones el puerto 3000).
  - **Producción (Vercel, etc):** la URL real del sitio, ej: `https://tudominio.vercel.app`.
- Estas diferencias solo importan para developers al configurar el entorno. El código ya está preparado para centralizar y consumir estas variables correctamente.

---

_Última actualización: 2025-05-17_
