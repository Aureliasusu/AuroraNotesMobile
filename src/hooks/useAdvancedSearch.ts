import { useCallback, useEffect } from 'react'
import { useSearchStore } from '../store/useSearchStore'
import { useNotes } from './useNotes'
import { useFolders } from './useFolders'
import { Note } from '../types/database'

export function useAdvancedSearch() {
  const { notes } = useNotes()
  const { folders } = useFolders()
  const {
    filters,
    results,
    loading,
    error,
    setFilters,
    resetFilters,
    searchNotes,
    setLoading,
    setError
  } = useSearchStore()

  // Perform search when filters change
  useEffect(() => {
    if (notes.length > 0) {
      const performSearch = async () => {
        setLoading(true)
        try {
          searchNotes(notes)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed')
        } finally {
          setLoading(false)
        }
      }
      performSearch()
    }
  }, [notes, filters, searchNotes, setLoading, setError])

  // Update search query
  const updateQuery = useCallback((query: string) => {
    setFilters({ query })
  }, [setFilters])

  // Update tags filter
  const updateTags = useCallback((tags: string[]) => {
    setFilters({ tags })
  }, [setFilters])

  // Add tag to filter
  const addTag = useCallback((tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters({ tags: [...filters.tags, tag] })
    }
  }, [filters.tags, setFilters])

  // Remove tag from filter
  const removeTag = useCallback((tag: string) => {
    setFilters({ tags: filters.tags.filter(t => t !== tag) })
  }, [filters.tags, setFilters])

  // Update date range
  const updateDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters({ dateRange: { start, end } })
  }, [setFilters])

  // Update sort options
  const updateSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters({ sortBy: sortBy as any, sortOrder })
  }, [setFilters])

  // Update folder filter
  const updateFolder = useCallback((folderId: string | null) => {
    setFilters({ folderId })
  }, [setFilters])

  // Update pinned filter
  const updatePinned = useCallback((isPinned: boolean | null) => {
    setFilters({ isPinned })
  }, [setFilters])

  // Update archived filter
  const updateArchived = useCallback((isArchived: boolean | null) => {
    setFilters({ isArchived })
  }, [setFilters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    resetFilters()
  }, [resetFilters])

  // Get all available tags from notes
  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>()
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [notes])

  // Get search statistics
  const getSearchStats = useCallback(() => {
    const totalNotes = notes.length
    const filteredNotes = results.length
    const hasActiveFilters = 
      filters.query.trim() !== '' ||
      filters.tags.length > 0 ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      filters.folderId !== null ||
      filters.isPinned !== null ||
      filters.isArchived !== null

    return {
      totalNotes,
      filteredNotes,
      hasActiveFilters,
      filterCount: [
        filters.query.trim() !== '' ? 1 : 0,
        filters.tags.length,
        filters.dateRange.start !== null ? 1 : 0,
        filters.dateRange.end !== null ? 1 : 0,
        filters.folderId !== null ? 1 : 0,
        filters.isPinned !== null ? 1 : 0,
        filters.isArchived !== null ? 1 : 0
      ].reduce((sum, count) => sum + count, 0)
    }
  }, [notes.length, results.length, filters])

  // Get folder options for filter
  const getFolderOptions = useCallback(() => {
    return [
      { id: null, name: 'All Folders' },
      { id: 'starred', name: 'Starred Notes' },
      ...folders.map(folder => ({
        id: folder.id,
        name: folder.name
      }))
    ]
  }, [folders])

  return {
    // State
    filters,
    results,
    loading,
    error,
    
    // Actions
    updateQuery,
    updateTags,
    addTag,
    removeTag,
    updateDateRange,
    updateSort,
    updateFolder,
    updatePinned,
    updateArchived,
    clearFilters,
    
    // Utilities
    getAllTags,
    getSearchStats,
    getFolderOptions
  }
}
