/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { cookies } from "next/headers";

// Helper para registrar usuario (POST /auth/register)
export async function registerUser({ email, username }: { email: string; username: string }) {
  try {
    const response = await callApiWithAuth<{ jwt?: string }>({
      path: "/auth/register",
      method: "POST",
      body: { email, username },
    });

    // Elimina la cookie register_token después de registro exitoso (solo server action)
    const cookieStore = await cookies();
    cookieStore.set("register_token", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // Si el backend devuelve un JWT, setearlo en la cookie
    if (response?.jwt) {
      cookieStore.set("jwt", response.jwt, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Puedes agregar secure: true si solo usas HTTPS
      });
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error en el registro" };
  }
}

// Helper para logout
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Helper para eliminar la cuenta (DELETE /auth/me)
export async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  try {
    await callApiWithAuth({
      path: "/auth/me",
      method: "DELETE",
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error eliminando cuenta" };
  }
}
