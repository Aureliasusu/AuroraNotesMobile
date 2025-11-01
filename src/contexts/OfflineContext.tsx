import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface OfflineContextType {
  isOffline: boolean
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  lastSyncTime: Date | null
  syncData: () => Promise<void>
  getOfflineData: (key: string) => Promise<any>
  setOfflineData: (key: string, data: any) => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

interface OfflineProviderProps {
  children: ReactNode
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected || !state.isInternetReachable
      setIsOffline(offline)
    })

    return unsubscribe
  }, [])

  // Load last sync time
  useEffect(() => {
    loadLastSyncTime()
  }, [])

  const loadLastSyncTime = async () => {
    try {
      const timeString = await AsyncStorage.getItem('lastSyncTime')
      if (timeString) {
        setLastSyncTime(new Date(timeString))
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load last sync time:', error)
    }
  }

  const syncData = async () => {
    if (isOffline) {
      // eslint-disable-next-line no-console
      console.log('Cannot sync while offline')
      return
    }

    setSyncStatus('syncing')
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const now = new Date()
      setLastSyncTime(now)
      await AsyncStorage.setItem('lastSyncTime', now.toISOString())
      
      setSyncStatus('success')
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sync failed:', error)
      setSyncStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const getOfflineData = async (key: string) => {
    try {
      const data = await AsyncStorage.getItem(`offline_${key}`)
      return data ? JSON.parse(data) : null
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get offline data:', error)
      return null
    }
  }

  const setOfflineData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(`offline_${key}`, JSON.stringify(data))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to set offline data:', error)
    }
  }

  const value: OfflineContextType = {
    isOffline,
    isOnline: !isOffline,
    syncStatus,
    lastSyncTime,
    syncData,
    getOfflineData,
    setOfflineData,
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
