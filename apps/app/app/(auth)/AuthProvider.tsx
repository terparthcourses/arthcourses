"use client"

// React
import { ReactNode } from 'react';

// React Hooks
import { createContext, useContext } from 'react';

// Custom Hooks
import { useSession } from '@/lib/hooks/useSession';

// Database
import type { User } from "@repo/database";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}