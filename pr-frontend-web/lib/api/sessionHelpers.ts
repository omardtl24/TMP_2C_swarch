import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { Session } from "@/lib/types";

// Helper universal para obtener la sesión, funciona en SSR y server actions
export async function fetchSessionUniversal(context?: any): Promise<Session | null> {
  try {
    return await callApiWithAuth<Session>({
      path: "/auth/me",
      method: "GET",
    }, context);
  } catch {
    return null;
  }
}
