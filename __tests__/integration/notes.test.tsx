import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { NotesListScreen } from '../../src/screens/notes/NotesListScreen'

// Mock all dependencies
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    signOut: jest.fn(),
  }),
}))

jest.mock('../../src/hooks/useNotes', () => ({
  useNotes: () => ({
    notes: [
      {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        tags: [],
        word_count: 2,
        reading_time: 1,
      },
    ],
    loading: false,
    fetchNotes: jest.fn(),
    deleteNote: jest.fn(),
    togglePin: jest.fn(),
    activeNotes: [
      {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        is_pinned: false,
        is_archived: false,
        folder_id: null,
        tags: [],
        word_count: 2,
        reading_time: 1,
      },
    ],
    pinnedNotes: [],
    searchNotes: jest.fn(),
  }),
}))

jest.mock('../../src/hooks/useFolders', () => ({
  useFolders: () => ({
    folders: [],
  }),
}))

jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
    },
  }),
}))

jest.mock('../../src/hooks/useAdvancedSearch', () => ({
  useAdvancedSearch: () => ({
    filters: { query: '', tags: [], dateRange: { start: null, end: null }, sortBy: 'relevance', sortOrder: 'desc', folderId: null, isPinned: null, isArchived: null },
    results: [],
    loading: false,
    error: null,
    updateQuery: jest.fn(),
    updateTags: jest.fn(),
    addTag: jest.fn(),
    removeTag: jest.fn(),
    updateDateRange: jest.fn(),
    updateSort: jest.fn(),
    updateFolder: jest.fn(),
    updatePinned: jest.fn(),
    updateArchived: jest.fn(),
    clearFilters: jest.fn(),
    getAllTags: jest.fn(() => []),
    getSearchStats: jest.fn(() => ({ totalNotes: 0, filteredNotes: 0, hasActiveFilters: false, filterCount: 0 })),
    getFolderOptions: jest.fn(() => []),
  }),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

describe('NotesListScreen Integration', () => {
  it('renders notes list correctly', () => {
    const { getByText } = render(<NotesListScreen />)
    
    expect(getByText('My Notes')).toBeTruthy()
    expect(getByText('Test Note')).toBeTruthy()
  })

  it('handles search functionality', async () => {
    const { getByPlaceholderText } = render(<NotesListScreen />)
    
    const searchInput = getByPlaceholderText('Search notes...')
    fireEvent.changeText(searchInput, 'test')
    
    // Wait for search to complete
    await waitFor(() => {
      expect(searchInput.props.value).toBe('test')
    })
  })

  it('handles note press', () => {
    const { getByText } = render(<NotesListScreen />)
    
    const noteCard = getByText('Test Note')
    fireEvent.press(noteCard)
    
    // Navigation should be called
    // This would be tested with navigation mock
  })
})
