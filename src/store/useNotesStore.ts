import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Note } from '../types/database'
import { useAuthStore } from './useAuthStore'

interface NotesState {
  notes: Note[]
  selectedNote: Note | null
  loading: boolean
  error: string | null
}

interface NotesActions {
  setNotes: (notes: Note[]) => void
  setSelectedNote: (note: Note | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchNotes: () => Promise<void>
  createNote: (noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note | null>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  toggleArchive: (id: string) => Promise<void>
  searchNotes: (query: string) => Note[]
  getNotesByFolder: (folderId: string) => Note[]
  clearNotes: () => void
  addNote: (note: Note) => void
}

export const useNotesStore = create<NotesState & NotesActions>((set, get) => ({
  // State
  notes: [],
  selectedNote: null,
  loading: false,
  error: null,

  // Actions
  setNotes: (notes) => set({ notes }),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchNotes: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        set({ error: error.message })
        return
      }

      set({ notes: data || [] })
    } catch (error) {
      set({ error: 'Failed to fetch notes' })
    } finally {
      set({ loading: false })
    }
  },

  createNote: async (noteData) => {
    const { user } = useAuthStore.getState()
    if (!user) return null

    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...noteData, user_id: user.id } as any] as any)
        .select()
        .single()

      if (error) {
        set({ error: error.message })
        return null
      }

      const { notes } = get()
      set({ notes: [data, ...notes] })
      return data
    } catch (error) {
      set({ error: 'Failed to create note' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  updateNote: async (id, updates) => {
    try {
      set({ loading: true, error: null })
      
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id)

      if (error) {
        set({ error: error.message })
        return
      }

      const { notes } = get()
      const updatedNotes = notes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
      set({ notes: updatedNotes })
    } catch (error) {
      set({ error: 'Failed to update note' })
    } finally {
      set({ loading: false })
    }
  },

  deleteNote: async (id) => {
    try {
      set({ loading: true, error: null })
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) {
        set({ error: error.message })
        return
      }

      const { notes } = get()
      set({ notes: notes.filter(note => note.id !== id) })
    } catch (error) {
      set({ error: 'Failed to delete note' })
    } finally {
      set({ loading: false })
    }
  },

  togglePin: async (id) => {
    const { notes } = get()
    const note = notes.find(n => n.id === id)
    if (!note) return

    await get().updateNote(id, { is_pinned: !note.is_pinned })
  },

  toggleArchive: async (id) => {
    const { notes } = get()
    const note = notes.find(n => n.id === id)
    if (!note) return

    await get().updateNote(id, { is_archived: !note.is_archived })
  },

  searchNotes: (query) => {
    const { notes } = get()
    if (!query.trim()) return notes

    const lowercaseQuery = query.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  },

  getNotesByFolder: (folderId) => {
    const { notes } = get()
    return notes.filter(note => note.folder_id === folderId)
  },

  clearNotes: () => {
    set({ notes: [], selectedNote: null })
  },

  addNote: (note) => {
    set(state => ({ notes: [...state.notes, note] }))
  },
}))