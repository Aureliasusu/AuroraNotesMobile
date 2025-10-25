import { renderHook, waitFor, act } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { useNoteSharing } from '../../src/hooks/useNoteSharing'
import { useAuthStore } from '../../src/store/useAuthStore'
import { supabase } from '../../src/lib/supabase'

// Mock dependencies
jest.mock('../../src/store/useAuthStore')
jest.mock('../../src/lib/supabase')
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

describe('useNoteSharing', () => {
  const mockUser = { id: 'user1', email: 'user1@example.com' }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
    })
  })

  it('should initialize with empty shares', () => {
    const { result } = renderHook(() => useNoteSharing())

    expect(result.current.shares).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should load shares for a note', async () => {
    const mockShares = [
      {
        id: '1',
        note_id: 'note1',
        shared_by: 'user1',
        shared_with: 'user2',
        permission: 'read',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ]

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: mockShares,
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.loadShares('note1')
    })

    await waitFor(() => {
      expect(result.current.shares).toEqual(mockShares)
    })
  })

  it('should share a note with another user', async () => {
    const targetUser = {
      id: 'user2',
      email: 'user2@example.com',
      full_name: 'User Two',
    }

    ;(supabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: targetUser,
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'note_shares') {
        return {
          insert: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }
      }
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.shareNote('note1', 'user2@example.com', 'read')
    })

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        expect.stringContaining('User Two')
      )
    })
  })

  it('should show error when user not found', async () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'User not found' },
          }),
        }),
      }),
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.shareNote('note1', 'nonexistent@example.com', 'read')
    })

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'User not found')
    })
  })

  it('should update share permission', async () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.updateSharePermission('share1', 'write')
    })

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Permission updated'
      )
    })
  })

  it('should remove a share', async () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.removeShare('share1')
    })

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Share removed'
      )
    })
  })

  it('should not share when user is not authenticated', async () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    })

    const { result } = renderHook(() => useNoteSharing())

    await act(async () => {
      await result.current.shareNote('note1', 'user2@example.com', 'read')
    })

    expect(supabase.from).not.toHaveBeenCalled()
  })
})

