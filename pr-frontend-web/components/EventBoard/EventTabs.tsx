"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddExpenseButton from "./AddExpenesButton"
import ExpensesList from "./ExpensesList"
import ParticipantList from "./ParticipantList"
import FormCreateExpense from "./FormCreateExpense"

import { ExpenseType, ParticipantType } from "@/lib/types"
import { BalancesResponse } from "@/lib/actions/expenseActions"

interface EventTabsProps {
    expenses: ExpenseType[];
    BalanceParticipants: BalancesResponse;
    eventId?: string;
    participants:ParticipantType[]
}

export default function EventTabs({ 
    expenses: initialExpenses, 
    BalanceParticipants,
    eventId,
    participants
}: EventTabsProps) {
    const [expenses, setExpenses] = useState<ExpenseType[]>(initialExpenses);
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
    
    // Handler for when a new expense is created
    const handleExpenseCreated = (newExpense: ExpenseType) => {
        setExpenses([...expenses, newExpense]);
    };

    // Format participants for the UI
   

    return (
        <>
            <Tabs defaultValue="gastos" className="w-full">
                <TabsList className="grid w-full md:w-fit grid-cols-2 bg-trasparent gap-2">
                    <TabsTrigger
                        value="gastos"
                        className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border-1 border-primary rounded-full"
                    >
                        Gastos
                    </TabsTrigger>
                    <TabsTrigger
                        value="participantes"
                        className="data-[state=active]:bg-primary/20 h-9 md:min-w-40 data-[state=active]:text-primary data-[state=active]:font-bold font-normal text-primary border-1 border-primary rounded-full"
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
                    {BalanceParticipants.success ? (
                        <ParticipantList BalanceParticipants={BalanceParticipants.data} />
                    ) : (
                        <p>ha sucedido un error</p>
                    )
                    }
                    
                </TabsContent>
            </Tabs>
            
            {/* Pass both open and setOpen props to the form */}
            <FormCreateExpense 
                participants={participants} 
                onExpenseCreated={handleExpenseCreated}
                open={isExpenseFormOpen}
                setOpen={setIsExpenseFormOpen}
                eventId={eventId}
                modalId={`expense-form-${eventId}`} // Add unique ID to prevent conflicts
            />
        </>
    );
}
