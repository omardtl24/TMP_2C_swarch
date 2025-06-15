'use server'
import {
  ExpenseType,
  ExpenseDetailedType,
  DataExpense,
  EditExpensePayload,
} from "../types";
import { getAuthToken } from "@/lib/api/authTokenHelper";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { mockEventExpensesResponse} from "../mockData/eventMockData";
import { mockExpenseDetailResponse } from "../mockData/expenseMockData";
import { mapExpenseEnumToLabel } from "@/lib/utils";

// Crea un gasto
export async function createExpense(expenseData: DataExpense): Promise<ExpenseType> {
  // Extraer event_id y preparar el body según el contrato esperado
  const { event_id, payer_id, participation, ...rest } = expenseData;
  const body = {
    ...rest,
    payerId: payer_id,
    participation: participation.map(({ user_id, ...p }) => ({
      userId: user_id,
      ...p,
    })),
  };
  return await callApiWithAuth<ExpenseType>({
    path: `/api/group-expenses/events/${event_id}`,
    method: "POST",
    body,
  });
}

// Edita un gasto
export async function editExpense(
  expenseId: string,
  expenseData: EditExpensePayload
): Promise<{ message: string }> {
  const data = await callApiWithAuth<{ message: string }>({
    path: `/api/group-expenses/${expenseId}`,
    method: "PUT",
    body: expenseData,
  });
  return { message: data.message };
}

// Obtiene todos los gastos de un evento
export async function fetchEventExpenses(eventId: string): Promise<ExpenseType[]> {
  const authToken = await getAuthToken();
  let expenses: ExpenseType[];
  if (!authToken) {
    expenses = mockEventExpensesResponse.data!;
  } else {
    expenses = await callApiWithAuth<ExpenseType[]>({
      path: `/api/group-expenses/events/${eventId}`,
      method: "GET",
    });
  }
  // Mapear el tipo al formato bonito en cada gasto
  return expenses.map(exp => ({
    ...exp,
    type: mapExpenseEnumToLabel(exp.type),
  }));
}

// Obtiene el detalle de un gasto
export async function fetchExpenseDetail(expenseId: string): Promise<ExpenseDetailedType> {
  const authToken = await getAuthToken();
  let data: ExpenseDetailedType;
  if (!authToken) {
    data = mockExpenseDetailResponse.data!;
  } else {
    data = await callApiWithAuth<ExpenseDetailedType>({
      path: `/api/group-expenses/${expenseId}`,
      method: "GET",
    });
  }
  // Mapear el tipo al formato bonito
  return {
    ...data,
    type: mapExpenseEnumToLabel(data.type),
  };
}

// Elimina un gasto
export async function deleteExpense(expenseId: string): Promise<void> {
  await callApiWithAuth<{ message: string }>({
    path: `/api/group-expenses/${expenseId}`,
    method: "DELETE",
  });
}