"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExpenseButton from "./AddExpensesButton"
import ExpensesList from "./ExpensesList"
import ParticipantList from "./ParticipantList"
import FormCreateExpense from "./FormCreateExpense"

import { ExpenseType, ParticipantType } from "@/lib/types"

// The props have been updated to receive participants without balance data.
interface EventTabsProps {
    expenses: ExpenseType[];
    participants: ParticipantType[];
    eventId: string;
}

export default function EventTabs({
    expenses,
    participants,
    eventId,
}: EventTabsProps) {
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

    return (
        <>
            <Tabs defaultValue="gastos" className="w-full">
                <TabsList className="grid w-full md:w-fit grid-cols-2 bg-transparent gap-2">
                    <TabsTrigger
                        value="gastos"
                        className="cursor-pointer data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border border-primary rounded-full"
                    >
                        Gastos
                    </TabsTrigger>
                    <TabsTrigger
                        value="participantes"
                        className="cursor-pointer data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border border-primary rounded-full"
                    >
                        Participantes
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="gastos" className="mt-4">
                    <AddExpenseButton setOpen={setIsExpenseFormOpen} />
                    <div className="mt-4">
                        <ExpensesList
                            expenses={expenses}
                            participants={participants}
                            eventId={eventId}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="participantes" className="mt-4">
                    <ParticipantList participants={participants} />
                </TabsContent>
            </Tabs>

            <FormCreateExpense
                participants={participants}
                open={isExpenseFormOpen}
                setOpen={setIsExpenseFormOpen}
                eventId={eventId}
                modalId={`expense-form-${eventId}`}
            />
        </>
    );
}