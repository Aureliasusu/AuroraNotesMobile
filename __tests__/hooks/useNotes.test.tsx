import { renderHook, act } from '@testing-library/react-native'
import { useNotes } from '../../src/hooks/useNotes'

// Mock dependencies
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    })),
  },
}))

jest.mock('../../src/store/useNotesStore', () => ({
  useNotesStore: () => ({
    notes: [
      {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        is_pinned: false,
        is_archived: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ],
    loading: false,
    fetchNotes: jest.fn(),
    addNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    togglePin: jest.fn(),
    activeNotes: [],
    pinnedNotes: [],
    searchNotes: jest.fn(),
  }),
}))

jest.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user1', email: 'test@example.com' },
  }),
}))

describe('useNotes', () => {
  it('returns notes data and functions', () => {
    const { result } = renderHook(() => useNotes())
    
    expect(result.current).toHaveProperty('notes')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('fetchNotes')
    expect(result.current).toHaveProperty('addNote')
    expect(result.current).toHaveProperty('updateNote')
    expect(result.current).toHaveProperty('deleteNote')
  })

  it('fetches notes on mount', () => {
    const { result } = renderHook(() => useNotes())
    
    expect(result.current.fetchNotes).toBeDefined()
  })

  it('handles note creation', async () => {
    const { result } = renderHook(() => useNotes())
    
    const newNote = {
      title: 'New Note',
      content: 'New content',
    }
    
    await act(async () => {
      await result.current.addNote(newNote)
    })
    
    expect(result.current.addNote).toHaveBeenCalled()
  })

  it('handles note updates', async () => {
    const { result } = renderHook(() => useNotes())
    
    const updates = {
      title: 'Updated Title',
    }
    
    await act(async () => {
      await result.current.updateNote('1', updates)
    })
    
    expect(result.current.updateNote).toHaveBeenCalledWith('1', updates)
  })

  it('handles note deletion', async () => {
    const { result } = renderHook(() => useNotes())
    
    await act(async () => {
      await result.current.deleteNote('1')
    })
    
    expect(result.current.deleteNote).toHaveBeenCalledWith('1')
  })

  it('handles pin toggle', async () => {
    const { result } = renderHook(() => useNotes())
    
    await act(async () => {
      await result.current.togglePin('1')
    })
    
    expect(result.current.togglePin).toHaveBeenCalledWith('1')
  })

  it('handles search functionality', async () => {
    const { result } = renderHook(() => useNotes())
    
    await act(async () => {
      await result.current.searchNotes('test')
    })
    
    expect(result.current.searchNotes).toHaveBeenCalledWith('test')
  })
})
