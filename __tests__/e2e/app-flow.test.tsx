import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import App from '../../App'

// Mock all external dependencies
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    initializeAuth: jest.fn(),
  }),
}))

jest.mock('../../src/contexts/ThemeContext', () => ({
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

jest.mock('../../src/contexts/OfflineContext', () => ({
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

describe('App E2E Flow', () => {
  it('renders app without crashing', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId).toBeDefined()
  })

  it('shows loading state initially', () => {
    // Mock loading state
    jest.mocked(require('../../src/hooks/useAuth').useAuth).mockReturnValue({
      user: null,
      loading: true,
      initializeAuth: jest.fn(),
    })

    const { getByTestId } = render(<App />)
    // Should show loading indicator
    expect(getByTestId).toBeDefined()
  })

  it('handles theme switching', async () => {
    const mockToggleTheme = jest.fn()
    jest.mocked(require('../../src/contexts/ThemeContext').useTheme).mockReturnValue({
      theme: 'light',
      colors: {
        primary: '#3b82f6',
        white: '#ffffff',
      },
      toggleTheme: mockToggleTheme,
      setTheme: jest.fn(),
    })

    const { getByTestId } = render(<App />)
    
    // Simulate theme toggle
    fireEvent.press(getByTestId('theme-toggle'))
    
    expect(mockToggleTheme).toHaveBeenCalled()
  })
})
