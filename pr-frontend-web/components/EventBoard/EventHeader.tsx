'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/contexts/SessionContext"
import { changeInvitationState, deleteEvent } from "@/lib/actions/eventActions"
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
    event: import("@/lib/types").EventDetailType;
    participants: ParticipantType[];
};

export default function EventHeader({ event, participants }: EventHeaderProps) {
    const {
        name,
        creator_id,
        invitation_code,
        id,
        total_expense,
        my_balance,
        invitation_enabled,
        begin_date,
        end_date,
        description,
    } = event;
    // El switch depende de invitation_enabled si está presente, si no, usa invitation_code !== null
    const [checked, setChecked] = useState(
        typeof invitation_enabled === 'boolean' ? invitation_enabled : invitation_code !== null
    );
    const [eventCode, setEventCode] = useState(invitation_code);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { session, isLoading } = useSession();
    const isCreator = String(session?.id) === String(creator_id);
    const creatorName = (participants || []).find(p => p.participant_id === creator_id)?.participant_name || creator_id;

    const handleCheckedChange = async (newState: boolean) => {
        try {
            setChecked(newState); // Optimistic UI
            if (!newState) setEventCode(null); // Si se desactiva, quita el código
            const response = await changeInvitationState(newState, id);
            if (typeof response.enabled === 'boolean') {
                setChecked(response.enabled);
                setEventCode(response.code ?? null); // Actualiza el código si lo hay
            }
        } catch (error) {
            setChecked(!newState); // Revierte si falla
            console.error("Error changing invitation state:", error);
        }
    };

    const handleDeleteEvent = async () => {
        setIsDeleting(true);
        try {
            await deleteEvent(id);
            router.push('/eventBoard');
        } catch (error) {
            console.error("Failed to delete event:", error);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="w-full h-70 md:52 bg-gradient-to-b from-primary to-background flex flex-col md:flex-row md:justify-between items-start p-4 pt-6 md:p-12 md:pt-8 rounded-b-lg">
            <div className="text-white flex flex-col gap-2 flex-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                {description && (
                  <p className="text-base text-white/90 mb-1">{description}</p>
                )}
                <div className="flex flex-row gap-4 mb-1">
                  {begin_date && (
                    <span className="text-xs text-white/70">Inicio: {typeof begin_date === 'string' ? begin_date : begin_date.toLocaleString()}</span>
                  )}
                  {end_date && (
                    <span className="text-xs text-white/70">Fin: {typeof end_date === 'string' ? end_date : end_date.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm font-semibold">Creado por: <span className="text-primary-foreground/80">{creatorName}</span></p>

                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm font-semibold bg-primary/20 rounded-md p-1 px-2">Código: <span className="font-mono">{eventCode || 'N/A'}</span></p>

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
                <EventBalance totalExpense={total_expense} userBalance={my_balance} />
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