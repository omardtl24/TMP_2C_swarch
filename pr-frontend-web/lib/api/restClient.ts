/* eslint-disable @typescript-eslint/no-explicit-any */
// Centralized REST client for SSR y browser
// Espera que le pases el endpoint completo (url) y los headers (incluyendo Cookie si aplica)
// Ahora solo espera url absoluta y headers, sin lógica de API_GATEWAY ni cookies

export type RestClientOptions = {
  url: string; // endpoint completo
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: "include" | "omit" | "same-origin";
};

export async function restClient<T = unknown>(options: RestClientOptions): Promise<T> {
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  // Convert headers to a mutable object for manipulation
  const headersObj = { ...(fetchOptions.headers as Record<string, string>) };
  // Si el header Authorization no está y hay jwt en Cookie, lo agregamos
  if (!headersObj["Authorization"] && headersObj["Cookie"]) {
    const match = headersObj["Cookie"].match(/(?:^|; )jwt=([^;]*)/);
    if (match) {
      headersObj["Authorization"] = `Bearer ${match[1]}`;
    }
  }
  fetchOptions.headers = headersObj;
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  if (options.credentials) {
    fetchOptions.credentials = options.credentials;
  }
  const res = await fetch(options.url, fetchOptions);
  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    console.log("Error parsing JSON response:", e, "URL:", options.url);
    throw new Error("Respuesta del backend no es JSON válido");
  }
  if (!res.ok || (json && json.status === "error")) {
    console.log("REST error:", res.status, json, "URL:", options.url);
    throw new Error(json?.message ? `${json.message} (URL: ${options.url})` : `REST error: ${res.status} (URL: ${options.url})`);
  }
  return json;
}
