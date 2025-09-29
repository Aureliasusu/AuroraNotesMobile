import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeToggle } from '../../src/components/ui/ThemeToggle'

// Mock the theme context
jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      surface: '#ffffff',
      textPrimary: '#000000',
    },
    toggleTheme: jest.fn(),
  }),
}))

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ThemeToggle />)
    expect(getByTestId).toBeDefined()
  })

  it('calls toggleTheme when pressed', () => {
    const mockToggleTheme = jest.fn()
    jest.mocked(require('../../src/contexts/ThemeContext').useTheme).mockReturnValue({
      theme: 'light',
      colors: {
        surface: '#ffffff',
        textPrimary: '#000000',
      },
      toggleTheme: mockToggleTheme,
    })

    const { getByTestId } = render(<ThemeToggle />)
    fireEvent.press(getByTestId('theme-toggle'))
    
    expect(mockToggleTheme).toHaveBeenCalled()
  })
})
