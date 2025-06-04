"use client"

import { useState, useEffect } from 'react';

// Utilities
import { api } from '../api-handler';

// Drizzle ORM
import type { User } from "@repo/database"

interface Session {
  user: User | null;  // Holds user data if authenticated, otherwise null
  loading: boolean;   // Indicates if authentication check is in progress
}

// Custom hook to manage user authentication state
export function useSession(): Session & {
  refetch: () => Promise<void>;  // Function to refetch session data
  signOut: () => Promise<void>;  // Function to sign out user
} {
  const [session, setSession] = useState<Session>({
    user: null,
    loading: true
  });

  const fetchSession = async () => {
    try {
      setSession(prev => ({ ...prev, loading: true }));

      const response: User = await api.get('/api/users/get-user');

      if (response) {
        setSession({
          user: response,
          loading: false
        });
      } else {
        setSession({
          user: null,
          loading: false
        });
      }
    } catch (err) {
      setSession({
        user: null,
        loading: false
      });
    }
  };

  // Function to sign out the user
  const signOut = async () => {
    try {
      await api.post('/api/users/sign-out');
      setSession({
        user: null,
        loading: false
      });
    } catch (err) {
      console.error('Sign out error:', err);
      setSession({
        user: null,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    ...session,
    refetch: fetchSession,
    signOut,
  };
}