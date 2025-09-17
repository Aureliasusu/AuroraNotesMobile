import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Note } from '../types/database'
import { useAuthStore } from './useAuthStore'

interface NotesState {
  notes: Note[]
  loading: boolean
  error: string | null
  selectedNote: Note | null
  setNotes: (notes: Note[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedNote: (note: Note | null) => void
  fetchNotes: () => Promise<void>
  createNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Note | null>
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note | null>
  deleteNote: (id: string) => Promise<boolean>
  clearNotes: () => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  selectedNote: null,

  setNotes: (notes) => set({ notes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedNote: (note) => set({ selectedNote: note }),

  fetchNotes: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ notes: data || [] })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch notes' })
    } finally {
      set({ loading: false })
    }
  },

  createNote: async (noteData) => {
    const { user } = useAuthStore.getState()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add to local state
      const { notes } = get()
      set({ notes: [data, ...notes] })

      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create note' })
      return null
    }
  },

  updateNote: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      const { notes } = get()
      const updatedNotes = notes.map(note => 
        note.id === id ? data : note
      )
      set({ notes: updatedNotes })

      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update note' })
      return null
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from local state
      const { notes } = get()
      const filteredNotes = notes.filter(note => note.id !== id)
      set({ notes: filteredNotes })

      return true
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete note' })
      return false
    }
  },

  clearNotes: () => set({ notes: [], selectedNote: null }),
}))
