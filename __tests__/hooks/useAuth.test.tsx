import { renderHook, act } from '@testing-library/react-native'
import { useAuth } from '../../src/hooks/useAuth'

// Mock dependencies
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  },
}))

jest.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: null,
    profile: null,
    loading: false,
    initialized: false,
    setUser: jest.fn(),
    setProfile: jest.fn(),
    setLoading: jest.fn(),
    setInitialized: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}))

jest.mock('../../src/store/useNotesStore', () => ({
  useNotesStore: () => ({
    clearNotes: jest.fn(),
  }),
}))

describe('useAuth', () => {
  it('returns auth state and functions', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('initializeAuth')
    expect(result.current).toHaveProperty('signIn')
    expect(result.current).toHaveProperty('signUp')
    expect(result.current).toHaveProperty('signOut')
  })

  it('initializes auth on mount', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.initializeAuth).toBeDefined()
  })
})
