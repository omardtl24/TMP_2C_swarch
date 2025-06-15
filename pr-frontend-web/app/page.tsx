// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { logout, deleteAccount } from "@/lib/actions/authActions";
import { useSession } from "@/contexts/SessionContext";

export default function HomePage() {
  const router = useRouter();
  const { session } = useSession();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold text-primary-50 drop-shadow-sm">
          Bienvenido a Cuentas Claras
        </h1>
        <p className="max-w-2xl text-center text-gray-700 text-lg md:text-xl bg-white/80 rounded-lg p-6 shadow">
          Una herramienta colaborativa para gestionar y monitorear planes de gastos
          en equipo, permitiendo presupuestar, registrar y dar seguimiento a metas
          financieras compartidas.
        </p>
      </div>
      <div className="flex flex-row gap-6 mt-8">
        {session ? (
          <>
            <button
              className="px-8 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-red-700 transition"
              onClick={async () => {
                await logout();
                router.replace("/");
              }}
            >
              Cerrar sesión
            </button>
            <button
              className="px-8 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold shadow hover:bg-gray-900 transition"
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
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => router.push(`/eventBoard`)}
            > 
              Eventos
            </button>
            <button
              className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition"
              //onClick={() => }
            >
              Gastos Personales
            </button>
          </>
        ) : (
          <>
            <button
              className="px-8 py-3 bg-primary-50 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => router.push(`/login`)}
            >
              Iniciar sesión
            </button>
            <button
              className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition"
              onClick={() => router.push(`/register`)}
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </main>
  );
}