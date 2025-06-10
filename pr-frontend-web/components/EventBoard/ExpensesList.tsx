import FormCreateExpense from "./FormCreateExpense"
import { ExpenseDetailedType, ExpenseType, ParticipantType } from "@/lib/types"
import Expense from "./Expense"
import { useState } from "react"
import ExpenseDetail from "./ExpenseDetail"
import ExpenseDeleteDialog from "./ExpenseDeleteDialog"
import { fetchExpenseDetail } from "@/lib/actions/expenseActions"

type ExpensesListProps = {
  expenses: ExpenseType[];
  onExpenseDeleted?: () => void;
  participants: ParticipantType[]; // Add participants prop
  eventId: string; // Add eventId prop
}

export default function ExpensesList({ expenses, onExpenseDeleted, participants, eventId }: ExpensesListProps) {
    const [openDetails, setOpenDetails] = useState(false)
    const [detailExpenseId, setDetailExpenseId] = useState<string>("")
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteExpenseId, setDeleteExpenseId] = useState<string>("")
    const [openEdit, setOpenEdit] = useState(false)
    const [editExpenseData, setEditExpenseData] = useState<ExpenseDetailedType | null>(null)
    const handleClickExpense = (idExpense: string) => {
        setDetailExpenseId(idExpense)
        setOpenDetails(true)
    }

    const handleEditExpense = async (idExpense: string) => {
        const expensesResponse = await fetchExpenseDetail(idExpense);
        const expense = expensesResponse.success ? expensesResponse.data : null;
        if (expense) {
            setEditExpenseData(expense)
            setOpenEdit(true)
        }
    }

    const handleDeleteExpense = (idExpense: string) => {
        setDeleteExpenseId(idExpense);
        setOpenDelete(true);
    }

    // Handler for when an expense is edited
    const handleExpenseEdited = async (updatedExpense: ExpenseType) => {
        setOpenEdit(false)
        setEditExpenseData(null)
        if (onExpenseDeleted) onExpenseDeleted() // reuse to refresh list
    }

    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500">No hay gastos registrados</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {expenses.map((expense) => (
                    <Expense 
                        expense={expense} 
                        key={expense.id} 
                        handleClickExpense={handleClickExpense}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                    />
                ))}
            </div>

            <ExpenseDetail 
                open={openDetails} 
                onOpenChange={setOpenDetails} 
                idExpense={detailExpenseId} 
            />
            <ExpenseDeleteDialog
                expenseId={deleteExpenseId}
                open={openDelete}
                setOpen={setOpenDelete}
                onExpenseDeleted={onExpenseDeleted}
            />
            {editExpenseData && (
                <FormCreateExpense
                    eventId={eventId}
                    participants={participants}
                    open={openEdit}
                    setOpen={setOpenEdit}
                    initialValues={editExpenseData}
                    editMode={true}
                    onExpenseCreated={handleExpenseEdited}
                />
            )}
        </>
    )
}
