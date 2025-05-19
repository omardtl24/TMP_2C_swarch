import { fetchEventDetail, fetchEvents } from '@/lib/actions/eventActions'
import { notFound } from 'next/navigation'

// This function generates all the possible paths at build time
export async function generateStaticParams() {
  const events = await fetchEvents()
   
  if (!events.success || !events.data) {
    // If API fails during build, log but continue with empty array
    console.error('Failed to fetch events for static generation:', events.error)
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
  
  return (
    <div className="event-detail-container p-6">
    <h1>{eventDetails.id}</h1>
    </div>
  )
}