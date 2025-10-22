import { renderHook, waitFor } from '@testing-library/react-native'
import { useFolders } from '../../src/hooks/useFolders'
import { useFoldersStore } from '../../src/store/useFoldersStore'
import { useAuthStore } from '../../src/store/useAuthStore'

// Mock the stores
jest.mock('../../src/store/useFoldersStore')
jest.mock('../../src/store/useAuthStore')

describe('useFolders', () => {
  const mockFolders = [
    {
      id: '1',
      name: 'Work',
      color: '#ff0000',
      user_id: 'user1',
      parent_id: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Personal',
      color: '#00ff00',
      user_id: 'user1',
      parent_id: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ]

  const mockCreateFolder = jest.fn()
  const mockUpdateFolder = jest.fn()
  const mockDeleteFolder = jest.fn()
  const mockFetchFolders = jest.fn()
  const mockClearFolders = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
    })
    
    ;(useFoldersStore as unknown as jest.Mock).mockReturnValue({
      folders: mockFolders,
      loading: false,
      error: null,
      createFolder: mockCreateFolder,
      updateFolder: mockUpdateFolder,
      deleteFolder: mockDeleteFolder,
      fetchFolders: mockFetchFolders,
      clearFolders: mockClearFolders,
    })
  })

  it('should return folders from store', () => {
    const { result } = renderHook(() => useFolders())

    expect(result.current.folders).toEqual(mockFolders)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should create a new folder', async () => {
    mockCreateFolder.mockResolvedValue({
      id: '3',
      name: 'New Folder',
      color: '#0000ff',
    })

    const { result } = renderHook(() => useFolders())

    await result.current.createFolder({
      name: 'New Folder',
      color: '#0000ff',
    })

    expect(mockCreateFolder).toHaveBeenCalledWith({
      name: 'New Folder',
      color: '#0000ff',
    })
  })

  it('should update an existing folder', async () => {
    const { result } = renderHook(() => useFolders())

    await result.current.updateFolder('1', { name: 'Updated Work' })

    expect(mockUpdateFolder).toHaveBeenCalledWith('1', { name: 'Updated Work' })
  })

  it('should delete a folder', async () => {
    const { result } = renderHook(() => useFolders())

    await result.current.deleteFolder('1')

    expect(mockDeleteFolder).toHaveBeenCalledWith('1')
  })

  it('should fetch folders on mount', async () => {
    renderHook(() => useFolders())

    await waitFor(() => {
      expect(mockFetchFolders).toHaveBeenCalled()
    })
  })

  it('should handle loading state', () => {
    ;(useFoldersStore as unknown as jest.Mock).mockReturnValue({
      folders: [],
      loading: true,
      error: null,
      createFolder: mockCreateFolder,
      updateFolder: mockUpdateFolder,
      deleteFolder: mockDeleteFolder,
      fetchFolders: mockFetchFolders,
      clearFolders: mockClearFolders,
    })

    const { result } = renderHook(() => useFolders())

    expect(result.current.loading).toBe(true)
  })

  it('should handle error state', () => {
    const errorMessage = 'Failed to fetch folders'
    ;(useFoldersStore as unknown as jest.Mock).mockReturnValue({
      folders: [],
      loading: false,
      error: errorMessage,
      createFolder: mockCreateFolder,
      updateFolder: mockUpdateFolder,
      deleteFolder: mockDeleteFolder,
      fetchFolders: mockFetchFolders,
      clearFolders: mockClearFolders,
    })

    const { result } = renderHook(() => useFolders())

    expect(result.current.error).toBe(errorMessage)
  })
})

