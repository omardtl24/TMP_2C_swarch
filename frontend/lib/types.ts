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
  id:number
  name: string;
  description: string;
  beginDate: Date;
  endDate: Date;
}

export type EventDetailType = EventType &  {
  creatorId: string;
  invitacionEnabled: boolean;
  invitationCode: string;
}