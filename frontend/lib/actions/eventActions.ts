'use server'

import { ENDPOINTS } from "../endpoints";
import mockEventsResponse, { mockEventDetailResponse, mockEventExpenses, mockEventParticipants } from "../mockData/eventMockData";
import { EventDetailType, EventType, ExpenseType, ParticipantType } from "../types";

// Define a typed response structure
export type EventsResponse = {
  success: boolean;
  data?: EventType[];
  error?: string;
};

export async function fetchEvents(): Promise<EventsResponse> {
    return mockEventsResponse
  try {
    const res = await fetch(
      ENDPOINTS.community.ssr + "/events",
      { cache: 'no-store' } // Ensure server-side fetch without caching
    );
    
    if (!res.ok) {
      return { 
        success: false, 
        error: `Failed to fetch events. Status: ${res.status}` 
      };
    }
    
    const events = await res.json();
    return { success: true, data: events };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type EventsResponseDetailed = {
  success: boolean;
  data?: EventDetailType;
  error?: string;
};


export async function fetchEventDetail(id:string): Promise<EventsResponseDetailed> {
    return mockEventDetailResponse
  try {
    const res = await fetch(
      ENDPOINTS.community.ssr + "/events/" + id,
      { cache: 'no-store' } // Ensure server-side fetch without caching
    );
    
    if (!res.ok) {
      return { 
        success: false, 
        error: `Failed to fetch event ${id}. Status: ${res.status}` 
      };
    }
    
    const events = await res.json();
    return { success: true, data: events };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type ExpensesResponse = {
  success: boolean;
  data?: ExpenseType[];
  error?: string;
};

// New function to fetch expenses using GraphQL
export async function fetchEventExpenses(eventId: string): Promise<ExpensesResponse> {
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

    const res = await fetch(ENDPOINTS.community + "/expenses", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store' // Ensure server-side fetch without caching
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

export type CreateExpenseResponse = {
  success: boolean;
  data?: ExpenseType;
  error?: string;
};

export async function createExpense(
  eventId: string,
  expenseData: {
    name: string;
    total: number;
    type: string;
    payer_id: string;
    participants: string[];
  }
): Promise<CreateExpenseResponse> {
  // Ensure amount is a valid number
  const amount = Number(expenseData.total);
  if (isNaN(amount)) {
    return {
      success: false,
      error: "Invalid amount provided"
    };
  }

  // Mock data for development - remove when API is ready
  return {
    success: true,
    data: {
      id: Math.floor(Math.random() * 10000),
      name: expenseData.name,
      amount, // Use validated amount
      category: expenseData.type,
      paidBy: `Usuario ${expenseData.payer_id}`,
    }
  };
  
  try {
    // GraphQL mutation to create expense
    const mutation = `
      mutation CreateExpense(
        $eventId: ID!, 
        $name: String!, 
        $amount: Float!, 
        $category: String!, 
        $paidById: ID!,
        $participantIds: [ID!]!
      ) {
        createExpense(
          eventId: $eventId, 
          input: {
            name: $name,
            amount: $amount,
            category: $category,
            paidById: $paidById,
            participantIds: $participantIds
          }
        ) {
          id
          name
          amount
          category
          paidBy
        }
      }
    `;

    const variables = {
      eventId,
      name: expenseData.name,
      amount: expenseData.amount,
      category: expenseData.category,
      paidById: expenseData.paidById,
      participantIds: expenseData.participantIds
    };

    const res = await fetch(ENDPOINTS.community + "/expenses", {
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
}

