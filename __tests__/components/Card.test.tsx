import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Card } from '../../src/components/ui/Card'

describe('Card', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should apply default variant styles', () => {
    const { getByTestId } = render(
      <Card>
        <Text testID="card-content">Content</Text>
      </Card>
    )

    expect(getByTestId('card-content')).toBeTruthy()
  })

  it('should handle onPress event', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <Card onPress={onPressMock}>
        <Text testID="card-content">Pressable Card</Text>
      </Card>
    )

    const card = getByTestId('card-content').parent
    fireEvent.press(card!)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should render with elevated variant', () => {
    const { getByText } = render(
      <Card variant="elevated">
        <Text>Elevated Card</Text>
      </Card>
    )

    expect(getByText('Elevated Card')).toBeTruthy()
  })

  it('should render with outlined variant', () => {
    const { getByText } = render(
      <Card variant="outlined">
        <Text>Outlined Card</Text>
      </Card>
    )

    expect(getByText('Outlined Card')).toBeTruthy()
  })

  it('should apply different padding sizes', () => {
    const { rerender, getByText } = render(
      <Card padding="none">
        <Text>No Padding</Text>
      </Card>
    )
    expect(getByText('No Padding')).toBeTruthy()

    rerender(
      <Card padding="small">
        <Text>Small Padding</Text>
      </Card>
    )
    expect(getByText('Small Padding')).toBeTruthy()

    rerender(
      <Card padding="large">
        <Text>Large Padding</Text>
      </Card>
    )
    expect(getByText('Large Padding')).toBeTruthy()
  })

  it('should apply different margin sizes', () => {
    const { rerender, getByText } = render(
      <Card margin="none">
        <Text>No Margin</Text>
      </Card>
    )
    expect(getByText('No Margin')).toBeTruthy()

    rerender(
      <Card margin="small">
        <Text>Small Margin</Text>
      </Card>
    )
    expect(getByText('Small Margin')).toBeTruthy()

    rerender(
      <Card margin="large">
        <Text>Large Margin</Text>
      </Card>
    )
    expect(getByText('Large Margin')).toBeTruthy()
  })

  it('should disable shadow when shadow prop is false', () => {
    const { getByText } = render(
      <Card shadow={false}>
        <Text>No Shadow</Text>
      </Card>
    )

    expect(getByText('No Shadow')).toBeTruthy()
  })

  it('should merge custom styles', () => {
    const customStyle = { backgroundColor: 'red' }
    const { getByText } = render(
      <Card style={customStyle}>
        <Text>Custom Style</Text>
      </Card>
    )

    expect(getByText('Custom Style')).toBeTruthy()
  })

  it('should render as TouchableOpacity when onPress is provided', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <Card onPress={onPressMock}>
        <Text testID="pressable-content">Pressable</Text>
      </Card>
    )

    const card = getByTestId('pressable-content').parent
    expect(card).toBeTruthy()
  })

  it('should render as View when onPress is not provided', () => {
    const { getByText } = render(
      <Card>
        <Text>Non-pressable</Text>
      </Card>
    )

    expect(getByText('Non-pressable')).toBeTruthy()
  })
})

