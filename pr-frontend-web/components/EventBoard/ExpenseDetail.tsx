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
                        Make changes to your profile here. Click save when done.
                    </SheetDescription>
                </SheetHeader>
                {expenseData.participation.map((participation) => {
                    const participant = participants.find(p => p.participant_id === participation.user_id);
                    return (
                        <div key={participation.user_id} className="gap-4">
                            <span>{participant ? participant.participant_name : participation.user_id}</span>
                            
                        </div>
                    );
                })}
               
            </SheetContent>
        </Sheet>
    )   
}

export default ExpenseDetail