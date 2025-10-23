import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useAuthStore } from '../../src/store/useAuthStore'
import { supabase } from '../../src/lib/supabase'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.setUser(null)
      result.current.setSession(null)
      result.current.setProfile(null)
      result.current.setLoading(false)
      result.current.setInitialized(false)
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.initialized).toBe(false)
  })

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 'user1', email: 'test@example.com' }

    act(() => {
      result.current.setUser(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('should set session', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockSession = { access_token: 'token123', user: { id: 'user1' } }

    act(() => {
      result.current.setSession(mockSession)
    })

    expect(result.current.session).toEqual(mockSession)
  })

  it('should set profile', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockProfile = {
      id: 'user1',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    act(() => {
      result.current.setProfile(mockProfile)
    })

    expect(result.current.profile).toEqual(mockProfile)
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should set initialized state', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setInitialized(true)
    })

    expect(result.current.initialized).toBe(true)
  })

  it('should sign out successfully', async () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 'user1', email: 'test@example.com' }
    const mockProfile = { id: 'user1', email: 'test@example.com', full_name: 'Test' }

    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null })

    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
    })

    await act(async () => {
      await result.current.signOut()
    })

    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(result.current.user).toBeNull()
    expect(result.current.profile).toBeNull()
  })

  it('should handle sign out error gracefully', async () => {
    const { result } = renderHook(() => useAuthStore())
    const mockError = new Error('Sign out failed')

    ;(supabase.auth.signOut as jest.Mock).mockRejectedValue(mockError)

    await act(async () => {
      await result.current.signOut()
    })

    // Should complete without throwing
    expect(result.current.loading).toBe(false)
  })

  it('should update profile successfully', async () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 'user1' }
    const updates = { full_name: 'Updated Name' }

    ;(supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    })

    act(() => {
      result.current.setUser(mockUser)
    })

    await act(async () => {
      await result.current.updateProfile(updates)
    })

    expect(supabase.from).toHaveBeenCalledWith('profiles')
  })

  it('should handle profile update when user is not logged in', async () => {
    const { result } = renderHook(() => useAuthStore())
    const updates = { full_name: 'Updated Name' }

    await act(async () => {
      await result.current.updateProfile(updates)
    })

    // Should return early without calling Supabase
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('should set loading state during profile update', async () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 'user1' }
    const updates = { full_name: 'Updated Name' }

    ;(supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
        ),
      }),
    })

    act(() => {
      result.current.setUser(mockUser)
    })

    const updatePromise = act(async () => {
      await result.current.updateProfile(updates)
    })

    // Should be loading during update
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await updatePromise

    // Should not be loading after update
    expect(result.current.loading).toBe(false)
  })

  it('should clear user and profile on sign out', async () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: 'user1', email: 'test@example.com' }
    const mockProfile = {
      id: 'user1',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null })

    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.profile).toEqual(mockProfile)

    await act(async () => {
      await result.current.signOut()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.profile).toBeNull()
  })
})

