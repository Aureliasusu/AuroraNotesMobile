import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Colors } from '../../constants/colors'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: variant === 'outline' ? 1 : 0,
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = 12
        baseStyle.paddingVertical = 8
        baseStyle.minHeight = 32
        break
      case 'large':
        baseStyle.paddingHorizontal = 24
        baseStyle.paddingVertical = 16
        baseStyle.minHeight = 56
        break
      default: // medium
        baseStyle.paddingHorizontal = 16
        baseStyle.paddingVertical = 12
        baseStyle.minHeight = 44
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? Colors.gray300 : Colors.primary
        break
      case 'secondary':
        baseStyle.backgroundColor = disabled ? Colors.gray300 : Colors.secondary
        break
      case 'outline':
        baseStyle.backgroundColor = 'transparent'
        baseStyle.borderColor = disabled ? Colors.gray300 : Colors.primary
        break
      case 'ghost':
        baseStyle.backgroundColor = 'transparent'
        break
    }

    if (fullWidth) {
      baseStyle.width = '100%'
    }

    return baseStyle
  }

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    }

    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14
        break
      case 'large':
        baseTextStyle.fontSize = 18
        break
      default: // medium
        baseTextStyle.fontSize = 16
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseTextStyle.color = disabled ? Colors.gray500 : Colors.white
        break
      case 'outline':
        baseTextStyle.color = disabled ? Colors.gray500 : Colors.primary
        break
      case 'ghost':
        baseTextStyle.color = disabled ? Colors.gray500 : Colors.primary
        break
    }

    return baseTextStyle
  }

  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}