// lib/mockData/eventMockData.ts

import { EventType, ParticipantType, ExpenseType, EventDetailType} from "../types";

// --- Mock Event Data ---

const mockEvents: EventType[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    description: "A conference about the latest in tech and innovation.",
    begin_date: new Date("2025-06-10T09:00:00Z"),
    end_date: new Date("2025-06-12T17:00:00Z"),
  },
  {
    id: "2",
    name: "Startup Pitch Day",
    description: "Startups pitch their ideas to investors and mentors.",
    begin_date: new Date("2025-07-01T10:00:00Z"),
    end_date: new Date("2025-07-01T18:00:00Z"),
  },
];

const mockDetailedEvent: EventDetailType = {
  id: "1",
  name: "AI Innovation Summit",
  description: "A summit focused on the future of Artificial Intelligence and its applications.",
  begin_date: new Date("2025-09-10T09:00:00Z"),
  end_date: new Date("2025-09-12T17:00:00Z"),
  creator_id: "1",
  invitation_enabled: true,
  invitation_code: "INVITE-2025-AI",
  total_expense: 870000,
  my_balance: -50000
};

// --- Mock Expenses Data for an Event ---

const mockEventExpensesData: ExpenseType[] = [
  {
    creator_id: "1",
    id: "1",
    concept: "Cena Italiana",
    total: 200000,
    type: "Comida",
    payer_id: "1",
    payer_name: "Juan David Palacios",
  },
  {
    creator_id: "2",
    id: "2",
    concept: "Pola HidraPub",
    total: 100000,
    type: "Enumerable",
    payer_id: "2",
    payer_name: "Gian Karlo Lanziano",
  },
  {
    creator_id: "3",
    id: "3",
    concept: "Compra en carulla",
    total: 500000,
    type: "3",
    payer_id: "3",
    payer_name: "Maria Camila Sanchez",
  },
  {
    creator_id: "4",
    id: "4",
    concept: "Guaro o miedo?",
    total: 70000,
    type: "2",
    payer_id: "4",
    payer_name: "Omar David Toledo",
  },
];

// --- Mock Participants Data for an Event ---

const mockEventParticipantsData: ParticipantType[] = [
  {
    participant_id: "1",
    participant_name: "Juan David Palacios",
  },
  {
    participant_id: "2",
    participant_name: "Gian Karlo Lanziano",
  },
  {
    participant_id: "3",
    participant_name: "Maria Camila Sanchez",
  },
  {
    participant_id: "4",
    participant_name: "Omar David Toledo",
  },
];


// --- EXPORTED MOCK RESPONSES ---

/**
 * Mock response for `fetchEvents`
 */
export const mockEventsResponse = {
  success: 'success',
  data: mockEvents,
};

/**
 * Mock response for `fetchEventDetail`
 */
export const mockEventDetailResponse = {
  success: 'success',
  data: mockDetailedEvent
};


/**
 * Mock response for `fetchEventExpenses`
 */
export const mockEventExpensesResponse = {
  success: 'success',
  data: mockEventExpensesData
};

/**
 * Mock response for `participantsEvent`
 */
export const mockEventParticipantsResponse = {
  success: 'success',
  data: mockEventParticipantsData
};