import { renderHook, waitFor } from '@testing-library/react-native'
import { useAdvancedSearch } from '../../src/hooks/useAdvancedSearch'
import { useSearchStore } from '../../src/store/useSearchStore'
import { useNotes } from '../../src/hooks/useNotes'
import { useFolders } from '../../src/hooks/useFolders'

// Mock dependencies
jest.mock('../../src/store/useSearchStore')
jest.mock('../../src/hooks/useNotes')
jest.mock('../../src/hooks/useFolders')

describe('useAdvancedSearch', () => {
  const mockNotes = [
    {
      id: '1',
      title: 'Test Note 1',
      content: 'Content 1',
      tags: ['react', 'testing'],
      is_pinned: false,
      is_archived: false,
      folder_id: 'folder1',
    },
    {
      id: '2',
      title: 'Test Note 2',
      content: 'Content 2',
      tags: ['javascript', 'testing'],
      is_pinned: true,
      is_archived: false,
      folder_id: 'folder2',
    },
  ]

  const mockFolders = [
    { id: 'folder1', name: 'Work' },
    { id: 'folder2', name: 'Personal' },
  ]

  const mockSetFilters = jest.fn()
  const mockResetFilters = jest.fn()
  const mockSearchNotes = jest.fn()
  const mockSetLoading = jest.fn()
  const mockSetError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    ;(useNotes as jest.Mock).mockReturnValue({
      notes: mockNotes,
    })

    ;(useFolders as jest.Mock).mockReturnValue({
      folders: mockFolders,
    })

    ;(useSearchStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        query: '',
        tags: [],
        dateRange: { start: null, end: null },
        sortBy: 'updated_at',
        sortOrder: 'desc',
        folderId: null,
        isPinned: null,
        isArchived: null,
      },
      results: mockNotes,
      loading: false,
      error: null,
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
      searchNotes: mockSearchNotes,
      setLoading: mockSetLoading,
      setError: mockSetError,
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    expect(result.current.filters).toBeDefined()
    expect(result.current.results).toEqual(mockNotes)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should update query filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updateQuery('test query')

    expect(mockSetFilters).toHaveBeenCalledWith({ query: 'test query' })
  })

  it('should update tags filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updateTags(['react', 'testing'])

    expect(mockSetFilters).toHaveBeenCalledWith({ tags: ['react', 'testing'] })
  })

  it('should add tag to filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.addTag('javascript')

    expect(mockSetFilters).toHaveBeenCalledWith({ tags: ['javascript'] })
  })

  it('should not add duplicate tag', () => {
    ;(useSearchStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        query: '',
        tags: ['react'],
        dateRange: { start: null, end: null },
        sortBy: 'updated_at',
        sortOrder: 'desc',
        folderId: null,
        isPinned: null,
        isArchived: null,
      },
      results: mockNotes,
      loading: false,
      error: null,
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
      searchNotes: mockSearchNotes,
      setLoading: mockSetLoading,
      setError: mockSetError,
    })

    const { result } = renderHook(() => useAdvancedSearch())

    result.current.addTag('react')

    expect(mockSetFilters).not.toHaveBeenCalled()
  })

  it('should remove tag from filter', () => {
    ;(useSearchStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        query: '',
        tags: ['react', 'testing'],
        dateRange: { start: null, end: null },
        sortBy: 'updated_at',
        sortOrder: 'desc',
        folderId: null,
        isPinned: null,
        isArchived: null,
      },
      results: mockNotes,
      loading: false,
      error: null,
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
      searchNotes: mockSearchNotes,
      setLoading: mockSetLoading,
      setError: mockSetError,
    })

    const { result } = renderHook(() => useAdvancedSearch())

    result.current.removeTag('react')

    expect(mockSetFilters).toHaveBeenCalledWith({ tags: ['testing'] })
  })

  it('should update date range', () => {
    const { result } = renderHook(() => useAdvancedSearch())
    const start = new Date('2024-01-01')
    const end = new Date('2024-12-31')

    result.current.updateDateRange(start, end)

    expect(mockSetFilters).toHaveBeenCalledWith({ dateRange: { start, end } })
  })

  it('should update sort options', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updateSort('title', 'asc')

    expect(mockSetFilters).toHaveBeenCalledWith({ sortBy: 'title', sortOrder: 'asc' })
  })

  it('should update folder filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updateFolder('folder1')

    expect(mockSetFilters).toHaveBeenCalledWith({ folderId: 'folder1' })
  })

  it('should update pinned filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updatePinned(true)

    expect(mockSetFilters).toHaveBeenCalledWith({ isPinned: true })
  })

  it('should update archived filter', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.updateArchived(false)

    expect(mockSetFilters).toHaveBeenCalledWith({ isArchived: false })
  })

  it('should clear all filters', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    result.current.clearFilters()

    expect(mockResetFilters).toHaveBeenCalled()
  })

  it('should get all unique tags from notes', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    const tags = result.current.getAllTags()

    expect(tags).toEqual(['javascript', 'react', 'testing'])
  })

  it('should get search statistics', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    const stats = result.current.getSearchStats()

    expect(stats.totalNotes).toBe(2)
    expect(stats.filteredNotes).toBe(2)
    expect(stats.hasActiveFilters).toBe(false)
    expect(stats.filterCount).toBe(0)
  })

  it('should get folder options', () => {
    const { result } = renderHook(() => useAdvancedSearch())

    const options = result.current.getFolderOptions()

    expect(options).toHaveLength(4)
    expect(options[0]).toEqual({ id: null, name: 'All Folders' })
    expect(options[1]).toEqual({ id: 'starred', name: 'Starred Notes' })
    expect(options[2]).toEqual({ id: 'folder1', name: 'Work' })
    expect(options[3]).toEqual({ id: 'folder2', name: 'Personal' })
  })

  it('should perform search when notes change', async () => {
    renderHook(() => useAdvancedSearch())

    await waitFor(() => {
      expect(mockSearchNotes).toHaveBeenCalledWith(mockNotes)
    })
  })
})

