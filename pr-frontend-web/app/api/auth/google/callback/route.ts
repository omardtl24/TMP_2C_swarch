import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

type GoogleCallbackResponse = {
      status: "success";
      data: {
        name: string;
        email: string;
        register_token: string;
        message: string;
      };
    }
  | {
      status: "success";
      data: {
        jwt: string;
        user: {
          id: number;
          email: string;
          username: string;
          name: string;
        };
        message: string;
      };
    }
  | {
      status: string;
      data?: unknown;
      error?: string;
    };

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
    // Puedes personalizar la ruta de error
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
    return NextResponse.redirect(`${baseUrl}/login?error=csrf`);
  }

  const apiResponse = await callApiWithAuth<GoogleCallbackResponse>({
    path: `/auth/google/callback?code=${code}`,
    method: "GET",
    headers: {
      "Cache-Control": "no-store"
    }
  });

  // Lógica de redirección y seteo de cookies según respuesta
  let response: NextResponse;
  const isProd = process.env.NODE_ENV === "production";

  if (
    apiResponse.status === "success" &&
    apiResponse.data &&
    typeof apiResponse.data === "object" &&
    apiResponse.data !== null &&
    "jwt" in apiResponse.data
  ) {
    // Usuario existente: setea cookie JWT y redirige a eventBoard
    const data = apiResponse.data as Extract<GoogleCallbackResponse, { data: { jwt: string } }>['data'];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
    response = NextResponse.redirect(`${baseUrl}/eventBoard`);
    response.cookies.set("jwt", data.jwt, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProd
    });
  } else if (
    apiResponse.status === "success" &&
    apiResponse.data &&
    typeof apiResponse.data === "object" &&
    apiResponse.data !== null &&
    "register_token" in apiResponse.data
  ) {
    // Usuario NO existe: setea cookie temporal y redirige a registro
    const data = apiResponse.data as Extract<GoogleCallbackResponse, { data: { register_token: string } }>['data'];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
    response = NextResponse.redirect(`${baseUrl}/register`);
    response.cookies.set("register_token", data.register_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 min
      secure: isProd
    });
  } else {
    // Error genérico: redirige a login con mensaje
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
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
