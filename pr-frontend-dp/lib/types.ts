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
