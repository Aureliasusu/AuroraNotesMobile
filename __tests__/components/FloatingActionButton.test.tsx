import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton'

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react')
  return React.forwardRef((props: any, ref: any) => {
    const { Text } = require('react-native')
    return <Text ref={ref} testID="mock-icon">{props.name}</Text>
  })
})

describe('FloatingActionButton', () => {
  it('should render correctly', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    expect(getByTestId('mock-icon')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { root } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    // Press the root element (TouchableOpacity)
    fireEvent.press(root)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should render with default icon', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    const icon = getByTestId('mock-icon')
    expect(icon.props.children).toBe('add')
  })

  it('should render with custom icon', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} icon="edit" />
    )

    const icon = getByTestId('mock-icon')
    expect(icon.props.children).toBe('edit')
  })

  it('should render successfully with custom size', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} size={64} />
    )

    expect(getByTestId('mock-icon')).toBeTruthy()
  })

  it('should render successfully with custom backgroundColor', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} backgroundColor="#ff0000" />
    )

    expect(getByTestId('mock-icon')).toBeTruthy()
  })

  it('should render successfully with custom iconColor', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} iconColor="#00ff00" />
    )

    expect(getByTestId('mock-icon')).toBeTruthy()
  })

  it('should render successfully with custom styles', () => {
    const onPressMock = jest.fn()
    const customStyle = { marginBottom: 100 }
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} style={customStyle} />
    )

    expect(getByTestId('mock-icon')).toBeTruthy()
  })

  it('should have default icon when not specified', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    const icon = getByTestId('mock-icon')
    expect(icon.props.children).toBe('add')
  })
})

