"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export default function AddExpenseButton() {
  const handleAddExpense = () => {
    // Implementation for adding expense would go here
    console.log("Add expense clicked")
  }

  return (
    <Button onClick={handleAddExpense} variant={"ghost"} className="flex items-center text-md gap-2 text-[#3A0092] font-medium p-2 h-fit w-full max-w-md justify-start">
      <span className="flex items-center justify-center size-8  bg-[#8653FF] text-white rounded-full"><Plus strokeWidth={4} className="size-auto"/> </span>
      Agregar gasto
    </Button>
  )
}
