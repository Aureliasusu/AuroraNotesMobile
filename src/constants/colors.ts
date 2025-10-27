/**
 * Color theme constants for Aurora Notes Mobile
 * Centralized color management for consistent theming
 */

export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Gray colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#1e1e1e',
    darkSecondary: '#2d2d2d',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6b7280',
    quaternary: '#9ca3af',
    inverse: '#ffffff',
    dark: '#d4d4d4',
  },

  // Border colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#404040',
    transparent: 'transparent',
  },

  // Shadow colors
  shadow: {
    light: '#000000',
    dark: '#000000',
  },

  // Code editor colors (dark theme)
  code: {
    background: '#1e1e1e',
    backgroundSecondary: '#2d2d2d',
    text: '#d4d4d4',
    textSecondary: '#6b7280',
    border: '#404040',
    comment: '#6b7280',
    keyword: '#d4d4d4',
    string: '#d4d4d4',
    number: '#d4d4d4',
  },

  // Code editor colors (light theme)
  codeLight: {
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    text: '#333333',
    textSecondary: '#9ca3af',
    border: '#e5e7eb',
    comment: '#9ca3af',
    keyword: '#333333',
    string: '#333333',
    number: '#333333',
  },
} as const

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Common color combinations
export const commonColors = {
  // Button colors
  button: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryDisabled: colors.gray[400],
    secondary: colors.gray[100],
    secondaryHover: colors.gray[200],
    danger: colors.error[500],
    dangerHover: colors.error[600],
  },

  // Card colors
  card: {
    background: colors.background.primary,
    border: colors.border.light,
    shadow: colors.shadow.light,
  },

  // Input colors
  input: {
    background: colors.background.primary,
    border: colors.border.light,
    borderFocus: colors.primary[500],
    placeholder: colors.text.quaternary,
  },

  // Status colors
  status: {
    online: colors.success[500],
    offline: colors.gray[400],
    error: colors.error[500],
    warning: colors.warning[500],
  },
} as const

export default colors