import { ExpenseType, ExpenseDetailedType, ParticipantType, ParticipantBalance } from "../types";
import { mockExpenses, mockDetailedExpenses } from "../mockData/expenseMockData";
import { mockEventExpenses, mockEventParticipants } from "../mockData/eventMockData";
import { getAuthToken } from "./eventActions";
import { ENDPOINTS } from "../endpoints";
import Expense from "@/components/EventBoard/Expense";
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
    type:string;
    payer_id: string;
    participants: string[];
  }
): Promise<CreateExpenseResponse> {
  const authToken = await getAuthToken();

  // Check if token exists
  if (!authToken) {
    return {
      success: false,
      error: "Authentication required. No valid token found."
    };
  }
  // Ensure amount is a valid number
  const total = Number(expenseData.total);
  if (isNaN(total)) {
    return {
      success: false,
      error: "Invalid amount provided"
    };
  }

  // Mock data for development - remove when API is ready
  // return {
  //   success: true,
  //   data: {
  //     id: "mocked_id",
  //     concept: expenseData.concept,
  //     total: total,
  //     type: expenseData.type,
  //     payer_id: expenseData.payer_id
  //   }
  // };

  //GraphQL mutation para cuando se implemente la API
  try {
    const mutation = `
      mutation($input: NewExpenseInput!) { 
        createExpense(input: $input) { 
          id 
          externalDocId 
          eventId 
        } 
      }
    `;

    // Transform participants into participation structure
    const participation = expenseData.participants.map(userId => ({
      userId,
      state: 0,
      portion: total / expenseData.participants.length // Split evenly by default
    }));

    // Include payer with full amount
    if (!participation.some(p => p.userId === expenseData.payer_id)) {
      participation.push({
        userId: expenseData.payer_id,
        state: 0,
        portion: 0 // Payer doesn't owe anything
      });
    }

    const variables = {
      input: {
        eventId,
        concept: expenseData.concept,
        total,
        type:  expenseData.type.toString().toUpperCase().replaceAll(" ", "_"),
        participation
      }
    };

    const res = await fetch(`${ENDPOINTS.community.browser}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
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

}

export async function fetchEventExpenses(eventId: string, token?: string): Promise<ExpensesResponse> {
  // Get token from cookies if not provided
  const authToken = token || getAuthToken();

  // Mock data for development - remove this line when API is ready
  //return mockEventExpenses;

  try {
    // GraphQL query to fetch expenses
    const query = `
      query ($eventId: ID!) {
        expensesByEvent(eventId: $eventId){
          document {
            id
            concept
            total
            type
            payerId
          }
        }
      }
    `;

    const variables = {
      eventId
    };

    const res = await fetch(ENDPOINTS.community.browser + "/api/graphql", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
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
        error: `Failed to fetch expenses. Status: ${res.status}`
      };
    }

    const response = await res.json();
    console.log("Raw GraphQL Response:", response);
    
    // Check for GraphQL errors
    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'GraphQL error occurred'
      };
    }

    let mappedExpenses: ExpenseType[] = [];

    // Correctly access the nested data structure
    if (response.data?.expensesByEvent && Array.isArray(response.data.expensesByEvent)) {
        mappedExpenses = response.data.expensesByEvent.map(item => ({
        id: item.document.id,
        concept: item.document.concept,
        total: item.document.total,
        type: item.document.type,
        payer_id: item.document.payerId
      }));

      console.log("Mapped Expenses:", mappedExpenses);
      
      return {
        success: true,
        data: mappedExpenses
      };
    }

    return {
      success: false,
      error: 'Unexpected response format from API'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}


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

// New response type for sum of expenses
export type ExpensesSumResponse = {
  success: boolean;
  data?: number;
  error?: string;
};

/**
 * Fetches the sum of all expenses for a specific event
 * @param eventId ID of the event to calculate expenses sum for
 * @param token Optional auth token (will use cookies if not provided)
 * @returns Promise with the total sum of all expenses
 */
export async function getSumExpensesByEvent(eventId: string, token?: string): Promise<ExpensesSumResponse> {
  // Get token from cookies if not provided
  const authToken = token || getAuthToken();

  try {
    // GraphQL query to fetch sum of expenses
    const query = `
      query($eventId: ID!){
        sumExpensesByEvent(eventId:$eventId)
      }
    `;

    const variables = {
      eventId
    };

    const res = await fetch(`${ENDPOINTS.community.browser}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
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
        error: `Failed to fetch expenses sum. Status: ${res.status}`
      };
    }

    const response = await res.json();
    
    // Check for GraphQL errors
    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'GraphQL error occurred'
      };
    }

    // Access the data from the response
    if (response.data?.sumExpensesByEvent !== undefined) {
      return {
        success: true,
        data: response.data.sumExpensesByEvent
      };
    }

    return {
      success: false,
      error: 'Unexpected response format from API'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New function to fetch expenses using GraphQL

export type ParticipantsResponse = {
  success: boolean;
  data?: ParticipantType[];
  error?: string;
};

// New response type for balances
export type BalancesResponse = {
  success: boolean;
  data?: ParticipantBalance[];
  error?: string;
};

/**
 * Fetches balance information for all participants in an event
 * @param eventId ID of the event to fetch balances for
 * @param token Optional auth token (will use cookies if not provided)
 * @returns Promise with balance data for each participant
 */
export async function fetchEventBalances(eventId: string, token?: string): Promise<BalancesResponse> {
  // Get token from cookies if not provided
  const authToken = token || getAuthToken();

  try {
    // GraphQL query to fetch balances
    const query = `
      query($eventId: ID!){ 
        calcularBalances(eventId:$eventId){ 
          userId 
          balance 
        }
      }
    `;

    const variables = {
      eventId
    };

    const res = await fetch(`${ENDPOINTS.community.browser}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
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
        error: `Failed to fetch balances. Status: ${res.status}`
      };
    }

    const response = await res.json();
    console.log("Balance Response:", response);
    
    // Check for GraphQL errors
    if (response.errors) {
      return {
        success: false,
        error: response.errors[0]?.message || 'GraphQL error occurred'
      };
    }

    // Access the nested data
    if (response.data?.calcularBalances) {
      return {
        success: true,
        data: response.data.calcularBalances
      };
    }

    return {
      success: false,
      error: 'Unexpected response format from API'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
