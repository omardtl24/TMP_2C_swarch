'use server'
import { ENDPOINTS } from "../endpoints";
import mockEventsResponse from "../mockData/eventMockData";
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

export async function fetchEvents(token?: string): Promise<EventsResponse> {
  try {
    const authToken = token || await getAuthToken();
    
    // If running in generateStaticParams (no auth token available),
    // return mock data for static generation
    if (!authToken) {
      console.log("No auth token available, using mock data for static generation");
      return mockEventsResponse;
    }
    
    const res = await fetch(
      ENDPOINTS.community.ssr + "/api/events/me",
      { 
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      return { 
        success: 'error', 
        error: `Failed to fetch events. Status: ${res.status}` 
      };
    }
    
    const events = await res.json();
    return { success: 'success', data: events };
    
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


export async function fetchEventDetail(id:string,token?:string): Promise<EventsResponseDetailed> {
    //return mockEventDetailResponse
  try {

    const authToken = token || await getAuthToken();
    
    // If running in generateStaticParams (no auth token available),
    // return mock data for static generation
    if (!authToken) {
      console.log("No auth token available, using mock data for static generation");
    }
    const res = await fetch(
      ENDPOINTS.community.ssr + "/api/events/" + id,
       { 
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      return { 
        success: 'error', 
        error: `Failed to fetch event ${id}. Status: ${res.status}` 
      };
    }
    
    const events = await res.json();
    return { success: 'success', data: events };
    
  } catch (error) {
    return { 
      success: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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
export async function createEvent(eventData: CreateEventData, token?: string): Promise<CreateEventResponse> {
  const authToken = token || await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: 'error',
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    const res = await fetch(
      ENDPOINTS.community.ssr + "/api/events",
      {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}` 
        },
        body: JSON.stringify(eventData),
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      return {
        success: 'error',
        error: `Failed to create event. Status: ${res.status}`
      };
    }
    
    const createdEvent = await res.json();
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
  data?: {
    id: string;  // Event ID
  };
  error?: string;
};

// Function to join an event using invitation code
export async function joinEvent(invitationCode: string): Promise<JoinEventResponse> {
  const authToken = await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: 'success',
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    const res = await fetch(
      ENDPOINTS.community.ssr + "/api/events/join",
      {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}` 
        },
        body: JSON.stringify({ invitationCode }),
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: 'error',
        error: errorData.apierror?.message || `Failed to join event. Status: ${res.status}`
      };
    }
    
    const data = await res.json();
    return { 
      success: 'error', 
      data: {
        id: data.id
      }
    };
    
  } catch (error) {
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
    //event_id?: string;
  };
  error?: string;
};

export async function ChangeInvitationState(
  enabled: boolean, 
  eventId: string
): Promise<InvitationStateResponse> {
  const authToken = await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: 'error',
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    console.log(`Calling API to change invitation state for event ${eventId} to ${enabled}`);
    
    const res = await fetch(
      `${ENDPOINTS.community.ssr}/api/events/${eventId}/invite?enabled=${enabled}`,
      {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${authToken}` 
        },
        cache: 'no-store'
      }
    );
    
    console.log("API response status:", res.status);
    
    if (!res.ok) {
      return {
        success: "error",
        error: `Failed to update invitation state. Status: ${res.status}`
      };
    }
    
    const data = await res.json();
    return { 
      success: 'success', 
      data: {
        enabled: data.invitationEnabled,
        code: data.invitationCode
      }
    };
    
  } catch (error) {
    console.error("Error in ChangeInvitationState:", error);
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
  const authToken = await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: 'success',
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    console.log(`Deleting event with ID: ${eventId}`);
    
    const res = await fetch(
      `${ENDPOINTS.community.ssr}/api/events/${eventId}`,
      {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${authToken}` 
        },
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      return {
        success: 'error',
        error: `Failed to delete event. Status: ${res.status}`
      };
    }
    
    return { success: 'success' };
    
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to get current user information

interface ParticipantsResponse{
  success: string;
  data?: ParticipantType[]
  error?: string;
}

export async function participantsEvent(id: string): Promise<ParticipantsResponse> {
  const authToken = await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: 'error',
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    const res = await fetch(
      `${ENDPOINTS.community.ssr}/api/events/${id}/participants`,
      {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${authToken}` 
        },
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      return {
        success: 'error',
        error: `Failed to fetch participants. Status: ${res.status}`
      };
    }
    
    const data = await res.json();
    return { success: 'success', data };
    
  } catch (error) {
    return {
      success: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }

}
