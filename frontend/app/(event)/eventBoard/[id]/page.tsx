import EventBalance from "@/components/EventBoard/EventBalance"
import EventHeader from "@/components/EventBoard/EventHeader"
import EventTabs from "@/components/EventBoard/EventTabs"
import { fetchEventDetail, fetchEvents } from "@/lib/actions/eventActions"
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
  params: { id: string }
}) {
  // Fetch the specific event using the ID from the route params
  const response = await fetchEventDetail(params.id)

  // Handle error states appropriately
  if (!response.success || !response.data) {
    // This will trigger the closest error.tsx or not-found.tsx
    notFound()
  }

  const eventDetails = response.data

  // Mock data for expenses since it's not in the provided type
  const expenses = [
    {
      id: 1,
      amount: 200000,
      description: "Cena Italiana",
      category: "Comida",
      paidBy: "Gian Karlo Lanziano",
    },
    {
      id: 2,
      amount: 100000,
      description: "Pola HidraPub",
      category: "Bebida",
      paidBy: "Maria Camila Sanchez",
    },
    {
      id: 3,
      amount: 500000,
      description: "Compra en carulla",
      category: "Fruta",
      paidBy: "Omar David Toledo",
    },
    {
      id: 4,
      amount: 70000,
      description: "Guaro o miedo?",
      category: "Bebida",
      paidBy: "Juan David Palacios",
    },
  ]

  // Mock data for participants
  const participants = [
    {
      id: "1",
      name: "Juan David Palacios",
      balance: 100000,
    },
    {
      id: "2",
      name: "Gian Karlo Lanziano",
      balance: -50000,
    },
    {
      id: "3",
      name: "Maria Camila Sanchez",
      balance: 30000,
    },
    {
      id: "4",
      name: "Omar David Toledo",
      balance: -80000,
    },
  ]

  // Calculate total expense
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Mock user balance
  const userBalance = 100000

  return (
    <div className="min-h-screen bg-[#F6EEFF]">
      <div className="max-w-4xl mx-auto pb-6">
        {/* Header section with event info and financials */}
        <div className="bg-[#8653FF] text-white p-4 md:p-6 rounded-b-3xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <EventHeader name={eventDetails.name} creatorName={eventDetails.creatorId} code={params.id} />

            <div className="mt-4 md:mt-0 flex justify-between gap-2 md:flex-col md:gap-2">
              <EventBalance totalExpense={totalExpense} userBalance={userBalance} />
            </div>
          </div>
        </div>

        {/* Content section with tabs */}
        <div className="px-4 md:px-6 mt-4 space-y-4">
          <EventTabs expenses={expenses} participants={participants} />
        </div>
      </div>
    </div>
  )
}
