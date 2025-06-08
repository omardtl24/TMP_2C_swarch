import { restClient, RestClientOptions } from "./restClient";
import { cookies } from "next/headers";

// Universal context type for SSR or server actions
export type UniversalContext = { req?: { headers?: { cookie?: string } } } | undefined;

/**
 * Helper para llamar al API Gateway con autenticación, funcionando tanto en server actions como en SSR.
 * @param options - path relativo, método, body, headers extra
 * @param context - (opcional) contexto SSR (getServerSideProps)
 */
export async function callApiWithAuth<T = unknown>(
  options: Omit<RestClientOptions, "url" | "headers"> & { path: string; headers?: Record<string, string> },
  context?: UniversalContext
): Promise<T> {
  const apiGateway = process.env.API_GATEWAY_URL || "";
  const url = `${apiGateway}${options.path}`;
  let cookieHeader = "";
  if (context?.req?.headers?.cookie) {
    cookieHeader = context.req.headers.cookie;
  } else {
    // Await cookies() as it's now async in Next.js
    cookieHeader = (await cookies()).toString();
  }
  return restClient<T>({
    ...options,
    url,
    headers: {
      ...(options.headers || {}),
      Cookie: cookieHeader,
    },
  });
}
