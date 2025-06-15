import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,

} from "@/components/ui/sheet"
import { ExpenseDetailedType, ParticipantType } from '@/lib/types'


interface ExpenseDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expenseData: ExpenseDetailedType;
    participants: ParticipantType[];
}

const ExpenseDetail = ({open, onOpenChange, expenseData, participants}:ExpenseDetailProps) => {

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalles del gasto</SheetTitle>
                    <SheetDescription>
                        {/* Puedes personalizar o eliminar esta descripción */}
                    </SheetDescription>
                </SheetHeader>
                <div className="mb-4">
                    <div className="font-semibold text-lg">{expenseData.concept}</div>
                    <div className="text-sm text-gray-600 mb-1">Tipo: <span className="font-medium">{expenseData.type}</span></div>
                    <div className="text-sm text-gray-600 mb-1">Total: <span className="font-medium">${expenseData.total.toLocaleString('es-CO')}</span></div>
                    <div className="text-sm text-gray-600 mb-1">Pagado por: <span className="font-medium">{expenseData.payer_name}</span></div>
                </div>
                <div>
                    <div className="font-semibold mb-2">Participantes</div>
                    <div className="space-y-2">
                        {expenseData.participation.map((participation) => {
                            const participant = participants.find(p => p.participant_id === participation.user_id);
                            return (
                                <div key={participation.user_id} className="flex justify-between items-center border-b pb-1">
                                    <span>{participant ? participant.participant_name : participation.user_id}</span>
                                    <span className="text-xs text-gray-500">{participation.state === 1 ? 'Pagado' : 'Pendiente'}</span>
                                    <span className="text-xs">${participation.portion.toLocaleString('es-CO')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )   
}

export default ExpenseDetail