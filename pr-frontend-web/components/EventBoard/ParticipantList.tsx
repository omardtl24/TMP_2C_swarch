import { ParticipantType } from "@/lib/types";
import Participant from "./Participant";

// The props are updated to expect an array of participants that includes balance data.
type ParticipantsListProps = {
  participantsWithBalances: (ParticipantType & { balance: number; })[];
};

export default function ParticipantList({ participantsWithBalances }: ParticipantsListProps) {
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {/* It now maps over the new prop and passes the complete object (including balance) 
          to each child Participant component.
      */}
      {participantsWithBalances.map((p) => (
        <Participant
          key={p.participant_id}
          participant={p}
        />
      ))}
    </div>
  );
}