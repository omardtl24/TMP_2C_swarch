import { NextResponse } from "next/server";

export async function GET() {
  const apiGateway = process.env.API_GATEWAY;
  const redirectUrl = `${apiGateway}/auth/google`;
  return NextResponse.redirect(redirectUrl);
}
