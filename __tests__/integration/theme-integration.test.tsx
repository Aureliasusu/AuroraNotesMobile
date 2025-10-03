import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider, useTheme } from '../../src/contexts/ThemeContext'
import { ThemeToggle } from '../../src/components/ui/ThemeToggle'

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
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  TouchableOpacity: 'TouchableOpacity',
  Text: 'Text',
}))

// Test component that uses theme
const TestComponent = () => {
  const { theme, colors } = useTheme()
  
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="primary-color">{colors.primary}</div>
      <div data-testid="background-color">{colors.background}</div>
      <div data-testid="text-color">{colors.textPrimary}</div>
    </div>
  )
}

describe('Theme Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('integrates theme context with ThemeToggle component', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    expect(getByTestId('theme')).toHaveTextContent('light')
    expect(getByTestId('primary-color')).toHaveTextContent('#3b82f6')
    expect(getByTestId('background-color')).toHaveTextContent('#ffffff')
    expect(getByTestId('text-color')).toHaveTextContent('#1a1a1a')
  })

  it('toggles theme through ThemeToggle component', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const themeDisplay = getByTestId('theme')
    const toggleButton = getByTestId('theme-toggle')
    
    expect(themeDisplay).toHaveTextContent('light')
    
    fireEvent.press(toggleButton)
    expect(themeDisplay).toHaveTextContent('dark')
    
    fireEvent.press(toggleButton)
    expect(themeDisplay).toHaveTextContent('light')
  })

  it('updates colors when theme changes', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const primaryColor = getByTestId('primary-color')
    const backgroundColor = getByTestId('background-color')
    const textColor = getByTestId('text-color')
    const toggleButton = getByTestId('theme-toggle')
    
    // Light theme colors
    expect(primaryColor).toHaveTextContent('#3b82f6')
    expect(backgroundColor).toHaveTextContent('#ffffff')
    expect(textColor).toHaveTextContent('#1a1a1a')
    
    // Toggle to dark theme
    fireEvent.press(toggleButton)
    
    // Dark theme colors
    expect(primaryColor).toHaveTextContent('#60a5fa')
    expect(backgroundColor).toHaveTextContent('#121212')
    expect(textColor).toHaveTextContent('#ffffff')
  })

  it('persists theme changes across component re-renders', () => {
    const { getByTestId, rerender } = render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const themeDisplay = getByTestId('theme')
    const toggleButton = getByTestId('theme-toggle')
    
    // Toggle to dark theme
    fireEvent.press(toggleButton)
    expect(themeDisplay).toHaveTextContent('dark')
    
    // Re-render component
    rerender(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    // Theme should persist
    expect(getByTestId('theme')).toHaveTextContent('dark')
  })

  it('handles multiple ThemeToggle components', () => {
    const { getAllByTestId } = render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
        <ThemeToggle />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const toggleButtons = getAllByTestId('theme-toggle')
    expect(toggleButtons).toHaveLength(3)
    
    // All toggles should work
    fireEvent.press(toggleButtons[0])
    fireEvent.press(toggleButtons[1])
    fireEvent.press(toggleButtons[2])
  })

  it('handles theme changes in nested components', () => {
    const NestedComponent = () => {
      const { theme, colors } = useTheme()
      return (
        <div>
          <div data-testid="nested-theme">{theme}</div>
          <div data-testid="nested-color">{colors.primary}</div>
        </div>
      )
    }
    
    const { getByTestId } = render(
      <ThemeProvider>
        <NestedComponent />
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const nestedTheme = getByTestId('nested-theme')
    const nestedColor = getByTestId('nested-color')
    const toggleButton = getByTestId('theme-toggle')
    
    expect(nestedTheme).toHaveTextContent('light')
    expect(nestedColor).toHaveTextContent('#3b82f6')
    
    fireEvent.press(toggleButton)
    
    expect(nestedTheme).toHaveTextContent('dark')
    expect(nestedColor).toHaveTextContent('#60a5fa')
  })

  it('handles theme context errors gracefully', () => {
    // Test without ThemeProvider
    const { getByText } = render(
      <TestComponent />
    )
    
    // Should show error or fallback
    expect(getByText('useTheme must be used within a ThemeProvider')).toBeTruthy()
  })
})
