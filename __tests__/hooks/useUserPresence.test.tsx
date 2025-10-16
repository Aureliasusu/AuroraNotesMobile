import { renderHook, waitFor } from '@testing-library/react-native'
import { useUserPresence } from '../../src/hooks/useUserPresence'
import { useAuthStore } from '../../src/store/useAuthStore'
import { supabase } from '../../src/lib/supabase'

// Mock dependencies
jest.mock('../../src/store/useAuthStore')
jest.mock('../../src/lib/supabase')

describe('useUserPresence', () => {
  const mockUser = {
    id: 'user1',
    email: 'user1@example.com',
    user_metadata: {
      full_name: 'User One',
      avatar_url: 'https://example.com/avatar1.jpg',
    },
  }

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

    ;(supabase.channel as jest.Mock).mockReturnValue(mockChannel)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUserPresence())

    expect(result.current.onlineUsers).toEqual([])
    expect(result.current.isOnline).toBe(false)
    expect(result.current.lastSeen).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it('should set up presence channel when user is present', () => {
    renderHook(() => useUserPresence())

    expect(supabase.channel).toHaveBeenCalledWith('presence-channel')
    expect(mockChannel.on).toHaveBeenCalled()
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('should not set up channel when user is not present', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    })

    renderHook(() => useUserPresence())

    expect(supabase.channel).not.toHaveBeenCalled()
  })

  it('should track user presence on subscription', async () => {
    let subscribeCallback: any

    mockChannel.subscribe.mockImplementation((callback: any) => {
      subscribeCallback = callback
      return Promise.resolve()
    })

    renderHook(() => useUserPresence())

    await waitFor(() => {
      subscribeCallback('SUBSCRIBED')
    })

    expect(mockChannel.track).toHaveBeenCalledWith({
      user_id: 'user1',
      email: 'user1@example.com',
      full_name: 'User One',
      avatar_url: 'https://example.com/avatar1.jpg',
      online_at: expect.any(String),
      last_seen: expect.any(String),
    })
  })

  it('should update online users on presence sync', async () => {
    const mockPresenceState = {
      user2: [
        {
          user_id: 'user2',
          email: 'user2@example.com',
          full_name: 'User Two',
          avatar_url: 'https://example.com/avatar2.jpg',
          online_at: '2024-01-01T00:00:00Z',
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

    const { result } = renderHook(() => useUserPresence())

    presenceSyncHandler()

    await waitFor(() => {
      expect(result.current.onlineUsers).toHaveLength(1)
      expect(result.current.onlineUsers[0]).toEqual({
        id: 'user2',
        email: 'user2@example.com',
        full_name: 'User Two',
        avatar_url: 'https://example.com/avatar2.jpg',
        online_at: '2024-01-01T00:00:00Z',
        last_seen: '2024-01-01T00:00:00Z',
        is_online: true,
      })
    })
  })

  it('should filter out current user from online users', async () => {
    const mockPresenceState = {
      user1: [
        {
          user_id: 'user1',
          email: 'user1@example.com',
          full_name: 'User One',
          avatar_url: '',
          online_at: '2024-01-01T00:00:00Z',
          last_seen: '2024-01-01T00:00:00Z',
        },
      ],
      user2: [
        {
          user_id: 'user2',
          email: 'user2@example.com',
          full_name: 'User Two',
          avatar_url: '',
          online_at: '2024-01-01T00:00:00Z',
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

    const { result } = renderHook(() => useUserPresence())

    presenceSyncHandler()

    await waitFor(() => {
      expect(result.current.onlineUsers).toHaveLength(1)
      expect(result.current.onlineUsers[0].id).toBe('user2')
    })
  })

  it('should handle user join event', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    let joinHandler: any

    mockChannel.on.mockImplementation((event: string, config: any, handler: any) => {
      if (config.event === 'join') {
        joinHandler = handler
      }
      return mockChannel
    })

    renderHook(() => useUserPresence())

    const joinData = {
      key: 'user2',
      newPresences: [{ user_id: 'user2', email: 'user2@example.com' }],
    }

    joinHandler(joinData)

    expect(consoleSpy).toHaveBeenCalledWith('User joined:', 'user2', joinData.newPresences)

    consoleSpy.mockRestore()
  })

  it('should handle user leave event', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    let leaveHandler: any

    mockChannel.on.mockImplementation((event: string, config: any, handler: any) => {
      if (config.event === 'leave') {
        leaveHandler = handler
      }
      return mockChannel
    })

    renderHook(() => useUserPresence())

    const leaveData = {
      key: 'user2',
      leftPresences: [{ user_id: 'user2', email: 'user2@example.com' }],
    }

    leaveHandler(leaveData)

    expect(consoleSpy).toHaveBeenCalledWith('User left:', 'user2', leaveData.leftPresences)

    consoleSpy.mockRestore()
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useUserPresence())

    unmount()

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })

  it('should set online status', () => {
    const { result } = renderHook(() => useUserPresence())

    result.current.setOnline(true)

    expect(result.current.isOnline).toBe(true)
  })

  it('should set offline status', () => {
    const { result } = renderHook(() => useUserPresence())

    result.current.setOnline(false)

    expect(result.current.isOnline).toBe(false)
  })

  it('should get user count', () => {
    const mockPresenceState = {
      user2: [{ user_id: 'user2' }],
      user3: [{ user_id: 'user3' }],
    }

    let presenceSyncHandler: any

    mockChannel.on.mockImplementation((event: string, config: any, handler: any) => {
      if (config.event === 'sync') {
        presenceSyncHandler = handler
      }
      return mockChannel
    })

    mockChannel.presenceState.mockReturnValue(mockPresenceState)

    const { result } = renderHook(() => useUserPresence())

    presenceSyncHandler()

    waitFor(() => {
      const count = result.current.getUserCount()
      expect(count).toBe(2)
    })
  })
})

