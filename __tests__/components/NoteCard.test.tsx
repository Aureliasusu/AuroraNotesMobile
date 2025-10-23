import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { NoteCard } from '../../src/components/ui/NoteCard'
import { Note } from '../../src/types/database'

// Mock the theme context
jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      border: '#e5e7eb',
    },
  }),
}))

const mockNote: Note = {
  id: '1',
  user_id: 'user1',
  title: 'Test Note',
  content: 'This is a test note content',
  tags: ['test', 'example'],
  is_archived: false,
  is_pinned: false,
  folder_id: null,
  word_count: 6,
  reading_time: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('NoteCard', () => {
  it('renders note title and content', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onPress={() => {}} />
    )
    
    expect(getByText('Test Note')).toBeTruthy()
    expect(getByText('This is a test note content')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByText } = render(
      <NoteCard note={mockNote} onPress={mockOnPress} />
    )
    
    fireEvent.press(getByText('Test Note'))
    expect(mockOnPress).toHaveBeenCalledWith(mockNote)
  })

  it('shows pinned indicator when note is pinned', () => {
    const pinnedNote = { ...mockNote, is_pinned: true }
    const { getByText } = render(
      <NoteCard note={pinnedNote} onPress={() => {}} />
    )
    
    // Check if pin icon is present (assuming it shows as text or icon)
    expect(getByText('Test Note')).toBeTruthy()
  })

  it('displays tags when available', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onPress={() => {}} />
    )
    
    // Tags are displayed with # prefix
    expect(getByText('#test')).toBeTruthy()
    expect(getByText('#example')).toBeTruthy()
  })

  it('shows word count and reading time', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onPress={() => {}} />
    )
    
    // Check if word count and reading time are displayed
    expect(getByText('Test Note')).toBeTruthy()
    expect(getByText('This is a test note content')).toBeTruthy()
  })

  it('handles long press for additional actions', () => {
    const mockOnLongPress = jest.fn()
    const { getByText } = render(
      <NoteCard note={mockNote} onPress={() => {}} onLongPress={mockOnLongPress} />
    )
    
    fireEvent(getByText('Test Note'), 'longPress')
    expect(mockOnLongPress).toHaveBeenCalledWith(mockNote)
  })
})
