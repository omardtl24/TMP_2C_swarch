"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CuentasClarasIcon from "@/components/Icons/CuentasClarasIcon";
import RegisterLoginButton from "@/components/Register/RegisterLoginButton";
import { logout } from "@/lib/actions/authActions";
import { registerUser } from "@/lib/actions/authActions";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [username, setUsername] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Si no hay email, mostrar solo el botón de login con Google y la imagen de fondo
  if (!email) {
    return (
      <div className="h-full flex flex-col md:flex-row">
        <div className="flex-1 bg-[url('/images/background_image_login.png')] bg-cover bg-center h-1/2 md:h-full md:w-1/2 rounded-b-md md:rounded-none mb-4 w-full flex flex-col justify-center items-center">
          <div className="w-auto m-5 md:m-10 rounded-xl bg-white/60 md:h-2/5 backdrop-blur-[10px] p-6 mb-6 flex flex-col gap-4">
            <h1 className="text-3xl font-light text-primary-20 mb-2">
              Regístrate y empieza a tener tus{" "}
              <span className="text-primary-40 font-semibold">cuentas claras</span>
            </h1>
            <p className="text-sm mb-4">
              No te compliques más, accede y controla tus cuentas personales y la
              de los eventos que realizas con tus amigos
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-center flex-col  items-center text-center">
          {/* Texto principal */}
          <h2 className="text-xl md:text-2xl font-medium text-primary-50 mb-8">
            Comienza a tener tus Cuentas Claras
          </h2>
          <RegisterLoginButton title="Registrate con Google" />
          <CuentasClarasIcon size="lg" className="mt-10" />
        </div>
      </div>
    );
  }

  // Si hay email, mostrar el formulario de registro con los mismos estilos
  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="flex-1 bg-[url('/images/background_image_login.png')] bg-cover bg-center h-1/2 md:h-full md:w-1/2 rounded-b-md md:rounded-none mb-4 w-full flex flex-col justify-center items-center">
        <div className="w-auto m-5 md:m-10 rounded-xl bg-white/60 md:h-2/5 backdrop-blur-[10px] p-6 mb-6 flex flex-col gap-4">
          <h1 className="text-3xl font-light text-primary-20 mb-2">
            Completa tu registro y empieza a tener tus{" "}
            <span className="text-primary-40 font-semibold">cuentas claras</span>
          </h1>
          <p className="text-sm mb-4">
            Solo falta un paso para crear tu cuenta y acceder a todas las
            funcionalidades.
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center flex-col items-center text-center">
        <form
          className="flex flex-col gap-4 w-full max-w-md bg-white p-4 rounded shadow"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSuccess("");
            if (!aceptaTerminos || !aceptaPolitica) {
              setError("Debes aceptar los términos y la política de datos.");
              return;
            }
            if (!username) {
              setError("Debes ingresar un nombre de usuario.");
              return;
            }
            setLoading(true);
            try {
              const res = await registerUser({ email, username });
              if ((res as any).ok) {
                setSuccess("¡Registro exitoso! Redirigiendo...");
                setTimeout(() => {
                  router.push("/eventBoard"); // Redirige a eventBoard tras registro exitoso
                }, 1500);
              } else {
                // Si la action retorna un error, mostrarlo
                setError((res as any).error || "Error en el registro");
              }
            } catch {
              setError("Error de red o del servidor");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="flex flex-col gap-1 text-black">
            Email:
            <input
              className="border rounded px-2 py-1 bg-gray-100"
              type="email"
              name="email"
              value={email}
              disabled
            />
          </label>
          <label className="flex flex-col gap-1 text-black">
            Nombre de usuario:
            <input
              className="border rounded px-2 py-1"
              type="text"
              name="username"
              placeholder="Elige un nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              required
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto los{" "}
            <a
              href="#"
              className="underline text-blue-700"
            >
              Términos y Condiciones
            </a>
          </label>
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              required
              checked={aceptaPolitica}
              onChange={(e) => setAceptaPolitica(e.target.checked)}
            />
            He leído la{" "}
            <a
              href="#"
              className="underline text-blue-700"
            >
              Política de Datos
            </a>
          </label>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm">{success}</div>
          )}
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Confirmar registro"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition mt-2"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Cancelar y salir
          </button>
        </form>
        <CuentasClarasIcon size="lg" className="mt-10" />
      </div>
    </div>
  );
}
