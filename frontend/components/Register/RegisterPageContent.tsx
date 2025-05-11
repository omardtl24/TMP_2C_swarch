"use client";

import { Session } from "next-auth";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

interface RegisterPageContentProps {
	session: Session;
}

export default function RegisterPageContent({
	session,
}: RegisterPageContentProps) {
	const searchParams = useSearchParams();
	const codigo = searchParams.get("codigo") || "";
	const [nombre, setNombre] = useState("");
	const [aceptaTerminos, setAceptaTerminos] = useState(false);
	const [aceptaPolitica, setAceptaPolitica] = useState(false);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h1 className="text-2xl font-bold">Completa tu registro</h1>
			<div className="w-full max-w-xl bg-gray-100 rounded p-4">
				<h2 className="font-semibold mb-2 text-black">Datos de la sesión:</h2>
				<pre className="text-xs bg-white p-2 rounded overflow-x-auto border border-gray-200 text-black">
					{JSON.stringify(session, null, 2)}
				</pre>
			</div>
			<form
				className="flex flex-col gap-4 w-full max-w-md bg-white p-4 rounded shadow"
				onSubmit={(e) => {
					e.preventDefault();
					if (!aceptaTerminos || !aceptaPolitica) {
						alert("Debes aceptar los términos y la política de datos.");
						return;
					}
					// Redirigir a la homepage con el código en los params
					if (codigo) {
						window.location.href = `/?codigo=${encodeURIComponent(codigo)}`;
					} else {
						window.location.href = "/";
					}
				}}
			>
				<label className="flex flex-col gap-1 text-black">
					Nombre completo (dummy):
					<input
						className="border rounded px-2 py-1"
						type="text"
						name="nombre"
						placeholder="Tu nombre"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
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
					<a href="#" className="underline text-blue-700">
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
					<a href="#" className="underline text-blue-700">
						Política de Datos
					</a>
				</label>
				<button
					className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
					type="submit"
				>
					Confirmar registro
				</button>
				<button
					type="button"
					className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition mt-2"
					onClick={async () => {
						signOut({ callbackUrl: "/" });
					}}
				>
					Cancelar y salir
				</button>
			</form>
		</main>
	);
}
