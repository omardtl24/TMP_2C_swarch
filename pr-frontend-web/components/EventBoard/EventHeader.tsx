'use client'

import EventBalance from "./EventBalance"
import { Label } from "@radix-ui/react-label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChangeInvitationState, deleteEvent } from "@/lib/actions/eventActions"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "@/contexts/SessionContext"
import { ParticipantBalance } from "@/lib/types"

type EventHeaderProps = {
    name: string
    creatorId: string
    code: string | null
    eventId: string
    total:number | undefined
    balance: ParticipantBalance[] | undefined
}



export default function EventHeader({ name, creatorId, code, eventId, total, balance }: EventHeaderProps) {
    const [checked, setChecked] = useState(code === null ? false : true)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const [userBalance, setUserBalance] = useState<number|undefined>(undefined)
    
    // Use a local state to store the session ID for more reliable access
    const [userId, setUserId] = useState<string | undefined>(undefined)
    
    // Get session with better error handling
    const sessionData = useSession()
    const session = sessionData?.session
    const isSessionLoading = sessionData?.isLoading || false
    
    // First effect to safely extract and store the user ID when session is available
    useEffect(() => {
        if (!isSessionLoading && session && session.id) {
            console.log("Session loaded successfully. User ID:", session.id)
            setUserId(session.id)
        } else if (!isSessionLoading) {
            console.warn("Session loaded but ID is missing. Full session:", session)
        }
    }, [session, isSessionLoading])
    
    // Now use the local userId state for operations
    useEffect(() => {
        async function checkCreator() {
            try {
                // Set loading state and creator status
                if (!userId) {
                    console.warn("User ID is still undefined - can't check creator status")
                    setIsCreator(false)
                    setIsLoading(false)
                    return
                }
                
                console.log("Comparing User ID:", userId, "with Creator ID:", creatorId)
                setIsCreator(userId === creatorId)
                
                // Find the balance for the current user
                if (balance && balance.length > 0) {
                    console.log("Searching for balance with user ID:", userId)
                    console.log("Available balances:", balance)
                    
                    const currentUserBalance = balance.find(
                        (participant) => participant.userId === userId
                    )?.balance
                    
                    console.log("Found balance:", currentUserBalance, "for user ID:", userId)
                    setUserBalance(currentUserBalance)
                }
            } catch (error) {
                console.error("Error checking creator status:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        checkCreator()
    }, [userId, creatorId, balance]) 
    
    // Add a separate effect to log the updated balance
    useEffect(() => {
        console.log("User balance updated:", userBalance)
    }, [userBalance])
    
    const handleCheckedChange = async (newState: boolean) => {
        try {
            const response = await ChangeInvitationState(newState, eventId)
            
            if (response.success) {
                setChecked(newState)
            } else {
                console.error("Error changing invitation state:", response.error)
            }
        } catch (error) {
            console.error("Failed to change invitation state:", error)
        }
    }
    
    const handleDeleteEvent = async () => {
        try {
            setIsDeleting(true)
            const response = await deleteEvent(eventId)
            
            if (response.success) {
                router.push('/eventBoard')
            } else {
                console.error("Error deleting event:", response.error)
            }
        } catch (error) {
            console.error("Failed to delete event:", error)
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }
    
    return (
        <div className="w-full h-56 md:52 bg-linear-to-b from-primary-50 to-surface-95 flex flex-col md:flex-row md:justify-between items-start p-4 pt-6 md:p-12 md:pt-8 rounded-b-lg">
            <div className="text-white flex flex-col gap-2 flex-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm font-semibold">Creado por: <span className="text-primary-20">{creatorId}</span></p>
                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm font-semibold bg-primary-50 rounded-md p-1">Codigo de invitacion: <span className="text-primary-20">{code}</span></p>
                    
                    {/* Only show the switch for the creator */}
                    {!isLoading && isCreator && (
                        <div className="flex items-center">
                            <Switch 
                                id="switchInvitation" 
                                checked={checked} 
                                onCheckedChange={handleCheckedChange}
                            />
                            <Label className="text-sm font-semibold text-white ml-2" htmlFor="switchInvitation">
                                {checked ? 'Activo' : 'Inactivo'}
                            </Label>
                        </div>
                    )}
                </div>
                
                {/* Only show delete button for the creator */}
                {!isLoading && isCreator && (
                    <div className="mt-4">
                        <Button 
                            variant="destructive" 
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar Evento
                        </Button>
                    </div>
                )}
            </div>
            
            <div className="mt-4 md:mt-0 flex justify-between items-center gap-2 w-full md:flex-1 md:flex-col md:gap-2">
                <EventBalance totalExpense={total} userBalance={userBalance} />
            </div>
            
            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro que deseas eliminar el evento &quot;{name}&quot;? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteEvent}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
