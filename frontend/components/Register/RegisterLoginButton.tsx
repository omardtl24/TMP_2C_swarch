"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { GoogleIcon } from "../Icons/GoogleIcon";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RegisterLoginButton({ title }: { title: string }) {
	const searchParams = useSearchParams();
	const codigo = searchParams.get("codigo") || "";

	// Construir la URL de redirección al backend para Google OAuth
	let redirectUrl = `${backendUrl}/oauth2/authorization/google`;
	if (codigo) {
		redirectUrl += `?codigo=${encodeURIComponent(codigo)}`;
	}

	return (
		<Button
			className="w-full max-w-xs h-14 text-md bg-white text-gray-700 rounded-full py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6"
			type="button"
			onClick={() => {
				window.location.href = redirectUrl;
			}}
		>
			<GoogleIcon className="md" />
			{title}
		</Button>
	);
}
