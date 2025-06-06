import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import { 
    fetchEventDetail,
    participantsEvent
} from "@/lib/actions/eventActions"
//import { fetchEventBalances, fetchEventExpenses, getSumExpensesByEvent } from "@/lib/actions/expenseActions"
import { fetchEventExpenses, fetchExpenseDetail } from "@/lib/actions/expenseActions"
import { notFound } from "next/navigation"

// Force server-side rendering for this page
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
    params,
}: {
    params: { id: string }
}) {
    // Get event ID from route params
    const { id } = params;
    
    // Fetch the specific event using the ID from the route params
    const eventResponse = await fetchEventDetail(id);

    // Handle error states appropriately
    if (!eventResponse.success || !eventResponse.data) {
        console.error("Failed to fetch event:", eventResponse.error);
        notFound();
    }

    const eventDetails = eventResponse.data;

    // Fetch expenses for this event (not) using GraphQL
    const expensesResponse = await fetchEventExpenses(id);
    const expenses = expensesResponse.success ? expensesResponse.data || [] : [];

    // Fetch participants already formatted for UI
    const participantsResponse = await participantsEvent(id);
    const participants = participantsResponse.success ? participantsResponse.data || [] : [];

    //const totalSum = await getSumExpensesByEvent(id);
    //const BalanceParticipants = await fetchEventBalances(id);
    //console.log("Balance participants response:", BalanceParticipants);

    return (
        <div className="w-full h-full">
            <EventHeader 
                name={eventDetails.name} 
                creatorId={eventDetails.creator_id} 
                code={eventDetails.invitation_code} 
                eventId={eventDetails.id}
                total={eventDetails.total_expense}
                balance={eventDetails.my_balance}
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs 
                    expenses={expenses} 
                    BalanceParticipants={eventDetails.my_balance} 
                    eventId={eventDetails.id} 
                    participants={participants}
                />
            </div>
        </div>
    )
}
