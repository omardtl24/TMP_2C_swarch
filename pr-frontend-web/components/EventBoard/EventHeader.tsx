'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/contexts/SessionContext"
import { ChangeInvitationState, deleteEvent } from "@/lib/actions/eventActions"
import { ParticipantType } from "@/lib/types"

import EventBalance from "./EventBalance"
import { Label } from "../ui/label"
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

type EventHeaderProps = {
    name: string
    creatorId: string
    code: string | null
    eventId: string
    total: number | undefined
    balance: number | undefined
    participants: ParticipantType[];
}

export default function EventHeader({ name, creatorId, code, eventId, total, balance, participants }: EventHeaderProps) {
    const [checked, setChecked] = useState(code !== null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { session, isLoading } = useSession();

    const isCreator = !isLoading && session?.id === creatorId;

    // By adding (participants || []), we prevent the error if the prop is undefined.
    const creatorName = (participants || []).find(p => p.participant_id === creatorId)?.participant_name || creatorId;

    const handleCheckedChange = async (newState: boolean) => {
        const response = await ChangeInvitationState(newState, eventId);
        if (response.success) {
            setChecked(newState);
        } else {
            console.error("Error changing invitation state:", response.error);
        }
    };

    const handleDeleteEvent = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteEvent(eventId);
            if (response.success) {
                router.push('/eventBoard');
            } else {
                console.error("Error deleting event:", response.error);
            }
        } catch (error) {
            console.error("Failed to delete event:", error);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="w-full h-56 md:52 bg-gradient-to-b from-primary to-background flex flex-col md:flex-row md:justify-between items-start p-4 pt-6 md:p-12 md:pt-8 rounded-b-lg">
            <div className="text-white flex flex-col gap-2 flex-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm font-semibold">Creado por: <span className="text-primary-foreground/80">{creatorName}</span></p>

                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm font-semibold bg-primary/20 rounded-md p-1 px-2">Código: <span className="font-mono">{code || 'N/A'}</span></p>

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

                {!isLoading && isCreator && (
                    <div className="mt-4">
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            Eliminar Evento
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-4 md:mt-0">
                <EventBalance totalExpense={total} userBalance={balance} />
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro que deseas eliminar el evento &quot;{name}&quot;? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDeleteEvent} disabled={isDeleting}>
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}