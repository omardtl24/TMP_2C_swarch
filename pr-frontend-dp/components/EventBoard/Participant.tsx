"use client"

import { ParticipantBalance } from "@/lib/types"
import {CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"



type ParticipantProps = {
  participant: ParticipantBalance
}

export default function Participant({ participant }: ParticipantProps) {
  // Determine if the balance is positive (credit) or negative (debt)
  const isDebt = participant.balance < 0
  
  // Format the amount, remove negative sign
  const formattedAmount = new Intl.NumberFormat("es-CO").format(Math.abs(participant.balance))
  
  // Create status text and styling based on balance
  const statusText = isDebt ? "debe" : "se le debe"
  const statusColor = isDebt ? "text-red-600" : "text-green-600"

  return (
    <div className="bg-[#F6EEFF] rounded-xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-[#8653FF]">
          <CreditCard size={24} />
        </div>
        <div className="flex flex-row  gap-4">

          <p className="text-[#8653FF] font-bold">{participant.userId}</p>
          <div className={cn("flex items-center gap-1", statusColor)}>
            <span className="text-xs font-bold">
              {statusText} ${formattedAmount}
            </span>
           
          </div>
        </div>
      </div>
    </div>
  )
}
