import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Folder } from '../types/database'
import { useAuthStore } from './useAuthStore'
import { Alert } from 'react-native'

interface FoldersState {
  folders: Folder[]
  loading: boolean
  error: string | null
  setFolders: (folders: Folder[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchFolders: () => Promise<void>
  createFolder: (folder: Omit<Folder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Folder | null>
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<Folder | null>
  deleteFolder: (id: string) => Promise<boolean>
  clearFolders: () => void
}

export const useFoldersStore = create<FoldersState>((set, _get) => ({
  folders: [],
  loading: false,
  error: null,
  
  // Set folders list
  setFolders: (folders) => set({ folders }),
  
  // Set loading state
  setLoading: (loading) => set({ loading }),
  
  // Set error message
  setError: (error) => set({ error }),
  
  // Fetch all folders for the user
  fetchFolders: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return
    
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name')
      
      if (error) throw error
      
      set({ folders: data || [] })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch folders'
      set({ error: errorMessage })
      Alert.alert('Error', errorMessage)
    } finally {
      set({ loading: false })
    }
  },
  
  // Create new folder
  createFolder: async (folderData) => {
    const { user } = useAuthStore.getState()
    if (!user) return null
    
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          ...folderData,
          user_id: user.id,
        } as any)
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        folders: [...state.folders, data]
      }))
      
      Alert.alert('Success', 'Folder created successfully')
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create folder'
      set({ error: errorMessage })
      Alert.alert('Error', errorMessage)
      return null
    } finally {
      set({ loading: false })
    }
  },
  
  // Update folder information
  updateFolder: async (id, updates) => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        folders: state.folders.map(folder => 
          folder.id === id ? data : folder
        )
      }))
      
      Alert.alert('Success', 'Folder updated successfully')
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update folder'
      set({ error: errorMessage })
      Alert.alert('Error', errorMessage)
      return null
    } finally {
      set({ loading: false })
    }
  },
  
  // Delete folder
  deleteFolder: async (id) => {
    set({ loading: true, error: null })
    
    try {
      // First, move all notes in this folder to unorganized
      await supabase
        .from('notes')
        .update({ folder_id: null } as any)
        .eq('folder_id', id)

      // Then delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set((state) => ({
        folders: state.folders.filter(folder => folder.id !== id)
      }))
      
      Alert.alert('Success', 'Folder deleted successfully')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete folder'
      set({ error: errorMessage })
      Alert.alert('Error', errorMessage)
      return false
    } finally {
      set({ loading: false })
    }
  },

  // Clear folders list
  clearFolders: () => {
    set({ folders: [] })
  }
}))

// Set up real-time subscription (client-side only)
if (typeof window !== 'undefined' && typeof window === 'object') {
  const { user } = useAuthStore.getState()
  if (user) {
    supabase
      .channel('folders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Folder change received:', payload)
          // Refresh folders when changes occur
          useFoldersStore.getState().fetchFolders()
        }
      )
      .subscribe()
  }
}
