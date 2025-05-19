type Participant = {
  id: string
  name: string
  balance: number
}

type ParticipantsListProps = {
  participants: Participant[]
}

export default function ParticipantList({ participants }: ParticipantsListProps) {
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {participants.map((participant) => (
        <div key={participant.id} className="border-2 border-[#E9DDFF] rounded-xl p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#3A0092] font-medium">{participant.name}</p>
            </div>
            <span className={`font-bold ${participant.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {participant.balance >= 0 ? "+" : ""}$
              {new Intl.NumberFormat("es-CO").format(Math.abs(participant.balance))}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
