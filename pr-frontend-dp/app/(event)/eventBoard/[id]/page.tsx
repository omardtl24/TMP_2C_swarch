import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import { 
    fetchEventDetail,
    participantsEvent
} from "@/lib/actions/eventActions"
import { fetchEventBalances, fetchEventExpenses } from "@/lib/actions/expenseActions"
import { notFound } from "next/navigation"


// Force server-side rendering for this page
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
    params,
}: {
    params: { id: string }
}) {
    // Get auth token for authenticated requests
    const { id } = await params; // Fixed: Remove unnecessary await
    
    // Fetch the specific event using the ID from the route params
    const eventResponse = await fetchEventDetail(id);

    // Add debugging to see what's happening
    console.log("Event response:", eventResponse);

    // Handle error states appropriately
    if (!eventResponse.success || !eventResponse.data) {
        console.error("Failed to fetch event:", eventResponse.error);
        notFound();
    }

    const eventDetails = eventResponse.data;

    // Fetch expenses for this event using GraphQL
    const expensesResponse = await fetchEventExpenses(id);
    console.log("expenses response:", expensesResponse);
    const expenses = expensesResponse.success ? expensesResponse.data || [] : [];

    // Fetch participants already formatted for UI
    const participantsResponse = await participantsEvent(id);
    const participants = participantsResponse.success ? participantsResponse.data || [] : [];
    //const totalSum = await getSumExpenses(expenses);

    const BalanceParticipants = await fetchEventBalances(id)
    
    return (
        <div className="w-full h-full">
            <EventHeader 
                name={eventDetails.name} 
                creatorId={eventDetails.creatorId} 
                code={eventDetails.invitationCode} 
                eventId={eventDetails.id}
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs 
                    expenses={expenses} 
                    BalanceParticipants={BalanceParticipants} 
                    eventId={eventDetails.id} 
                    participants={participants}
                    
                />
            </div>
        </div>
    )
}
