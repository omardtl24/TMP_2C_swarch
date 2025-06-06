import { EventsResponse, EventsResponseDetailed } from "../actions/eventActions";
import { ParticipantsResponse } from "../actions/expenseActions";
import { EventType } from "../types";


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
  {
    id: "3",
    name: "Frontend Developers Meetup",
    description: "A casual event for frontend developers to share knowledge.",
    begin_date: new Date("2025-08-15T18:30:00Z"),
    end_date: new Date("2025-08-15T21:00:00Z"),
  },
];

const mockEventsResponse: EventsResponse = {
  success: 'success',
  data: mockEvents,
};

export default mockEventsResponse;

export const mockEventDetailResponse: EventsResponseDetailed = {
  success: 'success',
  data: {
    id: "101",
    name: "AI Innovation Summit",
    description: "A summit focused on the future of Artificial Intelligence and its applications.",
    begin_date: new Date("2025-09-10T09:00:00Z"),
    end_date: new Date("2025-09-12T17:00:00Z"),
    creator_id: "user_abc123",
    invitacion_enabled: true,
    invitation_code: "INVITE-2025-AI",
    total_expense:123312,
    my_balance:123123
  }
};

export const mockEventExpenses = {
  success: 'success',
  data: [
    {
      id: "1",
      concept: "Cena Italiana",
      total: 200000,
      type: 1, // 1 could represent "Comida" category
      payer_id: "user_001", // Using user IDs instead of names
    },
    {
      id: "2",
      concept: "Pola HidraPub",
      total: 100000,
      type: 2, // 2 could represent "Bebida" category
      payer_id: "user_002",
    },
    {
      id: "3",
      concept: "Compra en carulla",
      total: 500000,
      type: 3, // 3 could represent "Fruta" category
      payer_id: "user_003",
    },
    {
      id: "4",
      concept: "Guaro o miedo?",
      total: 70000,
      type: 2, // 2 could represent "Bebida" category
      payer_id: "user_004",
    },
  ]
};
/*Old mockEventParticipants
export const mockEventParticipants: ParticipantsResponse = {
  success: 'success',
  data: [
    {
      id: "1",
      mount: 100000,
      debtorName: "Juan David Palacios",
      debtorId: "1",
      LenderName: "Group",
      LenderId: "0"
    },
    {
      id: "2",
      mount: -50000,
      debtorName: "Group",
      debtorId: "0",
      LenderName: "Gian Karlo Lanziano",
      LenderId: "2"
    },
    {
      id: "3",
      mount: 30000,
      debtorName: "Maria Camila Sanchez",
      debtorId: "3",
      LenderName: "Group",
      LenderId: "0"
    },
    {
      id: "4",
      mount: -80000,
      debtorName: "Group",
      debtorId: "0",
      LenderName: "Omar David Toledo",
      LenderId: "4"
    }
  ]
};
*/
export const mockEventParticipants: ParticipantsResponse = {
  success: 'success',
  data: [
    {
      participant_id: "1",
      mount: 100000,
      debtorName: "Juan David Palacios",
      debtorId: "1",
      LenderName: "Group",
      LenderId: "0"
    },
    {
      id: "2",
      mount: -50000,
      debtorName: "Group",
      debtorId: "0",
      LenderName: "Gian Karlo Lanziano",
      LenderId: "2"
    },
    {
      id: "3",
      mount: 30000,
      debtorName: "Maria Camila Sanchez",
      debtorId: "3",
      LenderName: "Group",
      LenderId: "0"
    },
    {
      id: "4",
      mount: -80000,
      debtorName: "Group",
      debtorId: "0",
      LenderName: "Omar David Toledo",
      LenderId: "4"
    }
  ]
};