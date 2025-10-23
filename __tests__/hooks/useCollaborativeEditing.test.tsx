import { renderHook, waitFor } from '@testing-library/react-native'
import { useCollaborativeEditing } from '../../src/hooks/useCollaborativeEditing'
import { useAuthStore } from '../../src/store/useAuthStore'
import { useNotesStore } from '../../src/store/useNotesStore'
import { useUserPresence } from '../../src/hooks/useUserPresence'
import { supabase } from '../../src/lib/supabase'

// Mock dependencies
jest.mock('../../src/store/useAuthStore')
jest.mock('../../src/store/useNotesStore')
jest.mock('../../src/hooks/useUserPresence')
jest.mock('../../src/lib/supabase')
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

describe('useCollaborativeEditing', () => {
  const mockUser = {
    id: 'user1',
    email: 'user1@example.com',
    user_metadata: {
      full_name: 'User One',
      avatar_url: 'https://example.com/avatar1.jpg',
    },
  }

  const mockUpdateNote = jest.fn()
  const mockChannel = {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    track: jest.fn(),
    presenceState: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
    })

    ;(useNotesStore as unknown as jest.Mock).mockReturnValue({
      updateNote: mockUpdateNote,
    })

    ;(useUserPresence as jest.Mock).mockReturnValue({
      activeUsers: [],
      isOnline: true,
    })

    ;(supabase.channel as jest.Mock).mockReturnValue(mockChannel)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCollaborativeEditing('note1'))

    expect(result.current.editingUsers).toEqual([])
    expect(result.current.isEditing).toBe(false)
    expect(result.current.currentEditor).toBeNull()
  })

  it('should set up real-time channel when noteId and user are present', () => {
    renderHook(() => useCollaborativeEditing('note1'))

    expect(supabase.channel).toHaveBeenCalledWith('note-editing-note1')
    expect(mockChannel.on).toHaveBeenCalledWith(
      'presence',
      { event: 'sync' },
      expect.any(Function)
    )
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('should not set up channel when user is not present', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    })

    renderHook(() => useCollaborativeEditing('note1'))

    expect(supabase.channel).not.toHaveBeenCalled()
  })

  it('should track user presence on subscription', async () => {
    let subscribeCallback: any

    mockChannel.subscribe.mockImplementation((callback: any) => {
      subscribeCallback = callback
      return Promise.resolve()
    })

    renderHook(() => useCollaborativeEditing('note1'))

    await waitFor(() => {
      subscribeCallback('SUBSCRIBED')
    })

    expect(mockChannel.track).toHaveBeenCalledWith({
      user_id: 'user1',
      email: 'user1@example.com',
      full_name: 'User One',
      avatar_url: 'https://example.com/avatar1.jpg',
      last_seen: expect.any(String),
    })
  })

  it('should update editing users on presence sync', async () => {
    const mockPresenceState = {
      user2: [
        {
          user_id: 'user2',
          email: 'user2@example.com',
          full_name: 'User Two',
          avatar_url: null,
          last_seen: '2024-01-01T00:00:00Z',
        },
      ],
    }

    let presenceSyncHandler: any

    mockChannel.on.mockImplementation((event: string, config: any, handler: any) => {
      if (config.event === 'sync') {
        presenceSyncHandler = handler
      }
      return mockChannel
    })

    mockChannel.presenceState.mockReturnValue(mockPresenceState)

    const { result } = renderHook(() => useCollaborativeEditing('note1'))

    presenceSyncHandler()

    await waitFor(() => {
      expect(result.current.editingUsers).toHaveLength(1)
      expect(result.current.editingUsers[0]).toEqual({
        id: 'user2',
        email: 'user2@example.com',
        full_name: 'User Two',
        avatar_url: null,
        last_seen: '2024-01-01T00:00:00Z',
        is_online: true,
      })
    })
  })

  it('should filter out current user from editing users', async () => {
    const mockPresenceState = {
      user1: [
        {
          user_id: 'user1',
          email: 'user1@example.com',
          full_name: 'User One',
          avatar_url: null,
          last_seen: '2024-01-01T00:00:00Z',
        },
      ],
      user2: [
        {
          user_id: 'user2',
          email: 'user2@example.com',
          full_name: 'User Two',
          avatar_url: null,
          last_seen: '2024-01-01T00:00:00Z',
        },
      ],
    }

    let presenceSyncHandler: any

    mockChannel.on.mockImplementation((event: string, config: any, handler: any) => {
      if (config.event === 'sync') {
        presenceSyncHandler = handler
      }
      return mockChannel
    })

    mockChannel.presenceState.mockReturnValue(mockPresenceState)

    const { result } = renderHook(() => useCollaborativeEditing('note1'))

    presenceSyncHandler()

    await waitFor(() => {
      expect(result.current.editingUsers).toHaveLength(1)
      expect(result.current.editingUsers[0].id).toBe('user2')
    })
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useCollaborativeEditing('note1'))

    unmount()

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })

  it('should start editing', () => {
    const { result } = renderHook(() => useCollaborativeEditing('note1'))

    result.current.startEditing()

    expect(result.current.isEditing).toBe(true)
  })

  it('should stop editing', () => {
    const { result } = renderHook(() => useCollaborativeEditing('note1'))

    result.current.startEditing()
    result.current.stopEditing()

    expect(result.current.isEditing).toBe(false)
  })
})

