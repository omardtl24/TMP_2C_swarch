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
    const [eventResponse, expensesResponse, participantsResponse] = await Promise.all([
        fetchEventDetail(id),
        fetchEventExpenses(id),
        participantsEvent(id)
    ]);

    // If the main event details fail to load, show a 404 page.
    if (!eventResponse.success || !eventResponse.data) {
        console.error("Failed to fetch event:", eventResponse.error);
        notFound();
    }

    // Prepare the data with safe fallbacks to prevent errors if API calls fail.
    const eventDetails = eventResponse.data;
    const expenses = expensesResponse.success ? expensesResponse.data || [] : [];
    const participants = participantsResponse.success ? participantsResponse.data || [] : [];

    // Create the 'participantsWithBalances' array required by the 'EventTabs' component.
    // A default balance of 0 is added to each participant.
    // We should fetch the actual balances from the API, but for now, we initialize them to 0.
    // This is a temporary solution until the backend provides balance data.
    const participantsWithBalances = participants.map(p => ({
        ...p,       // Copies participant_id and participant_name
        balance: 0, // Adds the required 'balance' property
    }));

    return (
        <div className="w-full h-full">
            <EventHeader
                name={eventDetails.name}
                creatorId={eventDetails.creator_id}
                code={eventDetails.invitation_code}
                eventId={eventDetails.id}
                total={eventDetails.total_expense}
                balance={eventDetails.my_balance}
                // Pass the full participants list to the header for it to find the creator's name.
                participants={participants}
            />
            <div className="px-4 md:px-16 mt-4 space-y-4 ">
                <EventTabs
                    expenses={expenses}
                    participantsWithBalances={participantsWithBalances}
                    eventId={eventDetails.id}
                />
            </div>
        </div>
    )
}