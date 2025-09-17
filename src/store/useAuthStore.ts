import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Profile } from '../types/database'

interface AuthState {
  user: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        set({ user: profile, loading: false })
        return { success: true }
      }

      return { success: false, error: 'No user data returned' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        set({ user: data.user as any, loading: false })
        return { success: true }
      }

      return { success: false, error: 'No user data returned' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, loading: false })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
