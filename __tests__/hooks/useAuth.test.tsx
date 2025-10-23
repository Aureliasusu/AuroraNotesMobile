import { renderHook } from '@testing-library/react-native'
import { useAuth } from '../../src/hooks/useAuth'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}))

// Mock dependencies

jest.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: null,
    session: null,
    profile: null,
    loading: false,
    initialized: false,
    setUser: jest.fn(),
    setSession: jest.fn(),
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
