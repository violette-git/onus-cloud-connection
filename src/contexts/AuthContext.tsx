import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      if (initialSession) {
        setSession(initialSession)
        setUser(initialSession.user)
      }
      setLoading(false)

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id)
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    const cleanup = initializeAuth()
    return () => {
      cleanup.then(unsubscribe => unsubscribe?.())
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}