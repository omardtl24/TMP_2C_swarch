type Expense = {
  id: number
  amount: number
  description: string
  category: string
  paidBy: string
}

type ExpensesListProps = {
  expenses: Expense[]
}

export default function ExpensesList({ expenses }: ExpensesListProps) {
  // Function to determine category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "comida":
        return "text-red-500"
      case "bebida":
        return "text-green-500"
      case "fruta":
        return "text-orange-400"
      default:
        return "text-gray-500"
    }
  }

  // Function to determine category background
  const getCategoryBg = (category: string) => {
    switch (category.toLowerCase()) {
      case "comida":
        return "bg-red-100"
      case "bebida":
        return "bg-green-100"
      case "fruta":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {expenses.map((expense) => (
        <div key={expense.id} className="border-2 border-[#E9DDFF] rounded-xl p-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#3A0092] font-bold">${new Intl.NumberFormat("es-CO").format(expense.amount)}</p>
              <p className="text-[#3A0092]">{expense.description}</p>
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
      ))}
    </div>
  )
}
