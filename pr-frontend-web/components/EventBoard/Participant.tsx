"use client"

import { ParticipantType } from "@/lib/types";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

type ParticipantProps = {
  // The prop now expects the 'balance' property alongside the participant info.
  participant: ParticipantType & { balance: number; };
};

export default function Participant({ participant }: ParticipantProps) {
  // Determine if the balance is positive (credit) or negative (debt)
  const isDebt = participant.balance < 0;

  // Format the amount, removing any negative sign for display
  const formattedAmount = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(participant.balance));

  // Create status text and styling based on the balance
  const statusText = isDebt ? "Debe" : "Se le debe";
  const statusColor = isDebt ? "text-red-500" : "text-green-600";

  return (
    <div className="bg-[#F6EEFF] rounded-xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-[#8653FF]">
          <CreditCard size={24} />
        </div>
        <div className="flex flex-col items-start">
          {/* Display the participant's name */}
          <p className="text-gray-800 font-semibold">{participant.participant_name}</p>
          
          {/* Display the balance status and amount with conditional coloring */}
          <div className={cn("flex items-center gap-1", statusColor)}>
            <span className="text-sm font-medium">
              {statusText} {formattedAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}