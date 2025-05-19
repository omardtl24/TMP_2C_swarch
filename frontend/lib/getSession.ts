import { cookies } from "next/headers";
import type { Session } from "@/lib/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { fetchPublicKey, fetchSessionFromBackend } from "@/lib/actions/authActions";

/**
 * Server-side helper to get the current session from the backend using the jwt cookie.
 * Prefiere decodificar el JWT localmente si es posible y válido.
 * Si falla la verificación, retorna null.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  if (!token) return null;

  // Intenta validar y decodificar el JWT localmente
  const publicKey = await fetchPublicKey();
  if (publicKey) {
    try {
      const decoded = jwt.verify(token, publicKey) as JwtPayload;
      // Ajusta los campos según tu payload
      return {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        name: decoded.name,
      } as Session;
    } catch {
      // Si falla la verificación, sigue con el fetch al backend
    }
  }

  // Fallback: fetch session from backend usando helper centralizado
  const session = await fetchSessionFromBackend(token);
  return session as Session | null;
}
