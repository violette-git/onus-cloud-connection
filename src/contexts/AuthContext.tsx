import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ data: any; error: any; }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any; }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  login: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
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
    console.log('Supabase object:', supabase); // Log the supabase object

    // Set up Supabase session persistence
supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
  if (initialSession) {
    setSession(initialSession);
    setUser(initialSession.user);
    console.log('Fetching profile for user ID:', initialSession.user.id); // Log user ID
    // Fetch user profile with correct headers
    try {
const { data, error } = await supabase.from('profiles').select('*').eq('id', initialSession.user.id);
      console.log('Profiles table data:', data); // Log profiles table data
      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        console.log('User profile:', data);
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
    }
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }

      if (data) {
        setUser(data.user);
        setSession(data.session);
        navigate('/');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { data: null, error };
    }
  };

const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }

    if (data && data.user) {
      // Create user profile and mark as enthusiast
      const username = email.split('@')[0];

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            username: username,
            role: 'enthusiast',
            // Add other necessary fields here
          },
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { data: null, error: profileError };
      }

      setUser(data.user);
      setSession(data.session);
      navigate('/');
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected sign up error:', error);
    return { data: null, error };
  }
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
