import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ExpenseDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idExpense: string;
}

const ExpenseDeleteDialog = ({ open, onOpenChange, idExpense }: ExpenseDeleteDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Eliminar gasto</DialogTitle>
            <DialogDescription>
                ¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.
            </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={() => {
                        open = false
                        onOpenChange(false)
                    }}
                    type="button"
                >
                    Cancelar
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => {
                        open = false
                        onOpenChange(false)
                    }}
                    type="button"
                >
                    Eliminar
                </button>
            </div>
        </DialogContent>
        </Dialog>
    );
}
export default ExpenseDeleteDialog;