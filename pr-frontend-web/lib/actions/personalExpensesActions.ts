'use server'

import { PersonalExpenseType, EditPersonalExpensePayload } from "../types"
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { mapExpenseEnumToLabel } from "../utils";

export async function createPersonalExpense(expenseData: PersonalExpenseType): Promise<PersonalExpenseType> {
  const { id, concept, type, total, date } = expenseData;

  const body = {
    id,
    concept,
    type,
    total,
    date,
  };
  
  return await callApiWithAuth<PersonalExpenseType>({
    path: `/personal-expenses`,
    method: "POST",
    body,
  });
}

export async function editPersonalExpense(
  expenseId: string,
  expenseData: EditPersonalExpensePayload
): Promise<{ message: string }> {
  const data = await callApiWithAuth<{ message: string }>({
    path: `/personal-expenses/${expenseId}`,
    method: "PUT",
    body: expenseData,
    });
    return { message: data.message };
}

export async function fetchPersonalExpenses(): Promise<PersonalExpenseType[]> {
  const expenses = await callApiWithAuth<PersonalExpenseType[]>({
    path: `/personal-expenses/all`,
    method: "GET",
  });
  return expenses.map(exp => ({
    ...exp,
    type: mapExpenseEnumToLabel(exp.type),
   }));
 }

 export async function deletePersonalExpense(expenseId: string): Promise<void> {
    await callApiWithAuth<{ message: string }>({
        path: `/personal-expenses/${expenseId}`,
        method: "DELETE",
    });
}


