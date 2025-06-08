import { NextResponse } from "next/server";

export async function GET() {
  const apiGateway = process.env.API_GATEWAY_URL;
  const redirectUrl = `${apiGateway}/auth/oauth2/authorization/google`;
  return NextResponse.redirect(redirectUrl);
}
