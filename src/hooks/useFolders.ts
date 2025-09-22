import { useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useFoldersStore } from '../store/useFoldersStore'
import { Folder } from '../types/database'

export function useFolders() {
  const { user } = useAuthStore()
  const { 
    folders, 
    loading, 
    error, 
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    clearFolders
  } = useFoldersStore()

  // Automatically fetch folders when user logs in
  useEffect(() => {
    if (user) {
      fetchFolders()
    } else {
      clearFolders()
    }
  }, [user, fetchFolders, clearFolders])

  // Create folder
  const handleCreateFolder = useCallback(async (folderData: {
    name: string
    color: string
    parent_id?: string | null
  }) => {
    if (!user) {
      throw new Error('User not logged in')
    }

    return await createFolder({
      name: folderData.name.trim(),
      color: folderData.color,
      parent_id: folderData.parent_id || null,
    })
  }, [user, createFolder])

  // Update folder
  const handleUpdateFolder = useCallback(async (id: string, updates: {
    name?: string
    color?: string
    parent_id?: string | null
  }) => {
    return await updateFolder(id, updates)
  }, [updateFolder])

  // Delete folder
  const handleDeleteFolder = useCallback(async (id: string) => {
    return await deleteFolder(id)
  }, [deleteFolder])

  // Get folder hierarchy structure
  const getFolderHierarchy = useCallback(() => {
    const rootFolders = folders.filter(folder => !folder.parent_id)
    const childFolders = folders.filter(folder => folder.parent_id)
    
    const buildHierarchy = (parentId: string | null): Folder[] => {
      return folders
        .filter(folder => folder.parent_id === parentId)
        .map(folder => ({
          ...folder,
          children: buildHierarchy(folder.id)
        }))
    }
    
    return buildHierarchy(null)
  }, [folders])

  // Get folder by ID
  const getFolderById = useCallback((id: string) => {
    return folders.find(folder => folder.id === id)
  }, [folders])

  // Get folder's full path
  const getFolderPath = useCallback((folderId: string): string[] => {
    const path: string[] = []
    let currentId: string | null = folderId
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId)
      if (folder) {
        path.unshift(folder.name)
        currentId = folder.parent_id
      } else {
        break
      }
    }
    
    return path
  }, [folders])

  return {
    // State
    folders,
    loading,
    error,
    
    // Actions
    fetchFolders,
    createFolder: handleCreateFolder,
    updateFolder: handleUpdateFolder,
    deleteFolder: handleDeleteFolder,
    clearFolders,
    
    // Utility methods
    getFolderHierarchy,
    getFolderById,
    getFolderPath,
  }
}
