import { ENDPOINTS } from "@/lib/endpoints";
import jwkToPem from "jwk-to-pem";

// Helper to fetch the backend public key (PEM format)
export async function fetchPublicKey(): Promise<string | null> {
  try {
    const res = await fetch(
      ENDPOINTS.users.ssr + "/.well-known/jwks.json"
    );
    if (!res.ok) return null;
    const jwks = await res.json();
    const key = jwks.keys?.[0];
    if (!key) return null;
    // Convert JWK to PEM
    const pem = jwkToPem(key);
    return pem;
  } catch {
    return null;
  }
}

// Helper to fetch session from backend (SSR or browser, pass headers as needed)
export async function fetchSessionFromBackend(token?: string): Promise<unknown | null> {
  try {
    const res = await fetch(ENDPOINTS.users.ssr + "/auth/me", {
      headers: token ? { Cookie: `jwt=${token}` } : undefined,
      credentials: token ? undefined : "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return null;
}

// Helper to register a user (POST /auth/register)
export async function registerUser({ email, username }: { email: string; username: string }): Promise<Response> {
  return fetch(ENDPOINTS.users.browser + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username }),
    credentials: "include",
  });
}

// Helper para logout (POST /logout)
export async function logout() {
  try {
    await fetch(ENDPOINTS.users.browser + "/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Optionally handle error
  }
  // Redirige al landing (home)
  window.location.href = "/";
}

// Helper para eliminar la cuenta (DELETE /auth/me)
export async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(ENDPOINTS.users.browser + "/auth/me", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      return { ok: true };
    } else {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.error || "Error eliminando cuenta" };
    }
  } catch (e) {
    return { ok: false, error: "Error eliminando cuenta" };
  }
}
