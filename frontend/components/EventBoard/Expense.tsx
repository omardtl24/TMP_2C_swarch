import { ExpenseType } from "@/lib/types"
import { getCategoryColor, getCategoryBg } from "@/lib/utils"

const Expense = ({expense}:{expense:ExpenseType}) => {
    return (
        <div  className="border-2 border-[#E9DDFF] rounded-xl p-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#3A0092] font-bold">${new Intl.NumberFormat("es-CO").format(expense.amount)}</p>
              <p className="text-[#3A0092]">{expense.name}</p>
              <p className="text-xs text-gray-500">
                pagado por <span className="font-medium">{expense.paidBy}</span>
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-md text-xs ${getCategoryColor(expense.category)} ${getCategoryBg(expense.category)}`}
            >
              {expense.category}
            </span>
          </div>
        </div>
    )

}

export default Expense