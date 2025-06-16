// Centralized custom types for authentication/session and user

export type Session = {
  id: string;
  email: string;
  name: string;
  username: string;
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
  id: string;
  name: string;
  description: string;
  // begin_date y end_date pueden ser Date o string según el backend
  begin_date?: Date | string;
  end_date?: Date | string;
};

export type EventDetailType = {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  invitation_enabled: boolean;
  invitation_code: string | null;
  total_expense: number;
  my_balance: number;
  // begin_date y end_date pueden venir si el backend los envía
  begin_date?: Date | string;
  end_date?: Date | string;
};

export type CreateEventData = {
  name: string;
  description?: string;
  beginDate: Date;
  endDate: Date;   // ISO format date string
};

export type ExpenseType = {
  creator_id: string;
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
};

export type ExpenseDetailedType = {
  // id puede no venir en el detalle, lo dejamos opcional
  id?: string;
  concept: string;
  total: number;
  type: string;
  payer_id: string;
  payer_name: string;
  creator_id: string;
  participation: ExpenseParticipation[];
  support_image_id?: string;
};

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

// Payload para editar un gasto (PUT)
export type EditExpensePayload = {
  concept: string;
  total: number;
  type: string;
  payerId: string;
  participation: {
    userId: string;
    state: number;
    portion: number;
  }[];
};

export type PersonalExpenseType = {
  id: string;
  concept: string;
  type: string;
  total: number;
  date: string;
};

export type EditPersonalExpensePayload = {
  concept: string;
  type: string;
  total: number;
  date: string;
};

