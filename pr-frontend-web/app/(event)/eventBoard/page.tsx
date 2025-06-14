"use client";

import { useState, useEffect } from "react";
import CustomCalendar from "@/components/EventBoard/CustomCalendar";
import { fetchEvents } from "@/lib/actions/eventActions";
import Event from "@/components/EventBoard/Event";
import { AlertCircle } from "lucide-react";
import RetryButton from "@/components/RetryButton"; 
import InputCodeEvent from "@/components/EventBoard/InputCodeEvent";
import { EventsResponse } from "@/lib/actions/eventActions";
import { useRequireSession } from "@/lib/hooks/useRequireSession";
import Loading  from "@/components/Loading";

// Define the interface for calendar events
export interface EventItem {
    date: Date;
    name: string;
    id: string;
}

export default function EventBoard() {
    const [eventsResponse, setEventsResponse] = useState<EventsResponse>({ success: 'success', data: [] });
    const [isLoading, setIsLoading] = useState(true);
    const { session } = useRequireSession()

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            const response = await fetchEvents();
            setEventsResponse(response);
            setIsLoading(false);
        };
        loadEvents();
    }, []);

    const calendarEvents: EventItem[] = eventsResponse.success && eventsResponse.data
        ? eventsResponse.data.map(event => ({
            id: event.id,
            name: event.name,
            date: new Date(event.begin_date)
        }))
        : [];

    if (isLoading) return <Loading message="Cargando Eventos..."/>;

    return (
        <div className="w-full h-full flex flex-col p-4 md:px-12 md:py-6">
            <div>
                <h2 className="text-3xl font-semibold">Bienvenido <span className="text-primary">{session?.username}</span></h2>
                <p className="text-gray-700 text-sm">Mira y crea los eventos que tienes con tus amigos para que dividan sus gastos rapido y sin complicaciones</p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-10">
                <div className="flex flex-col w-full md:flex-1 ">
                    <CustomCalendar events={calendarEvents} />
                </div>

                <div className="flex flex-col w-full md:flex-1 ">
                    <h3 className="text-primary-20 text-2xl font-semibold">Eventos</h3>
                    <p className="text-gray-700 text-sm"> Ingresa el codigo del evento de un amigo y unete al parche!</p>
                    <InputCodeEvent />
                    <div className="mt-4">
                        {!eventsResponse.success ? (
                            <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
                                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                                <h3 className="text-lg font-semibold text-destructive mb-1">Error al cargar eventos</h3>
                                <p className="text-gray-700 text-sm mb-4">
                                    {eventsResponse.error || "Ha ocurrido un error al cargar los eventos recientes."}
                                </p>
                                {/* 2. Use your custom RetryButton component here */}
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