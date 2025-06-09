import RegisterClientForm from "./RegisterClientForm";
import { cookies } from "next/headers";

function decodeEmailFromJWT(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload.email || null;
  } catch {
    return null;
  }
}

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const registerToken = cookieStore.get("register_token")?.value || null;
  const email = registerToken ? decodeEmailFromJWT(registerToken) : null;

  return <RegisterClientForm email={email} hasRegisterToken={!!registerToken} />;
}
