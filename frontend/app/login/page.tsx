import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="w-[1433px] h-[1024px] pl-72 pr-[600px] py-40 bg-zinc-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-1 outline-offset-[-1px] outline-black inline-flex justify-start items-center gap-2.5">
        <div className="w-[550px] h-[700px] max-w-[600px] min-w-[550px] max-h-[800px] min-h-[700px] px-5 py-12 bg-red-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-1 outline-offset-[-1px] outline-black inline-flex flex-col justify-center items-center gap-5">
          <Image className="w-96 h-96" src="https://placehold.co/400x400" alt="placeholder" width={400} height={400} />
          <div className="text-center justify-start text-black text-4xl font-normal font-['Inter'] leading-none tracking-wide">Login</div>
          <div data-configuration="Label only" data-selected="False" data-show-closing-icon="false" data-state="Enabled" className="self-stretch bg-white rounded-lg outline-1 outline-offset-[-1px] outline-Schemes-Outline-Variant inline-flex justify-center items-center overflow-hidden">
            <div className="px-3 py-1.5 flex justify-center items-center gap-2">
              <div className="text-center justify-center text-Schemes-On-Surface-Variant text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Correo Electrónico</div>
            </div>
          </div>
          <div data-configuration="Label only" data-selected="False" data-show-closing-icon="false" data-state="Enabled" className="self-stretch bg-white rounded-lg outline-1 outline-offset-[-1px] outline-Schemes-Outline-Variant inline-flex justify-center items-center overflow-hidden">
            <div className="px-3 py-1.5 flex justify-center items-center gap-2">
              <div className="text-center justify-center text-Schemes-On-Surface-Variant text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Contraseña</div>
            </div>
          </div>
          <div data-show-icon="False" data-state="Enabled" data-style="Filled" className="h-10 bg-Schemes-Primary rounded-[100px] flex flex-col justify-center items-center gap-2 overflow-hidden">
            <div className="self-stretch flex-1 px-6 py-2.5 inline-flex justify-center items-center gap-2">
              <div className="text-center justify-center text-Schemes-On-Primary text-sm font-medium font-['Roboto'] leading-tight tracking-tight">Login</div>
            </div>
          </div>
          <div className="text-center justify-start text-black text-base font-normal font-['Inter'] leading-none tracking-wide">Forgor Password?</div>
          <div className="text-center justify-start text-black text-base font-normal font-['Inter'] leading-none tracking-wide">Create Account</div>
        </div>
      </div>
    );
  }