import {
  ExpenseType,
  ExpenseDetailedType,
  DataExpense,
  ExpenseParticipation,
} from "../types";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";

// Response wrapper types
export type ExpenseResponse = {
  success: string;
  data?: ExpenseType;
  error?: string;
};

export type ExpensesResponse = {
  success: string;
  data?: ExpenseType[];
  error?: string;
};

export type ExpenseDetailedResponse = {
  success: string;
  data?: ExpenseDetailedType;
  error?: string;
};

export type GeneralMutationResponse = {
  success: string;
  message?: string;
  error?: string;
};

/**
 * Creates a new expense for an event.
 * Corresponds to: createExpense POST
 */
export async function createExpense(expenseData: DataExpense): Promise<ExpenseResponse> {
  try {
    const data = await callApiWithAuth<ExpenseType>({
      path: `/api/expenses`,
      method: "POST",
      body: expenseData,
    });
    return { success: 'success', data };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Edits an existing expense.
 * Corresponds to: editExpense PATCH
 */
export async function editExpense(
  expenseId: string,
  expenseData: Omit<DataExpense, 'event_id'>
): Promise<GeneralMutationResponse> {
  try {
    // The API directive asks for a success/error message on return
    const data = await callApiWithAuth<{ success: string, message: string }>({
      path: `/api/expenses/${expenseId}`,
      method: "PATCH",
      body: expenseData,
    });
    return { success: data.success, message: data.message };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Fetches all expenses for a specific event.
 * Corresponds to: fetchEventExpenses GET
 */
export async function fetchEventExpenses(eventId: string): Promise<ExpensesResponse> {
  try {
    const data = await callApiWithAuth<ExpenseType[]>({
      path: `/api/events/${eventId}/expenses`,
      method: "GET",
    });
    return { success: 'success', data };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Fetches the detailed information for a single expense.
 * Corresponds to: fetchExpenseDetail GET
 */
export async function fetchExpenseDetail(expenseId: string): Promise<ExpenseDetailedResponse> {
  try {
    const data = await callApiWithAuth<ExpenseDetailedType>({
      path: `/api/expenses/${expenseId}`,
      method: "GET",
    });
    return { success: 'success', data };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Deletes an expense.
 * Corresponds to: deleteExpense DELETE
 */
export async function deleteExpense(expenseId: string): Promise<GeneralMutationResponse> {
  try {
    const data = await callApiWithAuth<{ message: string }>({
      path: `/api/expenses/${expenseId}`,
      method: "DELETE",
    });
    return { success: 'success', message: data.message };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}