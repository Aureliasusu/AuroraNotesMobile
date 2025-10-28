import React from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'
import { colors } from '../../constants/colors'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  onPress?: (event: GestureResponderEvent) => void
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'small' | 'medium' | 'large'
  margin?: 'none' | 'small' | 'medium' | 'large'
  shadow?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  shadow = true,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background.primary,
      borderRadius: 8,
    }

    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = colors.background.primary
        if (shadow) {
          baseStyle.shadowColor = colors.shadow.light
          baseStyle.shadowOffset = { width: 0, height: 2 }
          baseStyle.shadowOpacity = 0.1
          baseStyle.shadowRadius = 4
          baseStyle.elevation = 3
        }
        break
      case 'outlined':
        baseStyle.backgroundColor = colors.background.primary
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.border.light
        break
      default:
        baseStyle.backgroundColor = colors.background.primary
        if (shadow) {
          baseStyle.shadowColor = colors.shadow.light
          baseStyle.shadowOffset = { width: 0, height: 1 }
          baseStyle.shadowOpacity = 0.05
          baseStyle.shadowRadius = 2
          baseStyle.elevation = 1
        }
    }

    // Padding styles
    switch (padding) {
      case 'none':
        baseStyle.padding = 0
        break
      case 'small':
        baseStyle.padding = 8
        break
      case 'large':
        baseStyle.padding = 24
        break
      default: // medium
        baseStyle.padding = 16
    }

    // Margin styles
    switch (margin) {
      case 'small':
        baseStyle.margin = 8
        break
      case 'medium':
        baseStyle.margin = 16
        break
      case 'large':
        baseStyle.margin = 24
        break
      default: // none
        baseStyle.margin = 0
    }

    return baseStyle
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  )
}