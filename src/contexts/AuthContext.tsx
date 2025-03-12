import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  login: async () => {},
  signUp: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up Supabase session persistence
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event);
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Temporary mock authentication methods
  const login = async (email: string, password: string) => {
    if (email === 'test@onus.com' && password === 'testpass123') {
      const mockUser = {
        id: 'mock-user-123',
        email: 'test@onus.com',
        user_metadata: { name: 'Test User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as unknown as User;
      
      setUser(mockUser);
      setSession({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session);
      navigate('/');
    }
  };

  const signUp = async (email: string, password: string) => {
    // For testing purposes, treat signup same as login
    return login(email, password);
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    login,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
