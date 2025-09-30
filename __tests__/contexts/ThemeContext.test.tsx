import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider, useTheme } from '../../src/contexts/ThemeContext'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}))

// Mock Appearance
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
  },
}))

// Test component to use the context
const TestComponent = () => {
  const { theme, colors, toggleTheme, setTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="primary-color">{colors.primary}</div>
      <button data-testid="toggle-theme" onPress={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-dark" onPress={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-light" onPress={() => setTheme('light')}>
        Set Light
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides default light theme', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(getByTestId('theme')).toHaveTextContent('light')
  })

  it('toggles theme between light and dark', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const toggleButton = getByTestId('toggle-theme')
    const themeDisplay = getByTestId('theme')
    
    expect(themeDisplay).toHaveTextContent('light')
    
    fireEvent.press(toggleButton)
    expect(themeDisplay).toHaveTextContent('dark')
    
    fireEvent.press(toggleButton)
    expect(themeDisplay).toHaveTextContent('light')
  })

  it('sets theme to dark', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const setDarkButton = getByTestId('set-dark')
    const themeDisplay = getByTestId('theme')
    
    fireEvent.press(setDarkButton)
    expect(themeDisplay).toHaveTextContent('dark')
  })

  it('sets theme to light', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const setLightButton = getByTestId('set-light')
    const themeDisplay = getByTestId('theme')
    
    fireEvent.press(setLightButton)
    expect(themeDisplay).toHaveTextContent('light')
  })

  it('provides correct colors for light theme', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const primaryColor = getByTestId('primary-color')
    expect(primaryColor).toHaveTextContent('#3b82f6') // Light theme primary color
  })

  it('saves theme to storage when changed', async () => {
    const mockSetItem = jest.mocked(require('@react-native-async-storage/async-storage').setItem)
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const toggleButton = getByTestId('toggle-theme')
    fireEvent.press(toggleButton)
    
    expect(mockSetItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('loads theme from storage on mount', async () => {
    const mockGetItem = jest.mocked(require('@react-native-async-storage/async-storage').getItem)
    mockGetItem.mockResolvedValue('dark')
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    // Wait for async storage to load
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(mockGetItem).toHaveBeenCalledWith('theme')
  })

  it('uses system theme when no saved theme', async () => {
    const mockGetItem = jest.mocked(require('@react-native-async-storage/async-storage').getItem)
    const mockGetColorScheme = jest.mocked(require('react-native').Appearance.getColorScheme)
    
    mockGetItem.mockResolvedValue(null)
    mockGetColorScheme.mockReturnValue('dark')
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    // Wait for async storage to load
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(mockGetItem).toHaveBeenCalledWith('theme')
    expect(mockGetColorScheme).toHaveBeenCalled()
  })
})
