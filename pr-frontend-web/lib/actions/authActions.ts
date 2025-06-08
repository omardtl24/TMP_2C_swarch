'use server'
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

// Helper para registrar usuario (POST /auth/register)
export async function registerUser({ email, username }: { email: string; username: string }) {
  return callApiWithAuth({
    path: "/auth/register",
    method: "POST",
    body: { email, username },
  });
}

// Helper para logout (POST /logout)
export async function logout() {
  await callApiWithAuth({
    path: "/auth/logout",
    method: "POST",
  });
  // Redirige al landing (home)
  // Si necesitas redirigir desde el cliente, hazlo en el componente que llama a esta action
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
