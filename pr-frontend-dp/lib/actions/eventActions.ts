'use server'
import { ENDPOINTS } from "../endpoints";
import mockEventsResponse, { mockEventDetailResponse, mockEventExpenses, mockEventParticipants } from "../mockData/eventMockData";
import { EventDetailType, EventType, ExpenseType, ParticipantType } from "../types";
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return  cookieStore.get('jwt')?.value;
  } catch (error) {
    // This will catch errors when cookies() is called outside a request context
    console.log("Cookie access error - likely outside request context");
    return undefined;
  }
}

// Define a typed response structure
export type EventsResponse = {
  success: boolean;
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
      ENDPOINTS.community.browser + "/api/events/me",
      { 
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store'
      }
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
      ENDPOINTS.community.browser + "/api/events/" + id,
       { 
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store'
      }
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



// Define the type for event creation
export type CreateEventData = {
  name: string;
  description?: string;
  beginDate: Date; 
  endDate: Date;   // ISO format date string
};

export type CreateEventResponse = {
  success: boolean;
  data?: EventType;
  error?: string;
};

// Function to create a new event
export async function createEvent(eventData: CreateEventData, token?: string): Promise<CreateEventResponse> {
  const authToken = token || await getAuthToken();
  
  // Check if token exists
  if (!authToken) {
    return {
      success: false,
      error: "Authentication required. No valid token found."
    };
  }
  
  try {
    const res = await fetch(
      ENDPOINTS.community.browser + "/api/events",
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
        success: false,
        error: `Failed to create event. Status: ${res.status}`
      };
    }
    
    const createdEvent = await res.json();
    return { success: true, data: createdEvent };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

