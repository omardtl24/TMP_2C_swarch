import { ExpenseType, ExpenseDetailedType, ParticipantType } from "../types";
import { mockExpenses, mockDetailedExpenses } from "../mockData/expenseMockData";
import { mockEventExpenses, mockEventParticipants } from "../mockData/eventMockData";
import {getAuthToken} from "./eventActions";
export type CreateExpenseResponse = {
  success: boolean;
  data?: ExpenseType;
  error?: string;
};

export type GetExpenseResponse = {
  success: boolean;
  data?: ExpenseType;
  error?: string;
};

export type GetExpensesResponse = {
  success: boolean;
  data?: ExpenseType[];
  error?: string;
};

export type GetExpenseDetailedResponse = {
  success: boolean;
  data?: ExpenseDetailedType;
  error?: string;
};

export async function createExpense(
  eventId: string,
  expenseData: {
    concept: string;
    total: number;
    type: number;
    payer_id: string;
    participants: string[];
  }
): Promise<CreateExpenseResponse> {
  // Ensure amount is a valid number
  const total = Number(expenseData.total);
  if (isNaN(total)) {
    return {
      success: false,
      error: "Invalid amount provided"
    };
  }

  // Mock data for development - remove when API is ready
  return {
    success: true,
    data: {
      id: "mocked_id",
      concept: expenseData.concept,
      total: total,
      type: expenseData.type,
      payer_id: expenseData.payer_id
    }
  };

  /* GraphQL mutation para cuando se implemente la API
  try {
    const mutation = `
      mutation CreateExpense(
        $eventId: ID!, 
        $concept: String!, 
        $total: Float!, 
        $type: Int!, 
        $payer_id: ID!,
        $participants: [ID!]!
      ) {
        createExpense(
          eventId: $eventId, 
          input: {
            concept: $concept,
            total: $total,
            type: $type,
            payer_id: $payer_id,
            participants: $participants
          }
        ) {
          id
          concept
          total
          type
          payer_id
        }
      }
    `;

    const variables = {
      eventId,
      concept: expenseData.concept,
      total: expenseData.total,
      type: expenseData.type,
      payer_id: expenseData.payer_id,
      participants: expenseData.participants
    };

    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to create expense. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.createExpense
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
}

/**
 * Retrieves all expenses for a specific event
 * @param eventId Event ID to retrieve expenses for
 * @returns Promise with array of expense data
 */
export async function getExpensesByEvent(eventId: string): Promise<GetExpensesResponse> {
  // Siempre devuelve datos mock por ahora
  return {
    success: true,
    data: mockExpenses
  };

  /* GraphQL query para cuando se implemente la API
  try {
    const query = `
      query GetEventExpenses($eventId: ID!) {
        eventExpenses(eventId: $eventId) {
          id
          concept
          total
          type
          payer_id
        }
      }
    `;

    const variables = { eventId };

    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch expenses. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.eventExpenses
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
}

/**
 * Retrieves a single expense by its ID
 * @param id Expense ID to retrieve
 * @returns Promise with expense data
 */
export async function getExpenseById(id: string): Promise<GetExpenseResponse> {
  // Siempre devuelve datos mock por ahora
  const mockExpense = mockExpenses.find(exp => exp.id === id) || mockExpenses[0];
  
  return {
    success: true,
    data: mockExpense
  };

  /* GraphQL query para cuando se implemente la API
  try {
    const query = `
      query GetExpense($id: ID!) {
        expense(id: $id) {
          id
          concept
          total
          type
          payer_id
        }
      }
    `;

    const variables = { id };

    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch expense. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.expense
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
}

/**
 * Retrieves detailed expense information including participation data
 * @param id Expense ID to retrieve
 * @returns Promise with detailed expense data
 */
export async function getExpenseDetailed(id: string): Promise<GetExpenseDetailedResponse> {
  // Siempre devuelve datos mock por ahora
  const mockDetailedExpense = mockDetailedExpenses.find(exp => exp.id === id) || mockDetailedExpenses[0];
  
  return {
    success: true,
    data: mockDetailedExpense
  };

  /* GraphQL query para cuando se implemente la API
  try {
    const query = `
      query GetExpenseDetailed($id: ID!) {
        expenseDetailed(id: $id) {
          id
          concept
          total
          type
          payer_id
          participation {
            user_id
            state
            portion
          }
          support_image_id
        }
      }
    `;

    const variables = { id };

    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch detailed expense. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.expenseDetailed
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
}

export type ExpensesResponse = {
  success: boolean;
  data?: ExpenseType[];
  error?: string;
};

// New function to fetch expenses using GraphQL
export async function fetchEventExpenses(eventId: string, token?: string): Promise<ExpensesResponse> {
  // Get token from cookies if not provided
  const authToken = token || getAuthToken();
  
  // Mock data for development - remove this line when API is ready
  return mockEventExpenses;
  
  try {
    // GraphQL query to fetch expenses
    const query = `
      query GetEventExpenses($eventId: ID!) {
        eventExpenses(eventId: $eventId) {
          id
          name
          amount
          category
          paidBy
        }
      }
    `;

    const variables = {
      eventId
    };

    const res = await fetch(ENDPOINTS.community.ssr + "/graphql", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      credentials: authToken ? undefined : "include",
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch expenses. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.eventExpenses
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type ParticipantsResponse = {
  success: boolean;
  data?: ParticipantType[];
  error?: string;
};



// Private function to fetch raw participant data
export async function fetchEventParticipants(eventId: string): Promise<ParticipantsResponse> {
  // Mock data for development - remove this line when API is ready
  return mockEventParticipants;
  
  try {
    // GraphQL query to fetch participants
    const query = `
      query GetEventParticipants($eventId: ID!) {
        eventParticipants(eventId: $eventId) {
          id
          mount
          debtorName
          debtorId
          LenderName
          LenderId
        }
      }
    `;

    const variables = {
      eventId
    };

    const res = await fetch(ENDPOINTS.community + "/participants", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch participants. Status: ${res.status}`
      };
    }

    const { data, errors } = await res.json();

    if (errors) {
      return {
        success: false,
        error: errors[0].message || 'GraphQL error occurred'
      };
    }

    return {
      success: true,
      data: data.eventParticipants
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
