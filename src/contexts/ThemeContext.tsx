import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors, DarkColors } from '../constants/colors'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  colors: typeof Colors
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  // Load theme from storage on app start
  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme)
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      await AsyncStorage.setItem('theme', newTheme)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const colors = theme === 'dark' ? DarkColors : Colors

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
