import { EventType } from "@/lib/types"
import { Calendar } from "lucide-react"
import Link from "next/link"

const Event = ({ event }: { event: EventType }) => {
    return (
        <Link
            href={`/eventBoard/${event.id}`}
            className="flex items-center w-full bg-primary-90 rounded-lg p-4 mb-4 hover:bg-primary-80 transition duration-300 ease-in-out hover:cursor-pointer">
            {/* Vertical bar */}
            <div className="w-[2px] h-12 bg-primary rounded-full mr-3"></div>
            <div className="bg-primary p-1 size-10 flex justify-center items-center rounded-full mr-4">
                <Calendar className="text-white size-6" />
            </div>
            <div className="flex-1">
                <h3 className="text-md font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
            </div>
            {/* <div className="text-red-500 text-xl font-bold">
                    ${event.balance}
                </div> */}
        </Link>
    )
}

export default Event