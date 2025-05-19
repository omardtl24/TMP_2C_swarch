"use client"

export default function AddExpenseButton() {
  const handleAddExpense = () => {
    // Implementation for adding expense would go here
    console.log("Add expense clicked")
  }

  return (
    <button onClick={handleAddExpense} className="flex items-center gap-2 text-[#3A0092] font-medium">
      <span className="flex items-center justify-center w-6 h-6 bg-[#8653FF] text-white rounded-full">+</span>
      Agregar gasto
    </button>
  )
}
