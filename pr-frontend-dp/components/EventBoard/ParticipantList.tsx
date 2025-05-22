import { ParticipantBalance } from "@/lib/types"
import Participant from "./Participant"


type ParticipantsListProps = {
  BalanceParticipants: ParticipantBalance[] | undefined;
}

export default function ParticipantList({ BalanceParticipants }: ParticipantsListProps) {
   
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">

      {BalanceParticipants && BalanceParticipants.map((participant) => (
        <Participant 
          key={participant.userId}
          participant={participant}
          /> 
      ))}

    </div>
  )
}
