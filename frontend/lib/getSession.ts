import { cookies } from "next/headers";
import type { Session } from "@/lib/types";

/**
 * Server-side helper to get the current session from the backend using the access_token cookie.
 * Returns null if not authenticated or on error.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      headers: {
        Cookie: `access_token=${token}`,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }
  return null;
}
