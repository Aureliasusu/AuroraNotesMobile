import { renderHook, waitFor } from '@testing-library/react-native'
import { useRealtimeNotes } from '../../src/hooks/useRealtimeNotes'
import { useAuthStore } from '../../src/store/useAuthStore'
import { useNotesStore } from '../../src/store/useNotesStore'
import { supabase } from '../../src/lib/supabase'

// Mock dependencies
jest.mock('../../src/store/useAuthStore')
jest.mock('../../src/store/useNotesStore')
jest.mock('../../src/lib/supabase')

describe('useRealtimeNotes', () => {
  const mockUser = { id: 'user1' }
  const mockAddNote = jest.fn()
  const mockUpdateNote = jest.fn()
  const mockDeleteNote = jest.fn()

  const mockChannel = {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
    })
    ;(useNotesStore as unknown as jest.Mock).mockReturnValue({
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
    })
    ;(supabase.channel as jest.Mock).mockReturnValue(mockChannel)
  })

  it('should set up real-time subscription when user is authenticated', () => {
    renderHook(() => useRealtimeNotes())

    expect(supabase.channel).toHaveBeenCalledWith('notes_changes')
    expect(mockChannel.on).toHaveBeenCalledTimes(3) // INSERT, UPDATE, DELETE
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('should not set up subscription when user is not authenticated', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    })

    renderHook(() => useRealtimeNotes())

    expect(supabase.channel).not.toHaveBeenCalled()
  })

  it('should handle INSERT event', async () => {
    let insertHandler: any

    mockChannel.on.mockImplementation((config: any, handler: any) => {
      if (config.event === 'INSERT') {
        insertHandler = handler
      }
      return mockChannel
    })

    renderHook(() => useRealtimeNotes())

    const newNote = {
      id: '1',
      title: 'New Note',
      content: 'Content',
      user_id: 'user1',
    }

    // Simulate INSERT event
    insertHandler({ new: newNote })

    expect(mockAddNote).toHaveBeenCalledWith(newNote)
  })

  it('should handle UPDATE event', async () => {
    let updateHandler: any

    mockChannel.on.mockImplementation((config: any, handler: any) => {
      if (config.event === 'UPDATE') {
        updateHandler = handler
      }
      return mockChannel
    })

    renderHook(() => useRealtimeNotes())

    const updatedNote = {
      id: '1',
      title: 'Updated Note',
      content: 'Updated Content',
    }

    // Simulate UPDATE event
    updateHandler({ new: updatedNote })

    expect(mockUpdateNote).toHaveBeenCalledWith('1', updatedNote)
  })

  it('should handle DELETE event', async () => {
    let deleteHandler: any

    mockChannel.on.mockImplementation((config: any, handler: any) => {
      if (config.event === 'DELETE') {
        deleteHandler = handler
      }
      return mockChannel
    })

    renderHook(() => useRealtimeNotes())

    // Simulate DELETE event
    deleteHandler({ old: { id: '1' } })

    expect(mockDeleteNote).toHaveBeenCalledWith('1')
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useRealtimeNotes())

    unmount()

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })

  it('should log subscription status', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    let subscribeCallback: any

    mockChannel.subscribe.mockImplementation((callback: any) => {
      subscribeCallback = callback
    })

    renderHook(() => useRealtimeNotes())

    // Simulate SUBSCRIBED status
    subscribeCallback('SUBSCRIBED')

    expect(consoleSpy).toHaveBeenCalledWith(
      'Real-time notes subscription active'
    )

    consoleSpy.mockRestore()
  })

  it('should handle subscription errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    let subscribeCallback: any

    mockChannel.subscribe.mockImplementation((callback: any) => {
      subscribeCallback = callback
    })

    renderHook(() => useRealtimeNotes())

    // Simulate CHANNEL_ERROR status
    subscribeCallback('CHANNEL_ERROR')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Real-time subscription error'
    )

    consoleErrorSpy.mockRestore()
  })
})

