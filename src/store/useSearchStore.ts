import { create } from 'zustand'
import { Note } from '../types/database'

export interface SearchFilters {
  query: string
  tags: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  sortBy: 'relevance' | 'date_created' | 'date_updated' | 'title' | 'word_count'
  sortOrder: 'asc' | 'desc'
  folderId: string | null
  isPinned: boolean | null
  isArchived: boolean | null
}

export interface SearchResult {
  note: Note
  relevanceScore: number
  matchedFields: string[]
  highlights: {
    title: string
    content: string
  }
}

interface SearchState {
  filters: SearchFilters
  results: SearchResult[]
  loading: boolean
  error: string | null
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  searchNotes: (notes: Note[]) => SearchResult[]
  setResults: (results: SearchResult[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: SearchFilters = {
  query: '',
  tags: [],
  dateRange: {
    start: null,
    end: null
  },
  sortBy: 'relevance',
  sortOrder: 'desc',
  folderId: null,
  isPinned: null,
  isArchived: null
}

export const useSearchStore = create<SearchState>((set, get) => ({
  filters: defaultFilters,
  results: [],
  loading: false,
  error: null,

  // Set search filters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },

  // Reset all filters to default
  resetFilters: () => {
    set({ filters: defaultFilters })
  },

  // Search notes with current filters
  searchNotes: (notes) => {
    const { filters } = get()
    let filteredNotes = [...notes]

    // Filter by query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase()
      filteredNotes = filteredNotes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(query)
        const contentMatch = note.content.toLowerCase().includes(query)
        const tagsMatch = note.tags.some(tag => tag.toLowerCase().includes(query))
        return titleMatch || contentMatch || tagsMatch
      })
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        filters.tags.every(tag => note.tags.includes(tag))
      )
    }

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filteredNotes = filteredNotes.filter(note => {
        const noteDate = new Date(note.created_at)
        const startDate = filters.dateRange.start
        const endDate = filters.dateRange.end

        if (startDate && noteDate < startDate) return false
        if (endDate && noteDate > endDate) return false
        return true
      })
    }

    // Filter by folder
    if (filters.folderId !== null) {
      filteredNotes = filteredNotes.filter(note => note.folder_id === filters.folderId)
    }

    // Filter by pinned status
    if (filters.isPinned !== null) {
      filteredNotes = filteredNotes.filter(note => note.is_pinned === filters.isPinned)
    }

    // Filter by archived status
    if (filters.isArchived !== null) {
      filteredNotes = filteredNotes.filter(note => note.is_archived === filters.isArchived)
    }

    // Calculate relevance scores and create results
    const results: SearchResult[] = filteredNotes.map(note => {
      const relevanceScore = calculateRelevanceScore(note, filters.query)
      const matchedFields = getMatchedFields(note, filters.query)
      const highlights = generateHighlights(note, filters.query)

      return {
        note,
        relevanceScore,
        matchedFields,
        highlights
      }
    })

    // Sort results
    const sortedResults = sortResults(results, filters.sortBy, filters.sortOrder)

    set({ results: sortedResults })
    return sortedResults
  },

  // Set search results
  setResults: (results) => set({ results }),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error state
  setError: (error) => set({ error })
}))

// Calculate relevance score for a note
function calculateRelevanceScore(note: Note, query: string): number {
  if (!query.trim()) return 0

  const queryLower = query.toLowerCase()
  let score = 0

  // Title match (highest weight)
  if (note.title.toLowerCase().includes(queryLower)) {
    score += 10
  }

  // Content match
  const contentMatches = (note.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length
  score += contentMatches * 2

  // Tags match
  const tagMatches = note.tags.filter(tag => tag.toLowerCase().includes(queryLower)).length
  score += tagMatches * 5

  // Exact match bonus
  if (note.title.toLowerCase() === queryLower) {
    score += 20
  }

  // Pinned notes get slight boost
  if (note.is_pinned) {
    score += 1
  }

  return score
}

// Get matched fields for a note
function getMatchedFields(note: Note, query: string): string[] {
  if (!query.trim()) return []

  const queryLower = query.toLowerCase()
  const fields: string[] = []

  if (note.title.toLowerCase().includes(queryLower)) {
    fields.push('title')
  }

  if (note.content.toLowerCase().includes(queryLower)) {
    fields.push('content')
  }

  if (note.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
    fields.push('tags')
  }

  return fields
}

// Generate highlights for search results
function generateHighlights(note: Note, query: string): { title: string; content: string } {
  if (!query.trim()) {
    return {
      title: note.title,
      content: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')
    }
  }

  const queryLower = query.toLowerCase()
  
  // Highlight title
  const titleHighlight = highlightText(note.title, queryLower)
  
  // Highlight content (first 200 chars)
  const contentPreview = note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')
  const contentHighlight = highlightText(contentPreview, queryLower)

  return {
    title: titleHighlight,
    content: contentHighlight
  }
}

// Highlight matching text
function highlightText(text: string, query: string): string {
  if (!query) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '**$1**')
}

// Sort search results
function sortResults(results: SearchResult[], sortBy: string, sortOrder: string): SearchResult[] {
  return [...results].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'relevance':
        comparison = a.relevanceScore - b.relevanceScore
        break
      case 'date_created':
        comparison = new Date(a.note.created_at).getTime() - new Date(b.note.created_at).getTime()
        break
      case 'date_updated':
        comparison = new Date(a.note.updated_at).getTime() - new Date(b.note.updated_at).getTime()
        break
      case 'title':
        comparison = a.note.title.localeCompare(b.note.title)
        break
      case 'word_count':
        comparison = a.note.word_count - b.note.word_count
        break
      default:
        comparison = 0
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })
}
