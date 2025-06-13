"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExpenseButton from "./AddExpenesButton"
import ExpensesList from "./ExpensesList"
import ParticipantList from "./ParticipantList"
import FormCreateExpense from "./FormCreateExpense"

import { ExpenseType, ParticipantType } from "@/lib/types"

// The props have been updated to receive participants with their balance data.
interface EventTabsProps {
    expenses: ExpenseType[];
    participantsWithBalances: (ParticipantType & { balance: number; })[];
    eventId: string;
}

export default function EventTabs({
    expenses: initialExpenses,
    participantsWithBalances,
    eventId,
}: EventTabsProps) {
    const [expenses, setExpenses] = useState<ExpenseType[]>(initialExpenses);
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

    const handleExpenseCreated = (newExpense: ExpenseType) => {
        setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    };

    return (
        <>
            <Tabs defaultValue="gastos" className="w-full">
                <TabsList className="grid w-full md:w-fit grid-cols-2 bg-transparent gap-2">
                    <TabsTrigger
                        value="gastos"
                        className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border border-primary rounded-full"
                    >
                        Gastos
                    </TabsTrigger>
                    <TabsTrigger
                        value="participantes"
                        className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border border-primary rounded-full"
                    >
                        Participantes
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="gastos" className="mt-4">
                    <AddExpenseButton setOpen={setIsExpenseFormOpen} />
                    <div className="mt-4">
                        <ExpensesList expenses={expenses} />
                    </div>
                </TabsContent>
                <TabsContent value="participantes" className="mt-4">
                    {/* The ParticipantList now receives the correct prop with balance data. */}
                    <ParticipantList participantsWithBalances={participantsWithBalances} />
                </TabsContent>
            </Tabs>

            <FormCreateExpense
                // The form receives the participant list. It will use the id and name, ignoring the balance.
                participants={participantsWithBalances}
                onExpenseCreated={handleExpenseCreated}
                open={isExpenseFormOpen}
                setOpen={setIsExpenseFormOpen}
                eventId={eventId}
                modalId={`expense-form-${eventId}`}
            />
        </>
    );
}