import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import { OfflineProvider, useOffline } from '../../src/contexts/OfflineContext'

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

// Test component to use the context
const TestComponent = () => {
  const { isOffline, isSyncing, lastSync, syncData } = useOffline()
  
  return (
    <View>
      <Text testID="is-offline">{isOffline?.toString() || 'false'}</Text>
      <Text testID="is-syncing">{isSyncing?.toString() || 'false'}</Text>
      <Text testID="last-sync">{lastSync || 'null'}</Text>
      <TouchableOpacity testID="sync-data" onPress={syncData}>
        <Text>Sync Data</Text>
      </TouchableOpacity>
    </View>
  )
}

describe('OfflineContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides default offline state', () => {
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    expect(getByTestId('is-offline')).toHaveTextContent('false')
    expect(getByTestId('is-syncing')).toHaveTextContent('false')
    expect(getByTestId('last-sync')).toHaveTextContent('null')
  })

  it('handles network state changes', () => {
    const mockAddEventListener = jest.mocked(require('@react-native-community/netinfo').addEventListener)
    const mockCallback = jest.fn()
    
    mockAddEventListener.mockImplementation((callback) => {
      // Simulate network state change
      callback({ isConnected: false })
      return mockCallback
    })
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    expect(mockAddEventListener).toHaveBeenCalled()
  })

  it('handles initial network check', () => {
    const mockFetch = jest.mocked(require('@react-native-community/netinfo').fetch)
    mockFetch.mockResolvedValue({ isConnected: true })
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    expect(mockFetch).toHaveBeenCalled()
  })

  it('handles sync data when online', async () => {
    const mockFetch = jest.mocked(require('@react-native-community/netinfo').fetch)
    mockFetch.mockResolvedValue({ isConnected: true })
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    const syncButton = getByTestId('sync-data')
    fireEvent.press(syncButton)
    
    // Should not show offline alert
    expect(require('react-native').Alert.alert).not.toHaveBeenCalled()
  })

  it('shows offline alert when trying to sync offline', async () => {
    const mockFetch = jest.mocked(require('@react-native-community/netinfo').fetch)
    mockFetch.mockResolvedValue({ isConnected: false })
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    const syncButton = getByTestId('sync-data')
    fireEvent.press(syncButton)
    
    // Should show offline alert
    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Offline',
      'Cannot sync data while offline.'
    )
  })

  it('handles sync success', async () => {
    const mockFetch = jest.mocked(require('@react-native-community/netinfo').fetch)
    mockFetch.mockResolvedValue({ isConnected: true })
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    const syncButton = getByTestId('sync-data')
    fireEvent.press(syncButton)
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show success alert
    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Success',
      'Data synchronized successfully!'
    )
  })

  it('handles sync errors', async () => {
    const mockFetch = jest.mocked(require('@react-native-community/netinfo').fetch)
    mockFetch.mockResolvedValue({ isConnected: true })
    
    // Mock console.error to avoid test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    const { getByTestId } = render(
      <OfflineProvider>
        <TestComponent />
      </OfflineProvider>
    )
    
    const syncButton = getByTestId('sync-data')
    fireEvent.press(syncButton)
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show error alert
    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to synchronize data.'
    )
    
    consoleSpy.mockRestore()
  })
})
