'use server'
import {
  ExpenseType,
  ExpenseDetailedType,
  DataExpense,
  ExpenseParticipation,
  participartionType,
} from "../types";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { cookies } from "next/headers";
import { mockEventExpensesResponse} from "../mockData/eventMockData";
import { mockExpenseDetailResponse } from "../mockData/expenseMockData";
import { mock } from "node:test";


export async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return  cookieStore.get('jwt')?.value;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // This will catch errors when cookies() is called outside a request context
    console.log("Cookie access error - likely outside request context");
    return undefined;
  }
}

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
// TODO: Change the routes when they are actually defined in the API
/**
 * Creates a new expense for an event.
 * Corresponds to: createExpense POST
 */
/* This one explicitly requires participation data, so it is not used in the current implementation.
export async function createExpense(participationData: participartionType, expenseData: DataExpense): Promise<ExpenseResponse> {
  try {
    const data = await callApiWithAuth<ExpenseType>({
      path: `/api/expenses`,
      method: "POST",
      body: { ...participationData, ...expenseData }
    });
    return { success: 'success', data };
  } catch (error) {
    return { success: 'error', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}
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
    //const authToken = token || await getAuthToken();
        const authToken = await getAuthToken();
        // If running in generateStaticParams (no auth token available),
        // return mock data for static generation
        if (!authToken) {
          console.log("No auth token available, using mock data for static generation");
          return mockEventExpensesResponse;
        }
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
    const authToken = await getAuthToken();
    
      if (!authToken) {
        console.log("No auth token available, using mock data for static generation");
        return mockExpenseDetailResponse;
      }

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