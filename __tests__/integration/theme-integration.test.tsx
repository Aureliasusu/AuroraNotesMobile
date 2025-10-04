import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { View, Text } from 'react-native'
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
    flatten: jest.fn((styles) => styles),
  },
  TouchableOpacity: 'TouchableOpacity',
  Text: 'Text',
  View: 'View',
}))

// Test component that uses theme
const TestComponent = () => {
  const { theme, colors } = useTheme()
  
  return (
    <View>
      <Text testID="theme">{theme}</Text>
      <Text testID="primary-color">{colors.primary}</Text>
      <Text testID="background-color">{colors.background}</Text>
      <Text testID="text-color">{colors.textPrimary}</Text>
    </View>
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
    expect(getByTestId('background-color')).toHaveTextContent('#f9fafb')
    expect(getByTestId('text-color')).toHaveTextContent('#111827')
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
    expect(backgroundColor).toHaveTextContent('#f9fafb')
    expect(textColor).toHaveTextContent('#111827')
    
    // Toggle to dark theme
    fireEvent.press(toggleButton)
    
    // Dark theme colors
    expect(primaryColor).toHaveTextContent('#3b82f6')
    expect(backgroundColor).toHaveTextContent('#111827')
    expect(textColor).toHaveTextContent('#f9fafb')
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
        <View>
          <Text testID="nested-theme">{theme}</Text>
          <Text testID="nested-color">{colors.primary}</Text>
        </View>
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
    expect(nestedColor).toHaveTextContent('#3b82f6')
  })

  it('handles theme context errors gracefully', () => {
    // Test without ThemeProvider - mock the error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within a ThemeProvider')
    
    consoleSpy.mockRestore()
  })
})
