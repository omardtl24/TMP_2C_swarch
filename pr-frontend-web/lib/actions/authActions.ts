/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { cookies } from "next/headers";

// Helper para registrar usuario (POST /auth/register)
export async function registerUser({ email, username }: { email: string; username: string }) {
  const response = await callApiWithAuth({
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
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data &&
    typeof (response.data as { jwt?: string }).jwt === "string"
  ) {
    const jwt = (response.data as { jwt: string }).jwt;
    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // Puedes agregar secure: true si solo usas HTTPS
    });
    return { ok: true };
  }

  // Si hay error, propágalo
  return { ok: false, error: (response as { error?: string })?.error || "Error en el registro" };
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
    const response = await callApiWithAuth({
      path: "/auth/me",
      method: "DELETE",
    });
    if (
      response &&
      typeof response === "object" &&
      "status" in response &&
      (response as { status: string }).status === "success"
    ) {
      return { ok: true };
    } else {
      return { ok: false, error: (response as { error?: string })?.error || "Error eliminando cuenta" };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error eliminando cuenta" };
  }
}
