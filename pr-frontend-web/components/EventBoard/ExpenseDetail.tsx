import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,

} from "@/components/ui/sheet"
import { ExpenseDetailedType } from '@/lib/types'


interface ExpenseDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expenseData: ExpenseDetailedType;
}

const ExpenseDetail = ({open, onOpenChange, expenseData}:ExpenseDetailProps) => {

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when done.
                    </SheetDescription>
                </SheetHeader>
                {expenseData.participation.map((participation) => (
                    <><div className="grid grid-cols-4 items-center gap-4">

                        {participation.user_id}

                    </div><div className="grid grid-cols-4 items-center gap-4">


                    </div></>
                ))}
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        
                            Name
                        
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        
                            Username
                        
                    </div>
                </div>
               
            </SheetContent>
        </Sheet>
    )
}

export default ExpenseDetail