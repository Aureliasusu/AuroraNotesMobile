import { renderHook, act } from '@testing-library/react-native'
import { useSearchStore } from '../../src/store/useSearchStore'

describe('useSearchStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useSearchStore())
    act(() => {
      result.current.resetFilters()
      result.current.setResults([])
      result.current.setError(null)
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSearchStore())

    expect(result.current.filters.query).toBe('')
    expect(result.current.filters.tags).toEqual([])
    expect(result.current.filters.sortBy).toBe('relevance')
    expect(result.current.filters.sortOrder).toBe('desc')
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set filters', () => {
    const { result } = renderHook(() => useSearchStore())

    act(() => {
      result.current.setFilters({ query: 'test' })
    })

    expect(result.current.filters.query).toBe('test')
  })

  it('should merge filters when setting', () => {
    const { result } = renderHook(() => useSearchStore())

    act(() => {
      result.current.setFilters({ query: 'test' })
      result.current.setFilters({ tags: ['react'] })
    })

    expect(result.current.filters.query).toBe('test')
    expect(result.current.filters.tags).toEqual(['react'])
  })

  it('should reset filters to default', () => {
    const { result } = renderHook(() => useSearchStore())

    act(() => {
      result.current.setFilters({ query: 'test', tags: ['react'] })
      result.current.resetFilters()
    })

    expect(result.current.filters.query).toBe('')
    expect(result.current.filters.tags).toEqual([])
    expect(result.current.filters.sortBy).toBe('relevance')
  })

  it('should search notes by query', () => {
    const { result } = renderHook(() => useSearchStore())
    const mockNotes = [
      {
        id: '1',
        title: 'React Testing',
        content: 'Learn how to test React components',
        tags: ['react', 'testing'],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Vue Guide',
        content: 'Introduction to Vue.js',
        tags: ['vue'],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
      },
    ]

    act(() => {
      result.current.setFilters({ query: 'react' })
      const results = result.current.searchNotes(mockNotes)
      result.current.setResults(results)
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].note.id).toBe('1')
  })

  it('should filter notes by tags', () => {
    const { result } = renderHook(() => useSearchStore())
    const mockNotes = [
      {
        id: '1',
        title: 'Note 1',
        content: 'Content 1',
        tags: ['react', 'testing'],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Note 2',
        content: 'Content 2',
        tags: ['vue'],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
      },
    ]

    act(() => {
      result.current.setFilters({ tags: ['react'] })
      const results = result.current.searchNotes(mockNotes)
      result.current.setResults(results)
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].note.id).toBe('1')
  })

  it('should filter notes by pinned status', () => {
    const { result } = renderHook(() => useSearchStore())
    const mockNotes = [
      {
        id: '1',
        title: 'Pinned Note',
        content: 'Content',
        tags: [],
        is_pinned: true,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Regular Note',
        content: 'Content',
        tags: [],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
      },
    ]

    act(() => {
      result.current.setFilters({ isPinned: true })
      const results = result.current.searchNotes(mockNotes)
      result.current.setResults(results)
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].note.is_pinned).toBe(true)
  })

  it('should filter notes by archived status', () => {
    const { result } = renderHook(() => useSearchStore())
    const mockNotes = [
      {
        id: '1',
        title: 'Active Note',
        content: 'Content',
        tags: [],
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      {
        id: '2',
        title: 'Archived Note',
        content: 'Content',
        tags: [],
        is_pinned: false,
        is_archived: true,
        folder_id: null,
        user_id: 'user1',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
      },
    ]

    act(() => {
      result.current.setFilters({ isArchived: false })
      const results = result.current.searchNotes(mockNotes)
      result.current.setResults(results)
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].note.is_archived).toBe(false)
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useSearchStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should set error state', () => {
    const { result } = renderHook(() => useSearchStore())
    const errorMessage = 'Search failed'

    act(() => {
      result.current.setError(errorMessage)
    })

    expect(result.current.error).toBe(errorMessage)

    act(() => {
      result.current.setError(null)
    })

    expect(result.current.error).toBeNull()
  })

  it('should set results', () => {
    const { result } = renderHook(() => useSearchStore())
    const mockResults = [
      {
        note: {
          id: '1',
          title: 'Test',
          content: 'Content',
          tags: [],
          is_pinned: false,
          is_archived: false,
          folder_id: null,
          user_id: 'user1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        relevanceScore: 0.95,
        matchedFields: ['title'],
        highlights: {
          title: 'Test',
          content: 'Content',
        },
      },
    ]

    act(() => {
      result.current.setResults(mockResults)
    })

    expect(result.current.results).toEqual(mockResults)
  })
})

