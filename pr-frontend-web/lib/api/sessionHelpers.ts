/* eslint-disable @typescript-eslint/no-explicit-any */
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { Session } from "@/lib/types";

// Helper universal para obtener la sesión, funciona en SSR y server actions
export async function fetchSessionUniversal(context?: any): Promise<Session | null> {
  try {
    const response = await callApiWithAuth<any>({
      path: "/auth/me",
      method: "GET",
    }, context);

    return response.data as Session;

  } catch {
    return null;
  }
}
