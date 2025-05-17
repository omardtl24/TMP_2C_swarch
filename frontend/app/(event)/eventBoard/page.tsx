import CustomCalendar  from "@/components/EventBoard/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";


export default function EventBoard() {
  return (
    <div className="w-full h-full flex flex-col ">

      <div>
        <h2 className="text-3xl font-semibold">Bienvenido <span className="text-primary">{"nombreUsuaario"}</span></h2>
        <p className="text-gray-700 text-sm">Mira y crea los eventos que tienes con tus amigos para que dividas tus gatos rapido y sin complicaciones</p>

      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:flex-1 ">
          <div>
            <h3 className="text-primary-20 mt-4 text-2xl font-semibold">Eventos</h3>
            <p className="text-gray-700 text-sm">	Ingresa el codigo del evento de un amigo y unite a el</p>
            <div className="flex flex-row items-center mt-4 gap-2 mb-4  ">
              <Input
                type="text" />
              <Button>Unirme</Button>
            </div>
            <CustomCalendar events={[]} />
          </div>


        </div>

        <div className="flex flex-col w-full md:flex-1 ">
          <h3 className="text-primary-20 mt-4 text-2xl font-semibold">Eventos Recientes</h3>
        <Calendar/>
        </div>
      </div>
      

    </div>
  );
}