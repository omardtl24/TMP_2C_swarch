"use client";

import { PersonalExpenseType } from "@/lib/types";
import Expense from "@/components/PersonalExpenses/Expense";
import { useRequireSession } from "@/lib/hooks/useRequireSession";
import { useState } from "react";
import AddExpenseButton from "@/components/EventBoard/AddExpensesButton";
import CreateExpenseForm from "@/components/PersonalExpenses/CreateExpenseForm";
import DeleteExpenseDialog from "./DeleteExpenseDialog";

interface PersonalExpensesPageClientProps {
    expenses: PersonalExpenseType[];
}

export default function PersonalExpensesPageClient({ expenses }: PersonalExpensesPageClientProps) {
    const { session } = useRequireSession();
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState<string>("");
    const [openEdit, setOpenEdit] = useState(false);
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
    const [editExpenseData, setEditExpenseData] = useState<PersonalExpenseType | null>(null);

    const handleExpenseDeleted = (idExpense: string) => {
        setDeleteExpenseId(idExpense);
        setOpenDelete(true);
    }
    const handleEditExpense = (expense: PersonalExpenseType) => {
        setEditExpenseData(expense);
        setIsExpenseFormOpen(true);
        setOpenEdit(true);
    }

    const handleExpenseCreated = () => {
        setIsExpenseFormOpen(false);
    }

    return (
        <>
            <div className="w-full">
                <h2 className="text-3xl font-semibold p-4">Bienvenido <span className="text-primary">{session?.username}</span>
                , desde acá puedes revisar tus gastos personales</h2>
            </div>
            <div >
                <AddExpenseButton setOpen={setIsExpenseFormOpen} />
            </div>
            <div className="space-y-4 p-4">
                {expenses.map((expense) => (
                    <div key={expense.id}>
                    <Expense
                        expense={expense}
                        onEdit={() => handleEditExpense(expense)}
                        onDelete={() => handleExpenseDeleted(expense.id)} 
                    />
                    </div>
                    ))}
            </div>
            <CreateExpenseForm 
                open={isExpenseFormOpen}
                setOpen={setIsExpenseFormOpen}
                onExpenseCreated={handleExpenseCreated}
                editMode={openEdit}
                initialData={editExpenseData}

            />
            <DeleteExpenseDialog
                expenseId={deleteExpenseId}
                open={openDelete}
                setOpen={setOpenDelete}
            />
        </>
    );
}