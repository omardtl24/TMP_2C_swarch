"use client"

import CuentasClarasIcon from "@/components/Icons/CuentasClarasIcon"
import RegisterLoginButton from "@/components/Register/RegisterLoginButton"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"

export default function LoginPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const codigo = searchParams.get("codigo") || ""

	// Construir callbackUrl con el código si existe


	return (
		<div className="h-full flex flex-col md:flex-row">

			<div className="flex-1 bg-[url('/images/background_image_login.png')] bg-cover bg-center h-1/2 md:h-full md:w-1/2 rounded-b-md md:rounded-none mb-4 w-full flex flex-col justify-center items-center">

				<div className="w-auto m-5 md:m-10 rounded-xl bg-white/60 md:h-2/5 backdrop-blur-[10px] p-6 mb-6 flex flex-col gap-4">
					<h1 className="text-3xl md:text-4xl font-light text-primary-20 mb-2">
						Que bueno verte de nuevo, <span className="text-primary-40 font-semibold">bienvenido</span>
					</h1>

					<p className="text-sm md:text-md mb-4">
						Entra a tu cuenta y mira tus gastos personales y los de tus eventos sin complicaciones. <br />

					</p>
				</div>

			</div>

			<div className="flex-1 flex justify-center flex-col  items-center">
				{/* Texto principal */}
				<h2 className="text-xl font-medium text-primary-50 mb-8">Entra a tu cuenta</h2>

				{/* Botón de Google */}
				 <RegisterLoginButton callbackUrl="/" title="Ingresa con Google"/>

				{/* Mensaje condicional o enlace de registro lo dejare hasta que se defina que ser hara con lo del codigo*/}
				{codigo ? (
					<div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-900 text-center max-w-md">
						<strong>Nota:</strong> Si intentas iniciar sesión y{" "}
						<span className="font-semibold">no estás registrado</span>, <br />
						<span className="font-semibold">no podremos completar el proceso automático con el código</span>
						.<br />
						Por favor,{" "}
						<span className="font-semibold">
							ve directamente a{" "}
							<button
								className="underline text-blue-700 hover:text-blue-900 inline"
								type="button"
								onClick={() => {
									let url = "/register"
									if (codigo) url += `?codigo=${encodeURIComponent(codigo)}`
									router.push(url)
								}}
							>
								registro
							</button>
						</span>{" "}
						para usar tu código de invitación.
					</div>
				) : (
					<Button
						className="text-primary-60 hover:text-primary-20 transition underline-offset-none font-medium"
						variant={"link"}
						onClick={() => router.push("/register")}
					>
						¿No tienes cuenta? Regístrate
					</Button>
				)}
				<CuentasClarasIcon size="lg" className="mt-10"/>
			</div>



		</div>
	)
}
