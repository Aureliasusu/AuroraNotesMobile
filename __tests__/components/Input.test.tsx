import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Input } from '../../src/components/ui/Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" value="" onChangeText={() => {}} />
    )
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" value="" onChangeText={mockOnChangeText} />
    )
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello World')
    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World')
  })

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChangeText={() => {}} 
        error="This field is required" 
      />
    )
    expect(getByText('This field is required')).toBeTruthy()
  })

  it('is secure when secureTextEntry is true', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Password" 
        value="" 
        onChangeText={() => {}} 
        secureTextEntry={true} 
      />
    )
    const input = getByPlaceholderText('Password')
    expect(input.props.secureTextEntry).toBe(true)
  })

  it('shows label when label prop is provided', () => {
    const { getByText } = render(
      <Input 
        label="Email Address"
        placeholder="Enter email" 
        value="" 
        onChangeText={() => {}} 
      />
    )
    expect(getByText('Email Address')).toBeTruthy()
  })
})
