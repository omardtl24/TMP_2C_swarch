import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

// Define los posibles tipos de respuesta del backend
interface GoogleCallbackJwt {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
    name: string;
  };
  message: string;
}
interface GoogleCallbackRegister {
  register_token: string;
  name: string;
  email: string;
  message: string;
}

type GoogleCallbackResponse = GoogleCallbackJwt | GoogleCallbackRegister;

export async function GET(request: Request) {
  // Obtener params de la URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateFromGoogle = searchParams.get("state");

  // Leer el state de la cookie
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get("oauth_state")?.value;

  // CSRF check: si falla, redirige a una página de error
  if (!stateFromGoogle || !stateCookie || stateFromGoogle !== stateCookie) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
    return NextResponse.redirect(`${baseUrl}/login?error=csrf`);
  }

  let response: NextResponse;
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

  try {
    const apiResponse = await callApiWithAuth<GoogleCallbackResponse>({
      path: `/auth/google/callback?code=${code}`,
      method: "GET",
      headers: {
        "Cache-Control": "no-store"
      }
    });

    if ("jwt" in apiResponse) {
      // Usuario existente: setea cookie JWT y redirige a eventBoard
      response = NextResponse.redirect(`${baseUrl}/eventBoard`);
      response.cookies.set("jwt", apiResponse.jwt, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd
      });
    } else if ("register_token" in apiResponse) {
      // Usuario NO existe: setea cookie temporal y redirige a registro
      response = NextResponse.redirect(`${baseUrl}/register`);
      response.cookies.set("register_token", apiResponse.register_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 600, // 10 min
        secure: isProd
      });
    } else {
      // Error inesperado: redirige a login
      response = NextResponse.redirect(`${baseUrl}/login?error=oauth`);
    }
  } catch {
    // Error en el backend: redirige a login con mensaje
    response = NextResponse.redirect(`${baseUrl}/login?error=oauth`);
  }

  // Eliminar la cookie oauth_state después de usarla
  response.cookies.set("oauth_state", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: isProd
  });
  return response;
}
