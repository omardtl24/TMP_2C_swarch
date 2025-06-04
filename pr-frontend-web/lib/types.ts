// Centralized custom types for authentication/session and user

export type Session = {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
  exp?: number;
  [key: string]: unknown;
};

// You can add more types here as needed, e.g.:
// export type User = { ... }

export type EventType = {
  id:string
  name: string;
  description: string;
  beginDate: Date;
  endDate: Date;
}

export type EventDetailType = EventType &  {
  creatorId: string;
  invitacionEnabled: boolean;
  invitationCode: string | null;
}

export type ExpenseType = {
  id: string;
  concept: string;
  total: number;
  type: string;
  payer_id: string;
}

export type ExpenseParticipation = {
  user_id: string;
  state: number;
  portion: number;
}

export type ExpenseDetailedType = ExpenseType & {
  participation: ExpenseParticipation[];
  support_image_id?: string;
}

export type ParticipantType = {
  participantId:string // Changed from number to string to match mockData
}

export type ParticipantBalance = {
  userId: string;
  balance: number;
};
