import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Profile } from '../types/database'

interface AuthState {
  user: any | null
  session: any | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  setUser: (user: any | null) => void
  setSession: (session: any | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  signOut: async () => {
    try {
      set({ loading: true })
      await supabase.auth.signOut()
      set({ user: null, profile: null })
    } catch (error) {
      // console.error('Sign out error:', error)
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return

    try {
      set({ loading: true })
      
      const { error } = await supabase
        .from('profiles')
        .update(updates as any)
        .eq('id', user.id)

      if (error) {
        // console.error('Profile update error:', error)
        return
      }

      // Update local state
      const { profile } = get()
      if (profile) {
        set({ profile: { ...profile, ...updates } })
      }
    } catch (error) {
      // console.error('Profile update error:', error)
    } finally {
      set({ loading: false })
    }
  },
}))