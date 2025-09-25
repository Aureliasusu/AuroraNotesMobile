import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Colors } from '../../constants/colors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  helperText?: string
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  labelStyle?: TextStyle
  errorStyle?: TextStyle
  helperStyle?: TextStyle
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'small' | 'medium' | 'large'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'medium',
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: 16,
    }

    return baseStyle
  }

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: Colors.surface,
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = 12
        baseStyle.paddingVertical = 8
        baseStyle.minHeight = 36
        break
      case 'large':
        baseStyle.paddingHorizontal = 16
        baseStyle.paddingVertical = 16
        baseStyle.minHeight = 56
        break
      default: // medium
        baseStyle.paddingHorizontal = 12
        baseStyle.paddingVertical = 12
        baseStyle.minHeight = 44
    }

    // Variant styles
    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = Colors.surfaceSecondary
        baseStyle.borderWidth = 0
        break
      case 'outlined':
        baseStyle.backgroundColor = Colors.surface
        baseStyle.borderWidth = 1
        break
      default:
        baseStyle.backgroundColor = Colors.surface
        baseStyle.borderWidth = 1
    }

    // Focus and error states
    if (isFocused) {
      baseStyle.borderColor = Colors.primary
    } else if (error) {
      baseStyle.borderColor = Colors.error
    } else {
      baseStyle.borderColor = Colors.border
    }

    return baseStyle
  }

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: Colors.textPrimary,
      fontSize: 16,
    }

    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14
        break
      case 'large':
        baseStyle.fontSize = 18
        break
      default: // medium
        baseStyle.fontSize = 16
    }

    return baseStyle
  }

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.textSecondary,
      marginBottom: 8,
    }

    if (error) {
      baseStyle.color = Colors.error
    }

    return baseStyle
  }

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: 12,
      color: Colors.error,
      marginTop: 4,
    }
  }

  const getHelperStyle = (): TextStyle => {
    return {
      fontSize: 12,
      color: Colors.textTertiary,
      marginTop: 4,
    }
  }

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.textTertiary}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={[getHelperStyle(), helperStyle]}>{helperText}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 8,
  },
})