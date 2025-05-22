import { ExpenseType } from "@/lib/types"


interface ExpenseProps {
  expense: ExpenseType;
  handleClickExpense: (idExpense:string) => void;
}

const Expense = ({expense,handleClickExpense}:ExpenseProps) => {
    return (
        <div  className="border-2 border-[#E9DDFF] rounded-xl p-3 hover:bg-primary-80 hover:cursor-pointer" onClick={()=>handleClickExpense(expense.id)}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#3A0092] font-bold">${new Intl.NumberFormat("es-CO").format(expense.total)}</p>
              <p className="text-[#3A0092]">{expense.concept}</p>
              <p className="text-xs text-gray-500">
                pagado por <span className="font-medium">{expense.payer_id}</span>
              </p>
            </div>
            <span
              //className={`px-2 py-1 rounded-md text-xs ${expenseCategories[expense.type].bgColor} ${expenseCategories[expense.type].textColor}`}
            >
              {expense.type}
            </span>
          </div>
        </div>
    )

}

export default Expense