"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function RegisterLoginButton() {
	const searchParams = useSearchParams();
	const codigo = searchParams.get("codigo") || "";

	// Construir callbackUrl con el código si existe
	let callbackUrl = "/register";
	if (codigo) {
		callbackUrl += `?codigo=${encodeURIComponent(codigo)}`;
	}

	return (
		<button
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			type="button"
			onClick={() => {
				signIn("google", { callbackUrl });
			}}
		>
			Ingresar con Google
		</button>
	);
}
