"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExpenseButton from "./AddExpenesButton"
import ExpensesList from "./ExpensesList"
import ParticipantList from "./ParticipantList"


type Expense = {
  id: number
  amount: number
  description: string
  category: string
  paidBy: string
}

type Participant = {
  id: string
  name: string
  balance: number
}

interface EventTabsProps {
  expenses: Expense[]
  participants: Participant[]
}

export default function EventTabs({ expenses, participants }: EventTabsProps) {
  return (
    <Tabs defaultValue="gastos" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-[#E9DDFF]">
        <TabsTrigger
          value="gastos"
          className="data-[state=active]:bg-[#8653FF] data-[state=active]:text-white text-[#3A0092]"
        >
          Gastos
        </TabsTrigger>
        <TabsTrigger
          value="participantes"
          className="data-[state=active]:bg-[#8653FF] data-[state=active]:text-white text-[#3A0092]"
        >
          Participantes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="gastos" className="mt-4">
        <AddExpenseButton />
        <div className="mt-4">
          <ExpensesList expenses={expenses} />
        </div>
      </TabsContent>
      <TabsContent value="participantes" className="mt-4">
        <ParticipantList participants={participants} />
      </TabsContent>
    </Tabs>
  )
}
