"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const codigo = searchParams.get("codigo") || "";

	// Construir callbackUrl con el código si existe
	let callbackUrl = "/";
	if (codigo) {
		callbackUrl = `/?codigo=${encodeURIComponent(codigo)}`;
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold">Ingresa a Cuentas Claras</h1>

			<button
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
				type="button"
				onClick={() => {
					signIn("google", { callbackUrl: callbackUrl });
				}}
			>
				Ingresar con Google
			</button>
			{codigo ? (
				<div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-900 text-center max-w-md">
					<strong>Nota:</strong> Si intentas iniciar sesión y{" "}
					<span className="font-semibold">no estás registrado</span>, <br />
					<span className="font-semibold">
						no podremos completar el proceso automático con el código
					</span>
					.<br />
					Por favor,{" "}
					<span className="font-semibold">
						ve directamente a{" "}
						<button
							className="underline text-blue-700 hover:text-blue-900 inline"
							type="button"
							onClick={() => {
								let url = "/register";
								if (codigo) url += `?codigo=${encodeURIComponent(codigo)}`;
								router.push(url);
							}}
						>
							registro
						</button>
					</span>{" "}
					para usar tu código de invitación.
				</div>
			) : (
				<button
					className="underline text-blue-700 hover:text-blue-900"
					type="button"
					onClick={() => router.push("/register")}
				>
					¿No tienes cuenta? Regístrate
				</button>
			)}
		</div>
	);
}
