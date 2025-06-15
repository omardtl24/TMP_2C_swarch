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

export default async function personalExpensesPage() {

    return (
        <div className="w-full h-full">
            
        </div>
    )
}