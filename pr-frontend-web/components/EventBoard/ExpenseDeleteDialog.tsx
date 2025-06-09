import { useState, useEffect } from "react"
import { deleteExpense } from "@/lib/actions/expenseActions"
import ModalFormBase from "@/components/ModalFormBase"
import { Button } from "@/components/ui/button"

interface ExpenseDeleteDialogProps {
    expenseId: string;
    onExpenseDeleted?: () => void;
    modalId?: string;
    open?: boolean;
    setOpen?: (value: boolean) => void;

}

export default function ExpenseDeleteDialog({
    expenseId,
    onExpenseDeleted,
    modalId = 'deleteExpense',
    open,
    setOpen
}: ExpenseDeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteExpense(expenseId);
            if (response.error || !response.success) {
                throw new Error(response.error || "Error deleting expense");
            }
            // First notify parent of successful deletion
            if (onExpenseDeleted) {
                onExpenseDeleted();
            }
            // Then close dialog
            if (setOpen) {
                setOpen(false);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalFormBase
            id={modalId}
            title="Eliminar gasto"
            description="¿Estás seguro de que deseas eliminar este gasto?"
            open={open}
            setOpen={setOpen}
        >
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => {if(setOpen) setOpen(false)}}
                    disabled={isDeleting}
                >
                    Cancelar
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
            </div>
        </ModalFormBase>
    );
}
