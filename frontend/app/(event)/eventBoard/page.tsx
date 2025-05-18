import CustomCalendar from "@/components/EventBoard/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchEvents } from "@/lib/actions/eventActions";
import Event from "@/components/EventBoard/Event";
import { AlertCircle } from "lucide-react";
import RetryButton from "@/components/RetryButton";


// Define the interface for calendar events
export interface EventItem {
  date: Date
  name: string
  id: number
}

export default async function EventBoard() {
  const eventsResponse = await fetchEvents();
 

  // Transform events for the calendar if available
  const calendarEvents: EventItem[] = eventsResponse.success && eventsResponse.data
    ? eventsResponse.data.map(event => ({
      id: event.id,
      name: event.name,
      date: new Date(event.beginDate)
    }))
    : [];

  

  return (
    <div className="w-full h-full flex flex-col ">
      <div>
        <h2 className="text-3xl font-semibold">Bienvenido <span className="text-primary">{"nombreUsuaario"}</span></h2>
        <p className="text-gray-700 text-sm">Mira y crea los eventos que tienes con tus amigos para que dividas tus gatos rapido y sin complicaciones</p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-10">
        <div className="flex flex-col w-full md:flex-1 ">


          <CustomCalendar events={calendarEvents} />

        </div>

        <div className="flex flex-col w-full md:flex-1 ">
          <h3 className="text-primary-20 text-2xl font-semibold">Eventos</h3>

          <p className="text-gray-700 text-sm">	Ingresa el codigo del evento de un amigo y unite a el</p>
          <div className="flex flex-row items-center mt-4 gap-2 mb-4  ">
            <Input type="text" className="max-w-sm" />
            <Button className="w-28 max-w-md: ">Unirme</Button>
          </div>
          <div className="mt-4">
            {!eventsResponse.success ? (
              // Error display only for the Eventos Recientes section
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                <h3 className="text-lg font-semibold text-destructive mb-1">Error al cargar eventos</h3>
                <p className="text-gray-700 text-sm mb-4">
                  {eventsResponse.error || "Ha ocurrido un error al cargar los eventos recientes."}
                </p>
                <RetryButton />
              </div>
            ) : eventsResponse.data && eventsResponse.data.length > 0 ? (
              eventsResponse.data.map((event) => (
                <Event event={event} key={event.id} />
              ))
            ) : (
              <p>No hay eventos recientes</p>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}