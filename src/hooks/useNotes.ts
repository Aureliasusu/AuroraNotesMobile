import { useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNotesStore } from '../store/useNotesStore'

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_archived: boolean
  is_pinned: boolean
  folder_id?: string | null
  created_at: string
  updated_at: string
}

export function useNotes() {
  const { user } = useAuthStore()
  const { 
    notes, 
    loading, 
    error, 
    selectedNote,
    setSelectedNote,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
  } = useNotesStore()

  // Enhanced search functionality
  const searchNotes = useCallback(async (query: string) => {
    if (!user || !query.trim()) {
      await fetchNotes()
      return
    }
    // Currently just fetch all notes and filter on client-side
    // Can implement server-side search in the future
    await fetchNotes()
  }, [user, fetchNotes])

  // Enhanced filtering functionality
  const filterByTags = useCallback(async (tags: string[]) => {
    if (!user || tags.length === 0) {
      await fetchNotes()
      return
    }
    // Currently just fetch all notes and filter on client-side
    // Can implement server-side filtering in the future
    await fetchNotes()
  }, [user, fetchNotes])

  // Get note by ID
  const getNoteById = useCallback((id: string) => {
    return notes.find(note => note.id === id) || null
  }, [notes])

  return {
    // State
    notes,
    loading,
    error,
    selectedNote,
    
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    setSelectedNote,
    
    // Enhanced functionality
    searchNotes,
    filterByTags,
    getNoteById,
    
    // Computed values
    pinnedNotes: notes.filter(note => note.is_pinned),
    archivedNotes: notes.filter(note => note.is_archived),
    activeNotes: notes.filter(note => !note.is_archived),
    totalNotes: notes.length
  }
}