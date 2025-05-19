import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import { 
    fetchEventDetail, 
    fetchEventExpenses, 
    fetchEventParticipants, 
    fetchEvents 
} from "@/lib/actions/eventActions"
import { notFound } from "next/navigation"


// This function generates all the possible paths at build time
export async function generateStaticParams() {
    const events = await fetchEvents()

    if (!events.success || !events.data) {
        // If API fails during build, log but continue with empty array
        console.error("Failed to fetch events for static generation:", events.error)
        return []
    }

    return events.data.map((event) => ({
        id: String(event.id),
    }))
}

export default async function EventDetailPage({
    params,
}: {
    params:Promise<{ id: string }>
}) {
    const {id} = await params
    
    // Fetch the specific event using the ID from the route params
    const eventResponse = await fetchEventDetail(id)

    // Handle error states appropriately
    if (!eventResponse.success || !eventResponse.data) {
        notFound()
    }

    const eventDetails = eventResponse.data

    // Fetch expenses for this event using GraphQL
    const expensesResponse = await fetchEventExpenses(id)
    const expenses = expensesResponse.success ? expensesResponse.data || [] : []

    // Fetch participants already formatted for UI
    const participantsResponse = await fetchEventParticipants(id)
    const participants = participantsResponse.success ? participantsResponse.data || [] : []

    return (
        <div className="w-full h-full">
            <EventHeader 
                name={eventDetails.name} 
                creatorName={eventDetails.creatorId} 
                code={id} 
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs 
                    expenses={expenses} 
                    participants={participants} 
                    eventId={id} 
                />
            </div>
        </div>
    )
}
