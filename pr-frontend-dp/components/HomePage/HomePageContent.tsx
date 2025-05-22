"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, deleteAccount } from "@/lib/actions/authActions";
import type { Session } from "@/lib/types";



export default function HomePageContent() {
	const { session } = useSession();
	const router = useRouter();
	const [codigo, setCodigo] = useState("");
	const [inputCodigo, setInputCodigo] = useState("");

	// Al montar el componente, intenta leer el código de localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedCodigo = localStorage.getItem("codigo_invitacion") || "";
			setCodigo(storedCodigo);
		}
	}, []);

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
				onSubmit={(e) => {
					e.preventDefault();
					if (!/^[A-Za-z0-9]{8}$/.test(inputCodigo)) {
						alert("El código debe tener 8 caracteres alfanuméricos.");
						return;
					}
					if (typeof window !== "undefined") {
						localStorage.setItem("codigo_invitacion", inputCodigo);
						setCodigo(inputCodigo);
					}
					// Ya no es necesario hacer router.push con el código en la URL
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
						onChange={(e) => setInputCodigo(e.target.value)}
					/>
				</label>
				<button
					className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
					type="submit"
				>
					Ingresar
				</button>
			</form>
			{codigo && (
				<div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded text-black flex flex-col gap-2">
					<div>
						<strong>Código:</strong> {codigo}
					</div>
					{session ? (
						<div className="flex flex-row gap-2">
							<button
								className="px-4 py-2 bg-primary-50 text-white rounded hover:bg-blue-700 transition"
								onClick={() => {
									alert("Invitación aceptada (dummy)");
									if (typeof window !== "undefined") {
										localStorage.removeItem("codigo_invitacion");
										setCodigo("");
									}
									router.replace("/");
								}}
							>
								Aceptar invitación (dummy)
							</button>
							<button
								className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
								onClick={() => {
									if (typeof window !== "undefined") {
										localStorage.removeItem("codigo_invitacion");
										setCodigo("");
									}
								}}
							>
								Cancelar
							</button>
						</div>
					) : (
						<div className="flex flex-row gap-2">
							<button
								className="px-4 py-2 bg-primary-50 text-white rounded hover:bg-blue-700 transition"
								onClick={() => router.push(`/login`)}
							>
								Iniciar sesión
							</button>
							<button
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
								onClick={() => router.push(`/register`)}
							>
								Registrarse
							</button>
							<button
								className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
								onClick={() => {
									if (typeof window !== "undefined") {
										localStorage.removeItem("codigo_invitacion");
										setCodigo("");
									}
								}}
							>
								Cancelar
							</button>
						</div>
					)}
				</div>
			)}

			{/* Botón de login/logout */}
			{session ? (
				<button
					className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
					onClick={async () => {
						await logout();
					}}
				>
					Cerrar sesión
				</button>
			) : (
				<button
					className="px-4 py-2 bg-primary-50 text-white rounded hover:bg-blue-700 transition"
					onClick={() => router.push(`/login`)}
				>
					Iniciar sesión
				</button>
			)}

			{session && (
				<button
					className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900 transition"
					onClick={async () => {
						if (confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
							const res = await deleteAccount();
							if (res.ok) {
								await logout();
							} else {
								alert(res.error || "Error eliminando cuenta");
							}
						}
					}}
				>
					Eliminar cuenta
				</button>
			)}
		</main>
	);
}
