/**
 * @format
 */

import React from 'react'
import { render } from '@testing-library/react-native'
import App from '../App'

// Mock all dependencies to avoid complex setup
jest.mock('../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    initializeAuth: jest.fn(),
  }),
}))

jest.mock('../src/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    colors: {
      primary: '#3b82f6',
      white: '#ffffff',
    },
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}))

jest.mock('../src/contexts/OfflineContext', () => ({
  OfflineProvider: ({ children }: { children: React.ReactNode }) => children,
  useOffline: () => ({
    isOffline: false,
    isOnline: true,
    syncStatus: 'idle',
    lastSyncTime: null,
    syncData: jest.fn(),
    getOfflineData: jest.fn(),
    setOfflineData: jest.fn(),
  }),
}))

test('renders without crashing', () => {
  const { getByTestId } = render(<App />)
  // Basic test to ensure app renders without crashing
  expect(getByTestId).toBeDefined()
})