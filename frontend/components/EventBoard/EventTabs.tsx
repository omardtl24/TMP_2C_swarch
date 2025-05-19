"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExpenseButton from "./AddExpenesButton"
import ExpensesList from "./ExpensesList"
import ParticipantList from "./ParticipantList"

import { ExpenseType, ParticipantType } from "@/lib/types"

interface EventTabsProps {
    expenses: ExpenseType[];
    participants: ParticipantType[];
}

export default function EventTabs({ expenses, participants }: EventTabsProps) {
    return (
        <Tabs defaultValue="gastos" className="w-full">
            <TabsList className="grid w-full md:w-fit grid-cols-2 bg-trasparent gap-2">
                <TabsTrigger
                    value="gastos"
                    className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal  text-primary border-1 border-primary rounded-full"
                >
                    Gastos
                </TabsTrigger>
                <TabsTrigger
                    value="participantes"
                    className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal  text-primary border-1 border-primary rounded-full"

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
