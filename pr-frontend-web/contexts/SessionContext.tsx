'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@/lib/types';
import { fetchSessionUniversal } from "@/lib/api/sessionHelpers";

export interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
  initialSession?: Session | null;
}

export function SessionProvider({ children, initialSession = null }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSession);
  const [error, setError] = useState<Error | null>(null);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const fetchedSession = await fetchSessionUniversal();
      setSession(fetchedSession);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener la sesión'));
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setSession(null);
  };

  useEffect(() => {
    if (!initialSession) {
      refreshSession();
    }
  }, [initialSession]);

  return (
    <SessionContext.Provider value={{ session, isLoading, error, refreshSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession debe usarse dentro de un SessionProvider');
  }
  return context;
};
