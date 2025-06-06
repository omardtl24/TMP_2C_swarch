// Centralized REST client for SSR y browser
// Espera que le pases el endpoint completo (url) y los headers (incluyendo Cookie si aplica)
// Ahora solo espera url absoluta y headers, sin lógica de API_GATEWAY ni cookies

export type RestClientOptions = {
  url: string; // endpoint completo
  method?: "GET" | "POST" | "PUT" | "DELETE";
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
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  if (options.credentials) {
    fetchOptions.credentials = options.credentials;
  }
  const res = await fetch(options.url, fetchOptions);
  if (!res.ok) throw new Error(`REST error: ${res.status}`);
  return res.json();
}
