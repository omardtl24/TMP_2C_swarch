import { NextResponse } from "next/server";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

export async function GET() {
  const apiResponse = await callApiWithAuth<{ status: string; data: { auth_url: string; state: string } }>({
    path: "/auth/google-redirect",
    method: "GET",
    headers: {
      "Cache-Control": "no-store"
    }
  });

  const authUrl = apiResponse.data.auth_url;
  const state = apiResponse.data.state;

  // Setea la cookie con el state (CSRF)
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Puedes agregar secure: true si solo usas HTTPS
  });
  return response;
}
