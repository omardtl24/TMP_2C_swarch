"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { GoogleIcon } from "../Icons/GoogleIcon";

interface RegisterLoginButtonProps {
	callbackUrl: string;
	title: string;
}

export default function RegisterLoginButton({callbackUrl,title}: RegisterLoginButtonProps) {
	const searchParams = useSearchParams();
	const codigo = searchParams.get("codigo") || "";

	// Construir callbackUrl con el código si existe

	
	if (codigo) {
		callbackUrl += `?codigo=${encodeURIComponent(codigo)}`;
	}

	return (
		// <button
		// 	className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
		// 	type="button"
		// 	onClick={() => {
		// 		signIn("google", { callbackUrl });
		// 	}}
		// >
		// 	Ingresar con Google
		// </button>

		<Button
					className="w-full max-w-xs h-14 text-md bg-white text-gray-700 rounded-full py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6"
					type="button"
					onClick={() => {
						signIn("google", { callbackUrl: callbackUrl })
					}}
				>
					<GoogleIcon className="md" />
					{title}
				</Button>

	);
}
