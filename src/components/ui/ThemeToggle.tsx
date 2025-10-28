import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '../../contexts/ThemeContext'
import { colors as colorConstants } from '../../constants/colors'

interface ThemeToggleProps {
  size?: number
  style?: any
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 24, 
  style 
}) => {
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <TouchableOpacity
      testID="theme-toggle"
      style={[styles.container, { backgroundColor: colors.surface }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Icon
        name={theme === 'light' ? 'dark-mode' : 'light-mode'}
        size={size}
        color={colors.textPrimary}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colorConstants.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
})
