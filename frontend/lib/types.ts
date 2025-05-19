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

export type ExpenseType = {
  id: number;
  name: string;
  amount: number;
  category: string;
  paidBy: string;

}

export type ParticipantType = {
  id: string;
  mount: number;
  debtorName:string;
  debtorId:string;
  LenderName:string;
  LenderId:string;
}
