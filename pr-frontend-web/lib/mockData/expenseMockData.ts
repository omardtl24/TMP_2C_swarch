import { ExpenseType, ExpenseDetailedType } from "../types";

// Mock data for basic expense information
export const mockExpenses: ExpenseType[] = [
  {
    id: "exp1",
    concept: "Dinner at Italian restaurant",
    total: 95.75,
    type: "0", // Changed type from number to string
    payer_id: "1"
  },
  {
    id: "exp2",
    concept: "Movie tickets",
    total: 45.00,
    type: "4", // Changed type from number to string
    payer_id: "2"
  },
  {
    id: "exp3",
    concept: "Grocery shopping",
    total: 127.35,
    type: "0", // Changed type from number to string
    payer_id: "1"
  },
  {
    id: "exp4",
    concept: "Taxi fare",
    total: 22.50,
    type: "3", // Changed type from number to string
    payer_id: "3"
  },
  {
    id: "exp5",
    concept: "Coffee and snacks",
    total: 18.25,
    type: "0", // Changed type from number to string
    payer_id: "2"
  }
];

// Mock data for detailed expense information
export const mockDetailedExpenses: ExpenseDetailedType[] = [
  {
    id: "exp1",
    concept: "Dinner at Italian restaurant",
    total: 95.75,
    type: "0",
    payer_id: "1",
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
  },
  {
    id: "exp2",
    concept: "Movie tickets",
    total: 45.00,
    type: "4",
    payer_id: "2",
    participation: [
      {
        user_id: "1",
        state: 0,
        portion: 0.33
      },
      {
        user_id: "2",
        state: 3,
        portion: 0.33
      },
      {
        user_id: "3",
        state: 0,
        portion: 0.34
      }
    ],
    support_image_id: "609c1b3f5f1c00006e00234e"
  },
  {
    id: "exp3",
    concept: "Grocery shopping",
    total: 127.35,
    type: "0",
    payer_id: "1",
    participation: [
      {
        user_id: "1",
        state: 3,
        portion: 0.4
      },
      {
        user_id: "2",
        state: 1, // En proceso
        portion: 0.3
      },
      {
        user_id: "3",
        state: 0,
        portion: 0.3
      }
    ]
  },
  {
    id: "exp4",
    concept: "Taxi fare",
    total: 22.50,
    type: "3",
    payer_id: "3",
    participation: [
      {
        user_id: "2",
        state: 0,
        portion: 0.5
      },
      {
        user_id: "3",
        state: 3,
        portion: 0.5
      }
    ],
    support_image_id: "609c1b3f5f1c00006e00234f"
  },
  {
    id: "exp5",
    concept: "Coffee and snacks",
    total: 18.25,
    type: "0",
    payer_id: "2",
    participation: [
      {
        user_id: "1",
        state: 2, // Rechazado
        portion: 0.25
      },
      {
        user_id: "2",
        state: 3,
        portion: 0.25
      },
      {
        user_id: "3",
        state: 0,
        portion: 0.25
      },
      {
        user_id: "4",
        state: 0,
        portion: 0.25
      }
    ]
  }
];
