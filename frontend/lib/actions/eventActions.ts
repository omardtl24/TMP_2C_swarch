import { ENDPOINTS } from "../endpoints";
import mockEventsResponse, { mockEventDetailResponse } from "../mockData/eventMockData";
import { EventDetailType, EventType } from "../types";

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