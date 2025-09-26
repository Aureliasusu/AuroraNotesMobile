import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'
import { Alert } from 'react-native'

interface NoteShare {
  id: string
  note_id: string
  shared_by: string
  shared_with: string
  permission: 'read' | 'write' | 'admin'
  created_at: string
  updated_at: string
}

interface NoteSharingState {
  shares: NoteShare[]
  loading: boolean
  error: string | null
}

export function useNoteSharing() {
  const { user } = useAuthStore()
  const [state, setState] = useState<NoteSharingState>({
    shares: [],
    loading: false,
    error: null,
  })

  // Load note shares
  const loadShares = useCallback(async (noteId: string) => {
    if (!user) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase
        .from('note_shares')
        .select('*')
        .eq('note_id', noteId)

      if (error) {
        Alert.alert('Error', `Failed to load note shares: ${error.message}`)
        return
      }

      setState(prev => ({
        ...prev,
        shares: data || [],
        loading: false,
      }))
    } catch (error) {
      Alert.alert('Error', 'Failed to load note shares')
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load shares',
      }))
    }
  }, [user])

  // Share note with user
  const shareNote = useCallback(async (
    noteId: string,
    userEmail: string,
    permission: 'read' | 'write' | 'admin' = 'read'
  ) => {
    if (!user || !noteId || !userEmail) {
      Alert.alert('Error', 'Missing required information')
      return
    }

    try {
      // First, find the user by email
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', userEmail)
        .single()

      if (userError || !targetUser) {
        Alert.alert('Error', 'User not found')
        return
      }

      // Create the share
      const { data, error } = await supabase
        .from('note_shares')
        .insert({
          note_id: noteId,
          shared_by: user.id,
          shared_with: targetUser.id,
          permission: permission,
        })

      if (error) {
        Alert.alert('Error', 'Failed to share note')
        return
      }

      Alert.alert('Success', `Note shared with ${targetUser.full_name || targetUser.email}`)
      await loadShares(noteId)
    } catch (error) {
      Alert.alert('Error', 'Failed to share note')
    }
  }, [user, loadShares])

  // Update share permission
  const updateSharePermission = useCallback(async (
    shareId: string,
    permission: 'read' | 'write' | 'admin'
  ) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('note_shares')
        .update({ permission })
        .eq('id', shareId)

      if (error) {
        Alert.alert('Error', 'Failed to update permission')
        return
      }

      Alert.alert('Success', 'Permission updated')
    } catch (error) {
      Alert.alert('Error', 'Failed to update permission')
    }
  }, [user])

  // Remove share
  const removeShare = useCallback(async (shareId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('note_shares')
        .delete()
        .eq('id', shareId)

      if (error) {
        Alert.alert('Error', 'Failed to remove share')
        return
      }

      Alert.alert('Success', 'Share removed')
    } catch (error) {
      Alert.alert('Error', 'Failed to remove share')
    }
  }, [user])

  // Get shared notes
  const getSharedNotes = useCallback(async () => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('note_shares')
        .select(`
          *,
          notes (
            id,
            title,
            content,
            created_at,
            updated_at
          )
        `)
        .eq('shared_with', user.id)

      if (error) {
        Alert.alert('Error', `Failed to load shared notes: ${error.message}`)
        return []
      }

      return data || []
    } catch (error) {
      Alert.alert('Error', 'Failed to load shared notes')
      return []
    }
  }, [user])

  return {
    ...state,
    loadShares,
    shareNote,
    updateSharePermission,
    removeShare,
    getSharedNotes,
  }
}