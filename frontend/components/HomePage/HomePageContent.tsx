"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Session } from "next-auth";

interface HomePageContentProps {
  session: Session | null;
}

export default function HomePageContent({ session }: HomePageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codigo = searchParams.get("codigo") || "";
  const [inputCodigo, setInputCodigo] = useState("");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">Bienvenido a Cuentas Claras</h1>
      <div className="w-full max-w-xl bg-gray-100 rounded p-4">
        <h2 className="font-semibold mb-2 text-black">Datos de la sesión:</h2>
        <pre className="text-xs bg-white p-2 rounded overflow-x-auto border border-gray-200 text-black">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      {/* Input solo para código */}
      <form
        className="flex flex-col gap-2 w-full max-w-md bg-white p-4 rounded shadow"
        onSubmit={e => {
          e.preventDefault();
          if (!/^[A-Za-z0-9]{8}$/.test(inputCodigo)) {
            alert("El código debe tener 8 caracteres alfanuméricos.");
            return;
          }
          router.push(`/?codigo=${encodeURIComponent(inputCodigo)}`);
        }}
      >
        <label className="flex flex-col gap-1 text-black">
          Código de invitación (8 caracteres):
          <input
            className="border rounded px-2 py-1"
            type="text"
            name="codigo"
            placeholder="Ej: ABCD1234"
            maxLength={8}
            pattern="[A-Za-z0-9]{8}"
            required
            value={inputCodigo}
            onChange={e => setInputCodigo(e.target.value)}
          />
        </label>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          type="submit"
        >
          Ingresar
        </button>
      </form>
      {/* Notificación de código si está presente */}
      {codigo && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded text-black flex flex-col items-center gap-2">
          <div>
            <strong>Código:</strong> {codigo}
          </div>
          {session ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
              onClick={() => {
                alert("Invitación aceptada (dummy)");
                // Refrescar la página y eliminar los query params
                router.replace("/");
              }}
            >
              Aceptar invitación (dummy)
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
              onClick={() => router.push(`/login?codigo=${encodeURIComponent(codigo)}`)}
            >
              Iniciar sesión para aceptar
            </button>
          )}
        </div>
      )}
      {/* Botón de login/logout */}
      {session ? (
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => router.push(`/login`)}
        >
          Iniciar sesión
        </button>
      )}
    </main>
  );
}
