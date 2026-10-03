import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { redirect } from 'react-router';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'executive' | 'member';
  title: string;
  avatar_url: string | null;
  phone: string | null;
  joined_date: string;
  created_at: string;
}

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  // True until the signed-in member's profile has loaded.
  loading: boolean;
  isExecutive: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Whose profile is loaded (or loading), so token refreshes don't refetch it.
  const profileUserId = useRef<string | null | undefined>(undefined);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    // Ignore a slow response for a user who has since signed out or switched.
    if (profileUserId.current === userId) setProfile((data as Profile | null) ?? null);
  }, []);

  const syncSession = useCallback(
    (next: Session | null) => {
      setSession(next);
      const userId = next?.user.id ?? null;
      if (userId === profileUserId.current) return;
      profileUserId.current = userId;
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Supabase advises against calling its API from inside the auth callback,
      // so the profile fetch runs on the next tick.
      setTimeout(() => {
        loadProfile(userId).finally(() => {
          if (profileUserId.current === userId) setLoading(false);
        });
      }, 0);
    },
    [loadProfile],
  );

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => syncSession(next));
    supabase.auth.getSession().then(({ data }) => syncSession(data.session));
    return () => listener.subscription.unsubscribe();
  }, [syncSession]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session) await loadProfile(session.user.id);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        isExecutive: profile?.role === 'executive',
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Route loader guard for /portal/* routes: redirects to the login screen if there's no session.
export async function requireSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw redirect('/portal');
  }
  return data.session;
}
