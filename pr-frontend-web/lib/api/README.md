# API Gateway Pattern: Uso de restClient y callApiWithAuth

## Resumen

Este frontend **nunca debe comunicarse directamente con los microservicios**. Todas las requests deben pasar por el API Gateway, y la autenticación se maneja reenviando la cookie del usuario.

Para centralizar y mantener DRY la lógica de requests autenticadas, se usan dos funciones:

- **restClient**: función de bajo nivel, solo recibe la URL absoluta y headers.
- **callApiWithAuth**: helper universal, arma la URL usando el API Gateway, extrae la cookie según el contexto (SSR o server action) y llama a `restClient`.

---

## Estructura

```
lib/api/
  restClient.ts         // Bajo nivel: fetch con url absoluta
  callApiWithAuth.ts    // Helper universal: path relativo, cookies, API_GATEWAY
  sessionHelpers.ts     // Helpers para sesión (ej: fetchSessionUniversal)
```

---

## SSR y Contexto de Sesión

El layout principal (`app/layout.tsx`) es un **server component** y obtiene la sesión en el servidor usando `fetchSessionUniversal()`. Esta sesión inicial se pasa al `SessionProvider` como `initialSession`.

```tsx
// app/layout.tsx
import { fetchSessionUniversal } from "@/lib/api/sessionHelpers";
import { SessionProvider } from "@/contexts/SessionContext";

export default async function RootLayout({ children }) {
  const initialSession = await fetchSessionUniversal();
  return (
    <SessionProvider initialSession={initialSession}>
      {children}
    </SessionProvider>
  );
}
```

Cualquier página o componente cliente puede acceder a la sesión usando el hook `useSession` del context, **sin hacer SSR ni fetch extra**:

```tsx
import { useSession } from "@/contexts/SessionContext";

export default function HomePage() {
  const { session } = useSession();
  // ...
}
```

---

## Protección de páginas SSR

Si una página necesita SSR y protección de sesión, usa `getServerSideProps` y el helper de sesión:

```typescript
import { fetchSessionUniversal } from "@/lib/api/sessionHelpers";

export async function getServerSideProps(context) {
  const user = await fetchSessionUniversal(context);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { user } };
}
```

---

## Protección de server actions

Puedes proteger server actions verificando la sesión antes de ejecutar la lógica principal:

```typescript
'use server'
import { fetchSessionUniversal } from "@/lib/api/sessionHelpers";

export async function protectedAction() {
  const user = await fetchSessionUniversal();
  if (!user) {
    return { redirect: "/login" };
  }
  // ... lógica protegida ...
  return { ok: true };
}
```

En el cliente:

```typescript
const result = await protectedAction();
if (result?.redirect) {
  window.location.href = result.redirect;
}
```

---

## API Routes necesarias

Solo debes dejar API Routes para casos donde el navegador **debe ser redirigido** (por ejemplo, OAuth login con Google):

- El cliente llama a `/api/auth/google-redirect`.
- Esa API Route responde con un redirect HTTP al endpoint real del API Gateway.

No uses API Routes para exponer endpoints del backend ni para obtener la sesión.

---

## Notas

- No uses `restClient` directamente salvo para casos especiales.
- Toda la lógica de autenticación y armado de rutas debe estar en `callApiWithAuth`.
- Solo implementa helpers como `validateSession` si realmente necesitas reutilizar la lógica en varios lugares.
- Si cambias la ruta del API Gateway, solo actualiza la variable de entorno.
- El layout hidrata la sesión en el context y cualquier página cliente puede acceder a ella con el hook, sin SSR adicional.
- Si una página necesita SSR y protección, usa `getServerSideProps` y el helper de sesión para redirigir si hace falta.

---

**Patrón recomendado para proyectos con API Gateway, SSR y Server Actions.**
