import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import {
    fetchEventDetail,
    participantsEvent
} from "@/lib/actions/eventActions"
import { fetchEventExpenses } from "@/lib/actions/expenseActions"
import { notFound } from "next/navigation"

// Force this page to be dynamically rendered, ensuring it fetches fresh data on every request.
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
    params,
}: {
    params: { id: string }
}) {
    // Get the event ID from the route parameters.
    const { id } = params;

    // Fetch the event details, expenses, and participants list in parallel for better performance.
    let eventDetails, expenses, participants;
    try {
        [eventDetails, expenses, participants] = await Promise.all([
            fetchEventDetail(id),
            fetchEventExpenses(id),
            participantsEvent(id)
        ]);
        console.log("fetchEventExpenses:", expenses);
    } catch (error) {
        console.error("Failed to fetch event data:", error);
        notFound();
    }

    if (!eventDetails) {
        notFound();
    }

    // Ensure eventDetails has the required properties, using defaults if necessary
    if (eventDetails) {
      eventDetails = {
        ...eventDetails,
        id: eventDetails.id || id, // Usa el id de la ruta si no viene
        name: eventDetails.name || "Evento sin nombre", // Valor por defecto
      };
    }

    return (
        <div className="w-full h-full">
            <EventHeader
                event={eventDetails}
                participants={participants}
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs
                    expenses={expenses || []}
                    participants={participants || []}
                    eventId={eventDetails.id}
                />
            </div>
        </div>
    )
}