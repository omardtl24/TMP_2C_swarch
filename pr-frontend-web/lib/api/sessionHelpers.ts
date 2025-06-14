'use server';

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

  } catch (e: any) {
    // Si es un 401 (no autenticado), simplemente retorna null sin loguear
    if (typeof e?.message === "string" && (e.message.includes("401") || e.message.toLowerCase().includes("unauthorized"))) {
      return null;
    }
    // Para otros errores, puedes loguear o manejar diferente
    console.error("Error en fetchSessionUniversal:", e);
    return null;
  }
}
