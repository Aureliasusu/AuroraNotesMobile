import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors } from '../../constants/colors'

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
        baseStyle.backgroundColor = disabled ? colors.gray[300] : colors.primary[500]
        break
      case 'secondary':
        baseStyle.backgroundColor = disabled ? colors.gray[300] : colors.gray[500]
        break
      case 'outline':
        baseStyle.backgroundColor = 'transparent'
        baseStyle.borderColor = disabled ? colors.gray[300] : colors.primary[500]
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
        baseTextStyle.color = disabled ? colors.gray[500] : colors.text.inverse
        break
      case 'outline':
        baseTextStyle.color = disabled ? colors.gray[500] : colors.primary[500]
        break
      case 'ghost':
        baseTextStyle.color = disabled ? colors.gray[500] : colors.primary[500]
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
      testID={loading ? 'button-loading' : 'button'}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.text.inverse}
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