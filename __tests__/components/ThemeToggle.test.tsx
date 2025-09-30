import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeToggle } from '../../src/components/ui/ThemeToggle'

// Mock the ThemeContext
const mockToggleTheme = jest.fn()
jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      surface: '#ffffff',
      textPrimary: '#000000',
    },
    toggleTheme: mockToggleTheme,
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const { getByTestId } = render(<ThemeToggle />)
    expect(getByTestId).toBeDefined()
  })

  it('calls toggleTheme when pressed', () => {
    const { getByTestId } = render(<ThemeToggle />)
    fireEvent.press(getByTestId('theme-toggle'))

    expect(mockToggleTheme).toHaveBeenCalled()
  })
})
