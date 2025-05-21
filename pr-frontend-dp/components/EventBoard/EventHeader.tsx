'use client'

import EventBalance from "./EventBalance"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { ChangeInvitationState } from "@/lib/actions/eventActions"
import { Switch } from "../ui/switch"

type EventHeaderProps = {
    name: string
    creatorName: string
    code: string | null
    eventId: string

}

  const totalExpense = 10000

  // Mock user balance
  const userBalance = 100000

export default function EventHeader({ name, creatorName, code, eventId }: EventHeaderProps) {
    const [checked, setChecked] = useState(code === null ? false : true)

    const handleCheckedChange = async (newState: boolean) => {
        try {
            // Call API with the new state
            const response = await ChangeInvitationState(newState, eventId)
            
            if (response.success) {
                // Update local state to match new state
                setChecked(newState)
            } else {
                console.error("Error changing invitation state:", response.error)
            }
        } catch (error) {
            console.error("Failed to change invitation state:", error)
        }
    }
    
    return (
        <div className="w-full h-56 md:52 bg-linear-to-b from-primary-50 to-surface-95  flex flex-col md:flex-row  md:justify-between items-start p-4 pt-6 md:p-12 md:pt-8 rounded-b-lg ">
            <div className="text-white flex flex-col gap-2 flex-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm font-semibold">Creado por: <span className="text-primary-20">{creatorName}</span></p>
                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm font-semibold bg-primary-50 rounded-md p-1">Codigo de invitacion: <span className="text-primary-20 ">{code}</span></p>
                    
                    {/* Properly styled Switch component */}
                    <div className="flex items-center">
                        <Switch 
                            id="switchInvitation" 
                            checked={checked} 
                            onCheckedChange={handleCheckedChange}
                           
                        >
                            <span 
                                className="pointer-events-none block h-[20px] w-[20px] rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                            />
                        </Switch>
                        <Label className="text-sm font-semibold text-white ml-2" htmlFor="switchInvitation">
                            {checked ? 'Activo' : 'Inactivo'}
                        </Label>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex justify-between items-center gap-2 w-full md:flex-1 md:flex-col md:gap-2">
              <EventBalance totalExpense={totalExpense} userBalance={userBalance} />
            </div>
        </div>
    )
}
