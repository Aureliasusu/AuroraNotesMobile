import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'
import { useNotesStore } from '../store/useNotesStore'
import { useUserPresence } from './useUserPresence'
import { Note } from '../types/database'
import { Alert } from 'react-native'

interface EditingUser {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  last_seen: string
  is_online: boolean
}

interface CollaborativeEditingState {
  editingUsers: EditingUser[]
  isEditing: boolean
  currentEditor: EditingUser | null
  conflictResolution: boolean
}

export function useCollaborativeEditing(noteId: string) {
  const { user } = useAuthStore()
  const { updateNote } = useNotesStore()
  const { isOnline, lastSeen } = useUserPresence()
  
  const [state, setState] = useState<CollaborativeEditingState>({
    editingUsers: [],
    isEditing: false,
    currentEditor: null,
    conflictResolution: false,
  })

  // Subscribe to real-time editing events
  useEffect(() => {
    if (!noteId || !user) return

    const channel = supabase.channel(`note-editing-${noteId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const editingUsers = Object.values(presenceState)
          .flat()
          .map((presence: any) => ({
            id: presence.user_id,
            email: presence.email || '',
            full_name: presence.full_name || presence.email || 'Unknown',
            avatar_url: presence.avatar_url,
            last_seen: presence.last_seen || new Date().toISOString(),
            is_online: true,
          }))
          .filter((u: EditingUser) => u.id !== user.id)

        setState(prev => ({
          ...prev,
          editingUsers,
        }))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || 'Unknown',
            avatar_url: user.user_metadata?.avatar_url,
            last_seen: new Date().toISOString(),
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [noteId, user])

  // Start editing
  const startEditing = useCallback(async () => {
    if (!user || !noteId) return

    try {
      await channel.track({
        user_id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || 'Unknown',
        avatar_url: user.user_metadata?.avatar_url,
        last_seen: new Date().toISOString(),
      })

      setState(prev => ({
        ...prev,
        isEditing: true,
        currentEditor: {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || 'Unknown',
          avatar_url: user.user_metadata?.avatar_url,
          last_seen: new Date().toISOString(),
          is_online: true,
        },
      }))
    } catch (error) {
      console.error('Failed to start editing', error)
      Alert.alert('Error', 'Failed to start editing')
    }
  }, [user, noteId])

  // Stop editing
  const stopEditing = useCallback(async () => {
    if (!user || !noteId) return

    try {
      await channel.untrack()
      
      setState(prev => ({
        ...prev,
        isEditing: false,
        currentEditor: null,
      }))
    } catch (error) {
      console.error('Failed to stop editing', error)
    }
  }, [user, noteId])

  // Save changes with conflict resolution
  const saveChanges = useCallback(async (noteData: Partial<Note>) => {
    if (!user || !noteId) return

    try {
      // Check for conflicts
      const { data: existingNote, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single()

      if (error) {
        Alert.alert('Error', 'Failed to save note')
        return
      }

      // Simple conflict resolution - use latest timestamp
      const now = new Date().toISOString()
      const noteUpdate = {
        ...noteData,
        updated_at: now,
      }

      await updateNote(noteId, noteUpdate)
    } catch (error) {
      console.error('Failed to save note', error)
      Alert.alert('Error', 'Save failed')
    }
  }, [user, noteId, updateNote])

  // Resolve conflicts
  const resolveConflict = useCallback(async (noteData: Partial<Note>, resolution: 'mine' | 'theirs' | 'merge') => {
    if (!user || !noteId) return

    try {
      let finalData = noteData

      if (resolution === 'theirs') {
        // Keep existing data
        return
      } else if (resolution === 'merge') {
        // Merge changes (simplified - in real app, you'd want more sophisticated merging)
        finalData = {
          ...noteData,
          updated_at: new Date().toISOString(),
        }
      }

      await updateNote(noteId, finalData)
      setState(prev => ({
        ...prev,
        conflictResolution: false,
      }))
    } catch (error) {
      console.error('Failed to resolve conflict', error)
      Alert.alert('Error', 'Failed to resolve conflict')
    }
  }, [user, noteId, updateNote])

  return {
    ...state,
    startEditing,
    stopEditing,
    saveChanges,
    resolveConflict,
  }
}
