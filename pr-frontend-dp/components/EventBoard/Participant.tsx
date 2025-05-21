"use client"

import { ParticipantType } from "@/lib/types"
import { CreditCard } from "lucide-react"



type ParticipantProps = {
  participant: ParticipantType
  userId: string | undefined
}

export default function Participant({ participant, userId }: ParticipantProps) {
//   const [isPaid, setIsPaid] = useState(false)
//   const [isConfirmed, setIsConfirmed] = useState(false)

  const isDebtor = userId === participant.debtorId
  const isLender = userId === participant.LenderId

  const formattedAmount = new Intl.NumberFormat("es-CO").format(participant.mount)

//   // Handle payment confirmation
//   const handlePaymentConfirmation = () => {
//     setIsPaid(true)
//     // Here you would typically call an API to update the payment status
//     console.log(`Payment of ${participant.mount} marked as paid`)
//   }

//   // Handle payment confirmation by lender
//   const handleConfirmPayment = () => {
//     setIsConfirmed(true)
//     // Here you would typically call an API to confirm the payment
//     console.log(`Payment of ${participant.mount} confirmed by lender`)
//   }

  return (
    <div className="bg-[#F6EEFF] rounded-xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-[#8653FF]">
          <CreditCard size={24} />
        </div>

        <div>
          {isDebtor ? (
            // Current user is the debtor
            <div>
              <p className="font-medium text-[#3A0092]">{participant.debtorName}</p>
              <p className="text-sm">
                Debes <span className="text-red-500 font-bold">${formattedAmount}</span>{" "}
                <span className="text-[#3A0092]">→</span> {participant.LenderName}
              </p>
            </div>
          ) : isLender ? (
            // Current user is the lender
            <div>
              <p className="font-medium text-[#3A0092]">{participant.debtorName}</p>
              <p className="text-sm">
                Te debe <span className="text-red-500 font-bold">${formattedAmount}</span>
              </p>
            </div>
          ) : (
            // Current user is neither debtor nor lender
            <div>
              <p className="font-medium text-[#3A0092]">{participant.debtorName}</p>
              <p className="text-sm">
                Debe <span className="text-red-500 font-bold">${formattedAmount}</span>{" "}
                <span className="text-[#3A0092]">→</span> {participant.LenderName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* {isDebtor && !isPaid && (
        <Button
          onClick={handlePaymentConfirmation}
          className="bg-[#8653FF] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6E26F5] transition-colors"
        >
          Ya pagué
        </Button>
      )}

      {isDebtor && isPaid && <span className="text-sm text-green-600 font-medium">Pago enviado</span>}

      {isLender && !isConfirmed && (
        <Button
          onClick={handleConfirmPayment}
          className="bg-green-400 text-green-800 px-4 py-2 rounded-lg text-sm hover:bg-green-500 transition-colors"
        >
          Confirmar Pago
        </Button>
      )}

      {isLender && isConfirmed && <span className="text-sm text-green-600 font-medium">Pago confirmado</span>} */}
    </div>
  )
}
