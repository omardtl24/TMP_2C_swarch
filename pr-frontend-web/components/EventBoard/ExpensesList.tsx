import { ExpenseType } from "@/lib/types"
import Expense from "./Expense"
import { useState } from "react"
import ExpenseDetail from "./ExpenseDetail"
import ExpenseDeleteDialog from "./ExpenseDeleteDialog"

type ExpensesListProps = {
  expenses: ExpenseType[]
}

export default function ExpensesList({ expenses }: ExpensesListProps) {
    const [openDetails, setOpenDetails] = useState(false)
    const [detailExpenseId, setDetailExpenseId] = useState<string>("")
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteExpenseId, setDeleteExpenseId] = useState<string>("")

    const handleClickExpense = (idExpense: string) => {
        setDetailExpenseId(idExpense)
        setOpenDetails(true)
    }

    const handleEditExpense = (idExpense: string) => {
        setDetailExpenseId(idExpense)
        //setOpenDetails(true)
    }

    const handleDeleteExpense = (idExpense: string) => {
        setDeleteExpenseId(idExpense)
        setOpenDelete(true)
    }

    const handleDeleteDialogChange = (open: boolean) => {
        setOpenDelete(open);
        if (!open) setDeleteExpenseId("");
    };

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

            <ExpenseDetail open={openDetails} onOpenChange={setOpenDetails} idExpense={detailExpenseId} />
            <ExpenseDeleteDialog open={openDelete} onOpenChange={handleDeleteDialogChange} idExpense={deleteExpenseId} />
        </>
    )
}
