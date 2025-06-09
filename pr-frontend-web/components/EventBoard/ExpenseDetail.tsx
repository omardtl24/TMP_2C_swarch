import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,

} from "@/components/ui/sheet"

interface ExpenseDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    idExpense: string;
}

const ExpenseDetail = ({open, onOpenChange,idExpense}:ExpenseDetailProps) => {

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when done.{idExpense}
                    </SheetDescription>
                </SheetHeader>
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