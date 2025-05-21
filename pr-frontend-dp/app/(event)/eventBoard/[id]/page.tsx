import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import { 
    fetchEventDetail
} from "@/lib/actions/eventActions"
import { fetchEventExpenses, fetchEventParticipants } from "@/lib/actions/expenseActions"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"

// Force server-side rendering for this page
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
    params,
}: {
    params: { id: string }
}) {
    // Get auth token for authenticated requests
    const {id} = await params
    
    // Fetch the specific event using the ID from the route params
    const eventResponse = await fetchEventDetail(id);

    // Handle error states appropriately
    if (!eventResponse.success || !eventResponse.data) {
        notFound();
    }

    const eventDetails = eventResponse.data;

    // Fetch expenses for this event using GraphQL
    const expensesResponse = await fetchEventExpenses(id );
    const expenses = expensesResponse.success ? expensesResponse.data || [] : [];

    // Fetch participants already formatted for UI
    const participantsResponse = await fetchEventParticipants(id );
    const participants = participantsResponse.success ? participantsResponse.data || [] : [];

    return (
        <div className="w-full h-full">
            <EventHeader 
                name={eventDetails.name} 
                creatorName={eventDetails.creatorId} 
                code={eventDetails.invitationCode} 
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs 
                    expenses={expenses} 
                    participants={participants} 
                    eventId={eventDetails.id} 
                />
            </div>
        </div>
    )
}
