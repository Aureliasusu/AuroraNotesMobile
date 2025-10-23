import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useNotesStore } from '../store/useNotesStore'
import { useAuthStore } from '../store/useAuthStore'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Note } from '../types/database'
import { Alert } from 'react-native'

export function useRealtimeNotes() {
  const { user } = useAuthStore()
  const { fetchNotes, addNote, updateNote, deleteNote } = useNotesStore()

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Note>) => {
          console.log('New note added:', payload.new)
          addNote(payload.new as Note)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Note>) => {
          console.log('Note updated:', payload.new)
          if (payload.new && 'id' in payload.new) {
            updateNote(payload.new.id, payload.new as Note)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Note>) => {
          console.log('Note deleted:', payload.old)
          if (payload.old && 'id' in payload.old) {
            deleteNote(payload.old.id as string)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time notes subscription active')
        } else if (status === 'CHANNEL_ERROR') {
          Alert.alert('Error', 'Real-time sync connection failed')
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [user, addNote, updateNote, deleteNote])

  // Manual refresh
  const refreshNotes = useCallback(async () => {
    if (!user) return

    try {
      await fetchNotes()
    } catch (error) {
      console.error('Failed to refresh notes', error)
      Alert.alert('Error', 'Failed to refresh notes')
    }
  }, [user, fetchNotes])

  // Sync notes
  const syncNotes = useCallback(async () => {
    if (!user) return

    try {
      // Get all notes from server
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        throw error
      }

      // Update local store
      if (data) {
        // This would need to be implemented in the store
        console.log('Synced notes:', data.length)
      }
    } catch (error) {
      console.error('Failed to sync notes', error)
      Alert.alert('Error', 'Failed to sync notes')
    }
  }, [user])

  return {
    refreshNotes,
    syncNotes,
  }
}