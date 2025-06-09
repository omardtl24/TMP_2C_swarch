// lib/mockData/expenseMockData.ts

import { ExpenseType, ExpenseDetailedType } from "../types";
import { ExpenseResponse, ExpensesResponse, ExpenseDetailedResponse, GeneralMutationResponse } from '../actions/expenseActions';

// --- Base Mock Data Arrays ---

export const mockExpenses = [
  {
    creator_id: "1",
    id: "1",
    concept: "Dinner at Italian restaurant",
    total: 95.75,
    type: "0",
    payer_id: "1",
    payer_name: "Juan David Palacios"
  },
  {
    creator_id: "1",
    id: "2",
    concept: "Movie tickets",
    total: 45.00,
    type: "4",
    payer_id: "2",
    payer_name: "Gian Karlo Lanziano"
  },
];

export const mockDetailedExpense: ExpenseDetailedType = {
  creator_id: "1",
  id: "1",
  concept: "Dinner at Italian restaurant",
  total: 95.75,
  type: "0",
  payer_id: "1",
  payer_name: "Juan David Palacios",
  participation: [
    {
      user_id: "1",
      state: 3, // Pagado
      portion: 0.5
    },
    {
      user_id: "2",
      state: 0, // Pendiente
      portion: 0.5
    }
  ],
  support_image_id: "609c1b3f5f1c00006e00234d"
};


// --- EXPORTED MOCK RESPONSES ---

/**
 * Mock response for `createExpense`
 */
export const mockCreateExpenseResponse: ExpenseResponse = {
  success: 'success',
  data: mockExpenses[0],
};

/**
 * Mock response for `fetchEventExpenses`
 */
export const mockExpensesResponse: ExpensesResponse = {
  success: 'success',
  data: mockExpenses,
};

/**
 * Mock response for `fetchExpenseDetail`
 */
export const mockExpenseDetailResponse: ExpenseDetailedResponse = {
  success: 'success',
  data: mockDetailedExpense,
};

/**
 * Mock success response for `editExpense` or `deleteExpense`
 */
export const mockGeneralMutationSuccessResponse: GeneralMutationResponse = {
  success: 'success',
  message: 'Operation completed successfully.',
};

/**
 * Mock error response for any mutation
 */
export const mockGeneralMutationErrorResponse: GeneralMutationResponse = {
  success: 'error',
  error: 'An unknown error occurred.',
};