import { auth } from "@/auth";
import RegisterLoginButton from "@/components/Register/RegisterLoginButton";
import RegisterPageContent from "@/components/Register/RegisterPageContent";

export default async function RegisterPage() {
  // Chequeo de sesión server-side
  const session = await auth();

  // Si no hay sesión, mostrar solo el botón de login
  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-bold">Regístrate en Cuentas Claras</h1>
        <p className="mb-2">Para registrarte, inicia sesión con uno de los siguientes proveedores:</p>
        <RegisterLoginButton />
      </main>
    );
  }

  // Si hay sesión, renderizar el formulario cliente
  return <RegisterPageContent session={session} />;
}
