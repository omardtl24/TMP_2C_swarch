import { NextResponse } from "next/server";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

export async function GET() {
  const { auth_url, state } = await callApiWithAuth<{ auth_url: string; state: string }>({
    path: "/auth/google-redirect",
    method: "GET",
    headers: {
      "Cache-Control": "no-store"
    }
  });

  // Setea la cookie con el state (CSRF)
  const response = NextResponse.redirect(auth_url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Puedes agregar secure: true si solo usas HTTPS
  });
  return response;
}
