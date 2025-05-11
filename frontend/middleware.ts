import { auth } from "@/auth";

const publicRoutes = ["/", "/login", "/register"];

export const middleware = auth((req) => {
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return;
  }
  if (!req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};