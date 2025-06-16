"use client"

import { ParticipantType } from "@/lib/types";
import { CreditCard } from "lucide-react";

type ParticipantProps = {
  participant: ParticipantType;
};

export default function Participant({ participant }: ParticipantProps) {
  return (
    <div className="bg-[#F6EEFF] rounded-xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-[#8653FF]">
          <CreditCard size={24} />
        </div>
        <div className="flex flex-col items-start">
          {/* Display the participant's name */}
          <p className="text-gray-800 font-semibold">{participant.participant_name}</p>
        </div>
      </div>
    </div>
  );
}