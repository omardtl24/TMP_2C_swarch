"use client";

import CuentasClarasIcon from "@/components/Icons/CuentasClarasIcon";
import RegisterLoginButton from "@/components/Register/RegisterLoginButton";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const error = searchParams.get("error") || "";

	function getErrorMessage(error: string) {
		switch (error) {
			case "oauth2":
				return "Hubo un problema al iniciar sesión con Google. Intenta de nuevo o contacta soporte.";
			case "csrf":
				return "Por seguridad, tu sesión de Google expiró o fue manipulada. Intenta iniciar sesión nuevamente.";
			case "oauth":
				return "No se pudo completar el inicio de sesión con Google. Intenta de nuevo.";
			case "invalid_credentials":
				return "Correo o contraseña incorrectos.";
			case "user_not_found":
				return "No existe una cuenta asociada a ese correo.";
			case "account_disabled":
				return "Tu cuenta está deshabilitada. Contacta soporte.";
			default:
				return null;
		}
	}

	const errorMessage = getErrorMessage(error);

	return (
		<div className="h-full flex flex-col md:flex-row">
			<div className="flex-1 bg-[url('/images/background_image_login.png')] bg-cover bg-center h-1/2 md:h-full md:w-1/2 rounded-b-md md:rounded-none mb-4 w-full flex flex-col justify-center items-center">
				<div className="w-auto m-5 md:m-10 rounded-xl bg-white/60 md:h-2/5 backdrop-blur-[10px] p-6 mb-6 flex flex-col gap-4">
					<h1 className="text-3xl md:text-4xl font-light text-primary-20 mb-2">
						Que bueno verte de nuevo,{" "}
						<span className="text-primary-40 font-semibold">bienvenido</span>
					</h1>

					<p className="text-sm md:text-md mb-4">
						Entra a tu cuenta y mira tus gastos personales y los de tus eventos
						sin complicaciones. <br />
					</p>
				</div>
			</div>

			<div className="flex-1 flex justify-center flex-col  items-center">
				{/* Texto principal */}
				<h2 className="text-xl font-medium text-primary-50 mb-8">
					Entra a tu cuenta
				</h2>

				{/* Mensaje de error OAuth2 y otros */}
				{errorMessage && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-900 text-center max-w-md">
						<strong>Error:</strong> {errorMessage}
					</div>
				)}

				{/* Botón de Google */}
				<RegisterLoginButton title="Ingresa con Google" />

				<Button
					className="text-primary-60 hover:text-primary-20 transition underline-offset-none font-medium"
					variant={"link"}
					onClick={() => router.push("/register")}
				>
					¿No tienes cuenta? Regístrate
				</Button>
				<CuentasClarasIcon size="lg" className="mt-10" />
			</div>
		</div>
	);
}
