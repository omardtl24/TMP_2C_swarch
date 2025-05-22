import { ExpenseType } from "@/lib/types"
import Expense from "./Expense"
import { useState } from "react"
import ExpenseDetail from "./ExpenseDetail"



type ExpensesListProps = {
  expenses: ExpenseType[]
}

export default function ExpensesList({ expenses }: ExpensesListProps) {
    const [open, setOpen] = useState(false)
    const [ExpenseId, setExpense] = useState<string>("")
    const handleClickExpense = (idExpense:string) => {
        setExpense(idExpense)
        setOpen(true)
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
        <Expense expense={expense} key={expense.id} handleClickExpense={handleClickExpense} />
      ))}
    </div>

    <ExpenseDetail open={open} onOpenChange={setOpen} idExpense={ExpenseId} />
  </>
    
  )
}
