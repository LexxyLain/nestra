import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '../services/supabase'
import type {
  AuthContextValue,
  UserProfile,
} from '../types/auth'
import { AuthContext } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
          id,
          first_name,
          last_name,
          email,
          role,
          account_status,
          applicant_type,
          avatar_url
        `,
      )
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Unable to load profile:', error.message)
      setProfile(null)
      return
    }

    setProfile(data as UserProfile)
  }

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      setSession(currentSession)

      if (currentSession?.user) {
        await loadProfile(currentSession.user.id)
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    void initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, updatedSession) => {
        setSession(updatedSession)

        if (updatedSession?.user) {
          void loadProfile(updatedSession.user.id)
        } else {
          setProfile(null)
        }

        setIsLoading(false)
      },
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    setSession(null)
    setProfile(null)
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    profile,
    isLoading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider