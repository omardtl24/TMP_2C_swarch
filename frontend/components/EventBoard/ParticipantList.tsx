import { ParticipantType } from "@/lib/types"
import Participant from "./Participant"


type ParticipantsListProps = {
  participants: ParticipantType[]
}

export default function ParticipantList({ participants }: ParticipantsListProps) {
    const session ={id: "1", name: "Juan", email: ""} // momentaneo
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {participants.map((participant) => (

        <Participant 
          participant={participant}
          key={participant.id} 
          userId={session?.id}
          /> 
        
      ))}
    </div>
  )
}
