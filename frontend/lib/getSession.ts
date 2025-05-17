import { cookies } from "next/headers";
import type { Session } from "@/lib/types";
// @ts-expect-error: jsonwebtoken types may not be available in edge runtime
import jwt, { JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

// Helper to fetch the backend public key (PEM format)
async function fetchPublicKey(): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/.well-known/jwks.json`
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

/**
 * Server-side helper to get the current session from the backend using the jwt cookie.
 * Now also validates the JWT signature using the backend public key (if available).
 * Returns null if not authenticated, invalid, or on error.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  console.log("[getSession] jwt cookie:", token);

  if (!token) {
    console.log("[getSession] No JWT token found");
    return null;
  }

  // Try to validate the JWT signature with the backend public key
  const publicKey = await fetchPublicKey();
  console.log("[getSession] publicKey fetched:", publicKey ? "yes" : "no");
  if (publicKey) {
    try {
      const decoded = jwt.verify(token, publicKey) as JwtPayload;
      console.log("[getSession] JWT verified, decoded:", decoded);
      return decoded as Session;
    } catch (err) {
      console.log("[getSession] JWT verification failed:", err);
      return null;
    }
  }

  // Fallback: fetch session from backend
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      credentials: "include",
    });
    console.log("[getSession] /auth/me response status:", res.status);
    if (res.ok) {
      try {
        const data = await res.json();
        console.log("[getSession] /auth/me data:", data);
        return data;
      } catch (err) {
        console.log("[getSession] /auth/me JSON parse error:", err);
        return null;
      }
    }
  } catch (err) {
    console.log("[getSession] /auth/me fetch error:", err);
    // ignore
  }
  console.log("[getSession] Returning null (no session)");
  return null;
}
