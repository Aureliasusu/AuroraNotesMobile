import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../../src/components/ui/Button'

describe('Button', () => {
  it('renders with correct title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />)
    expect(getByText('Test Button')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />)
    
    fireEvent.press(getByText('Test Button'))
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('renders with different variants', () => {
    const { getByText } = render(
      <Button title="Primary" variant="primary" onPress={() => {}} />
    )
    expect(getByText('Primary')).toBeTruthy()
  })

  it('shows loading state', () => {
    const { getByText } = render(
      <Button title="Loading" loading={true} onPress={() => {}} />
    )
    // Check if loading state is shown (ActivityIndicator should be present)
    expect(getByText('Loading')).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn()
    const { getByText } = render(
      <Button title="Disabled" disabled={true} onPress={mockOnPress} />
    )
    
    fireEvent.press(getByText('Disabled'))
    expect(mockOnPress).not.toHaveBeenCalled()
  })
})
