import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton'

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon')

describe('FloatingActionButton', () => {
  it('should render correctly', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    // The button should be rendered
    expect(getByTestId).toBeDefined()
  })

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    const button = UNSAFE_getByType('TouchableOpacity' as any)
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should render with default icon', () => {
    const onPressMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    expect(UNSAFE_getByType('Icon' as any)).toBeTruthy()
  })

  it('should render with custom icon', () => {
    const onPressMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} icon="edit" />
    )

    const icon = UNSAFE_getByType('Icon' as any)
    expect(icon.props.name).toBe('edit')
  })

  it('should apply custom size', () => {
    const onPressMock = jest.fn()
    const customSize = 64
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} size={customSize} />
    )

    const button = UNSAFE_getByType('TouchableOpacity' as any)
    const icon = UNSAFE_getByType('Icon' as any)

    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: customSize,
          height: customSize,
          borderRadius: customSize / 2,
        }),
      ])
    )
    expect(icon.props.size).toBe(customSize * 0.5)
  })

  it('should apply custom backgroundColor', () => {
    const onPressMock = jest.fn()
    const customColor = '#ff0000'
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} backgroundColor={customColor} />
    )

    const button = UNSAFE_getByType('TouchableOpacity' as any)
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: customColor,
        }),
      ])
    )
  })

  it('should apply custom iconColor', () => {
    const onPressMock = jest.fn()
    const customIconColor = '#00ff00'
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} iconColor={customIconColor} />
    )

    const icon = UNSAFE_getByType('Icon' as any)
    expect(icon.props.color).toBe(customIconColor)
  })

  it('should merge custom styles', () => {
    const onPressMock = jest.fn()
    const customStyle = { marginBottom: 100 }
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} style={customStyle} />
    )

    const button = UNSAFE_getByType('TouchableOpacity' as any)
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle),
      ])
    )
  })

  it('should have default props when not specified', () => {
    const onPressMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPressMock} />
    )

    const button = UNSAFE_getByType('TouchableOpacity' as any)
    const icon = UNSAFE_getByType('Icon' as any)

    expect(button.props.activeOpacity).toBe(0.8)
    expect(icon.props.name).toBe('add')
    expect(icon.props.size).toBe(28) // 56 * 0.5
    expect(icon.props.color).toBe('#ffffff')
  })
})

