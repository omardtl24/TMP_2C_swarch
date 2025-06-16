"use client";
import { useRequireSession } from "@/lib/hooks/useRequireSession";
import CustomCalendar from "@/components/EventBoard/CustomCalendar";
import Event from "@/components/EventBoard/Event";
import InputCodeEvent from "@/components/EventBoard/InputCodeEvent";
import { AlertCircle } from "lucide-react";
import RetryButton from "@/components/RetryButton";
import { EventType } from "@/lib/types";

interface EventBoardClientProps {
  events: EventType[];
  error?: string;
}

export default function EventBoardClient({ events, error }: EventBoardClientProps) {
  const { session } = useRequireSession();

  return (
    <div className="w-full h-full flex flex-col p-4 md:px-12 md:py-6">
      <div>
        <h2 className="text-3xl font-semibold">Bienvenido <span className="text-primary">{session?.username}</span></h2>
        <p className="text-gray-700 text-sm">Mira y crea los eventos que tienes con tus amigos para que dividan sus gastos rápido y sin complicaciones</p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-10">
        <div className="flex flex-col w-full md:flex-1 ">
          <CustomCalendar events={events} />
        </div>
        <div className="flex flex-col w-full md:flex-1 ">
          <h3 className="text-primary-20 text-2xl font-semibold">Eventos</h3>
          <p className="text-gray-700 text-sm"> Ingresa el código del evento de un amigo y únete al parche!</p>
          <InputCodeEvent />
          <div className="mt-4">
            {error ? (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                <h3 className="text-lg font-semibold text-destructive mb-1">Error al cargar eventos</h3>
                <p className="text-gray-700 text-sm mb-4">
                  {error || "Ha ocurrido un error al cargar los eventos recientes."}
                </p>
                <RetryButton />
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <Event event={event} key={event.id} />
              ))
            ) : (
              <p>No hay eventos recientes, crea uno desde el calendario, o únete a uno existente ingresando arriba un código de invitación! </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
