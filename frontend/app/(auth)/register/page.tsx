import { auth } from "@/auth";
import CuentasClarasIcon from "@/components/Icons/CuentasClarasIcon";
import RegisterLoginButton from "@/components/Register/RegisterLoginButton";
import RegisterPageContent from "@/components/Register/RegisterPageContent";


export default async function RegisterPage() {
  // Chequeo de sesión server-side
  const session = await auth();


  // Si no hay sesión, mostrar solo el botón de login
  if (!session) {
    return (
      <div className="h-full flex flex-col md:flex-row">

        <div className="flex-1 bg-[url('/images/background_image_login.png')] bg-cover bg-center h-1/2 md:h-full md:w-1/2 rounded-b-md md:rounded-none mb-4 w-full flex flex-col justify-center items-center">

          <div className="w-auto m-5 md:m-10 rounded-xl bg-white/60 md:h-2/5 backdrop-blur-[10px] p-6 mb-6 flex flex-col gap-4">
            <h1 className="text-3xl font-light text-primary-20 mb-2">
              Regístrate y empieza a tener tus <span className="text-primary-40 font-semibold">cuentas claras</span>
            </h1>

            <p className="text-sm 	 mb-4">
              No te compliques más, accede y controla tus cuentas personales y la de los eventos que realizas con tus
              amigos
            </p>
          </div>

        </div>

        <div className="flex-1 flex justify-center flex-col  items-center text-center">
          {/* Texto principal */}
          <h2 className="text-xl md:text-2xl font-medium text-primary-50 mb-8">Comieza a tener tus Cuentas Claras</h2>

          <RegisterLoginButton callbackUrl="/register" title="Registrate con Google"/>


          <CuentasClarasIcon size="lg" className="mt-10"/>
        </div>



      </div>
    );
  }

  // Si hay sesión, renderizar el formulario cliente
  return <RegisterPageContent session={session} />;
}
