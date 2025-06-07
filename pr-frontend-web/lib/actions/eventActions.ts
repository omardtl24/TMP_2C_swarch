'use server'
//import { ENDPOINTS } from "../endpoints";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import {mockEventsResponse, mockEventDetailResponse, mockEventExpensesResponse, mockEventParticipantsResponse} from "../mockData/eventMockData";
import { EventDetailType, EventType, ParticipantType,CreateEventData } from "../types";
import { cookies } from "next/headers";


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

// Define a typed response structure
export type EventsResponse = {
  success: string;
  data?: EventType[];
  error?: string;
};

export async function fetchEvents(): Promise<EventsResponse> {
  try {
    //const authToken = token || await getAuthToken();
    const authToken = await getAuthToken();

    // If running in generateStaticParams (no auth token available),
    // return mock data for static generation
    if (!authToken) {
      console.log("No auth token available, using mock data for static generation");
      return mockEventsResponse;
    }
    const events = await callApiWithAuth<{ success: string, data: EventType[] }>({ //Este callApiWithAuth siempre deberia tener params explicitos para return de response data
      path: "/api/events/me",
      method: "GET",
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    return { success: events.success || "success", data: events.data };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type EventsResponseDetailed = {
  success: string;
  data?: EventDetailType;
  error?: string;
};

export async function fetchEventDetail(id: string): Promise<EventsResponseDetailed> {
  try {
    //const authToken = token || await getAuthToken();
    const authToken = await getAuthToken();
    // If running in generateStaticParams (no auth token available),
    // return mock data for static generation
    if (!authToken) {
      console.log("No auth token available, using mock data for static generation");
      return mockEventDetailResponse;
    }
    const event = await callApiWithAuth<EventDetailType>({
      path: `/api/events/${id}`,
      method: "GET",
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    return { success: 'success', data: event };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : `Unknown error occurred while fetching event ${id}`
    };
  }
}



// Define the type for event creation
/* Moved to types
export type CreateEventData = {
  name: string;
  description?: string;
  beginDate: Date; 
  endDate: Date;   // ISO format date string
};
*/
export type CreateEventResponse = {
  success: string;
  data?: EventType;
  error?: string;
};

// Function to create a new event
export async function createEvent(eventData: CreateEventData): Promise<CreateEventResponse> {
  try {
    
    const createdEvent = await callApiWithAuth<EventType>({
      path: "/api/events",
      method: "POST",
      body: eventData,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    return { success: 'success', data: createdEvent };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Define the type for join event response
export type JoinEventResponse = {
  success: string;
  data?: { id: string }; // Event ID
  error?: string;
};

// Function to join an event using an invitation code
export async function joinEvent(invitationCode: string): Promise<JoinEventResponse> {
  try {
    const data = await callApiWithAuth<{ id: string }>({
      path: "/api/events/join",
      method: "POST",
      body: { invitationCode },
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    return { success: 'success', data: { id: data.id } };
  } catch (error) {
    // Note: The original function had custom error parsing.
    // callApiWithAuth throws a generic error, so detailed messages from the response body may be lost
    // unless the underlying restClient is enhanced to include them.
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type InvitationStateResponse = {
  success: string;
  data?: {
    enabled: boolean;
    code?: string;
  };
  error?: string;
};

export async function ChangeInvitationState(enabled: boolean, eventId: string): Promise<InvitationStateResponse> {
  try {
    const data = await callApiWithAuth<{ invitationEnabled: boolean, invitationCode: string }>({
      path: `/api/events/${eventId}/invite?enabled=${enabled}`,
      method: "PATCH",
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    return {
      success: 'success',
      data: {
        enabled: data.invitationEnabled,
        code: data.invitationCode
      }
    };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}


export type DeleteEventResponse = {
  success: string;
  error?: string;
};

export async function deleteEvent(eventId: string): Promise<DeleteEventResponse> {
  try {
    await callApiWithAuth({
      path: `/api/events/${eventId}`,
      method: "DELETE",
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    return { success: 'success' };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to get current user information
export type ParticipantsResponse = {
  success: string;
  data?: ParticipantType[]
  error?: string;
}

export async function participantsEvent(id: string): Promise<ParticipantsResponse> {
  try {
    //const authToken = token || await getAuthToken();
    const authToken = await getAuthToken();
    // If running in generateStaticParams (no auth token available),
    // return mock data for static generation
    if (!authToken) {
      console.log("No auth token available, using mock data for static generation");
      return mockEventParticipantsResponse;
    }
    const data = await callApiWithAuth<ParticipantType[]>({
      path: `/api/events/${id}/participants`,
      method: "GET",
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    return { success: 'success', data };
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
