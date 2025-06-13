// Centralized custom types for authentication/session and user

export type Session = {
  id: string;
  email: string;
  username?: string;
  roles?: string[];
  exp?: number;
  [key: string]: unknown;
};

/* old type
export type EventType = {
  id:string
  name: string;
  description: string;
  beginDate: Date;
  endDate: Date;
}
*/
/* old type
export type EventDetailType = EventType &  {
  creatorId: string;
  invitacionEnabled: boolean;
  invitationCode: string | null;
}
*/
/* ?idk old type
export type ParticipantType = {
  participant_id:string // Changed from number to string to match mockData
}
*/
/* Old type
export type ExpenseType = {
  id: string;
  concept: string;
  total: number;
  type: string;
  payer_id: string;
}
*/
export type EventType = {
  id: string
  name: string;
  description: string;
  begin_date: Date;
  end_date: Date;
}

export type EventDetailType = EventType & {
  creator_id: string;
  invitacion_enabled: boolean; // bro invitacion or invitation, left as per the docs xd
  invitation_code: string | null;
  total_expense: number;
  my_balance: number
}

export type CreateEventData = {
  name: string;
  description?: string;
  beginDate: Date;
  endDate: Date;   // ISO format date string
};

export type ExpenseType = {
  creator_id: string,
  id: string;
  concept: string;
  total: number;
  type: string;
  payer_id: string;
  payer_name: string;
};
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
  participant_id: string;
  participant_name: string;
};

export type participartionType = { //ParticipationType as per docs but xd
  user_id: string;
  state: number;
  portion: number;
};

export type DataExpense = {
  event_id: string;
  payer_id: string;
  concept: string;
  total: number;
  type: string;
  participation: participartionType[];
};


