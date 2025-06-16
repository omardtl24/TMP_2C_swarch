// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { logout, deleteAccount } from "@/lib/actions/authActions";
import { useSession } from "@/contexts/SessionContext";
import Navbar from "@/components/Navbar";
import CuentasClarasIcon from "@/components/Icons/CuentasClarasIcon";

export default function HomePage() {
  const router = useRouter();
  const { session } = useSession();

  return (
    <>
      <Navbar />
      <div className="relative h-fill  flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Fondo decorativo con imagen y blur */}
        <div className="absolute inset-0 z-0 bg-[url('/images/background_image_login.png')] bg-cover bg-center opacity-40 blur-[2px]" />
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
          <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 backdrop-blur-md border border-blue-100 mt-10">
            <CuentasClarasIcon size="2xl" className="mb-2" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-50 drop-shadow-sm text-center">
              Bienvenido a Cuentas Claras
            </h1>
            <p className="text-center text-gray-700 text-lg md:text-xl">
              Una herramienta colaborativa para gestionar y monitorear planes de
              gastos en equipo, permitiendo presupuestar, registrar y dar
              seguimiento a metas financieras compartidas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
              {session ? (
                <>
                  <button
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition w-full md:w-auto"
                    onClick={() => router.push(`/eventBoard`)}
                  >
                    Eventos
                  </button>
                  <button
                    className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition w-full md:w-auto"
                    onClick={() => router.push(`/personalExpenses`)}
                  >
                    Gastos Personales
                  </button>
                  <button
                    className="px-8 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold shadow hover:bg-gray-900 transition w-full md:w-auto"
                    onClick={async () => {
                      if (
                        confirm(
                          "¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
                        )
                      ) {
                        const res = await deleteAccount();
                        if (res.ok) {
                          await logout();
                          router.replace("/");
                        } else {
                          alert(res.error || "Error eliminando cuenta");
                        }
                      }
                    }}
                  >
                    Eliminar cuenta
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-8 py-3 bg-primary-50 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition w-full md:w-auto"
                    onClick={() => router.push(`/login`)}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition w-full md:w-auto"
                    onClick={() => router.push(`/register`)}
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
