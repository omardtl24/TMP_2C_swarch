export function getErrorMessage(e: unknown, fallback = "Error desconocido"): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return fallback;
}
