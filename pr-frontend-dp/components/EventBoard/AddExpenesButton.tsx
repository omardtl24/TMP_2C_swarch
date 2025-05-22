"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useModal } from "../ModalFormBase"

interface AddExpenseButtonProps {
  setOpen?: (open: boolean) => void;
}

export default function AddExpenseButton({ setOpen }: AddExpenseButtonProps) {
  const { openModal } = useModal("createExpense")
  
  const handleClick = () => {
    console.log("Button clicked")
    if (setOpen) {
      setOpen(true);
      console.log("Set open to true")
    } else {
      openModal();
      console.log("Open modal")
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      variant={"ghost"} 
      className="flex items-center text-md gap-2 text-[#3A0092] font-medium p-2 h-fit w-full max-w-md justify-start"
    >
      <span className="flex items-center justify-center size-8 bg-[#8653FF] text-white rounded-full">
        <Plus strokeWidth={4} className="size-auto"/> 
      </span>
      Agregar gasto
    </Button>
  )
}
