import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { useAuthStore } from '../store/useAuthStore'
import { useNotesStore } from '../store/useNotesStore'


export function useAuth() {
  // const authState: AuthState = {
  //   user: null,
  //   session: null,
  //   loading: true
  // }

  const { 
    user, 
    session, 
    loading, 
    setUser, 
    setSession, 
    setLoading 
  } = useAuthStore()

  const { clearNotes } = useNotesStore()

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading])

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        Alert.alert('Sign In Failed', error.message)
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? error.message : 'Sign in failed'
      Alert.alert('Sign In Failed', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign up
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        Alert.alert('Sign Up Failed', error.message)
        return { success: false, error: error.message }
      }

      Alert.alert('Sign Up Success', 'Please check your email to verify your account')
      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? error.message : 'Sign up failed'
      Alert.alert('Sign Up Failed', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        Alert.alert('Sign Out Failed', error.message)
        return { success: false, error: error.message }
      }

      // Clear local state
      clearNotes()
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? error.message : 'Sign out failed'
      Alert.alert('Sign Out Failed', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        Alert.alert('Reset Password Failed', error.message)
        return { success: false, error: error.message }
      }

      Alert.alert('Reset Password', 'Please check your email to reset your password')
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? error.message : 'Reset password failed'
      Alert.alert('Reset Password Failed', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const initializeAuth = async () => {
    try {
      setLoading(true)
      const { data: { session: authSession } } = await supabase.auth.getSession()
      setSession(authSession)
      setUser(authSession?.user ?? null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    initializeAuth,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}